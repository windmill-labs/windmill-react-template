import { useCallback, useEffect, useState } from "react";
import "./App.css";
import initialTestScript from "../scripts/test.ts?raw";
import windmillLogo from "./assets/logo.svg";
import { GlobalUserInfo, OpenAPI, Preview, UserService } from "windmill-client";
import { executeInlineScript } from "./utils";

function useCodeEditor(initalValue: string = initialTestScript): {
  code: string;
  handleCodeChange: React.ChangeEventHandler<HTMLTextAreaElement>;
} {
  const [code, setCode] = useState<string>(initalValue);

  const handleCodeChange = useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >((e) => setCode(e.target.value), []);

  return {
    code,
    handleCodeChange,
  };
}

function useCodeExecution(code: string, arg: string, executeOnMount = true) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const execute = useCallback(async () => {
    setLoading(true);
    const result = await executeInlineScript(Preview.language.DENO, code, {
      x: arg,
    });
    setLoading(false);
    setResult(result);
  }, [arg, code]);

  // Execute once on mount. Intentionally omit dependency on execute otherwise it executes on all changes to arg/code
  useEffect(() => {
    if (executeOnMount) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    result,
    execute,
  };
}

function useUser(): {
  name: string;
  email: string;
} {
  const [userDetails, setUserDetails] = useState<GlobalUserInfo>();

  const populateUser = useCallback(async () => {
    const userDetails = await UserService.globalWhoami();
    setUserDetails(userDetails);
  }, []);

  useEffect(() => {
    populateUser();
  }, [populateUser]);

  return {
    name: userDetails?.name || "loading...",
    email: userDetails?.email || "loading...",
  };
}

if (import.meta.env.MODE === "development") {
  console.debug("Running in development mode");
  OpenAPI.TOKEN = import.meta.env.VITE_TOKEN;
}

function App() {
  const [arg, setArg] = useState("");
  
  const { code, handleCodeChange } = useCodeEditor();
  const userDetails = useUser();

  const { loading, execute, result } = useCodeExecution(code, arg);

  return (
    <>
      <img src={windmillLogo} className="logo windmill" alt="Windmill logo" />

      <h1 className="my-2">Windmill React App</h1>
      <div>Name: {userDetails?.name}</div>
      <div>Email: {userDetails?.email}</div>

      <pre className="text-left border p-2 bg-gray-50 mt-4">
        <code className="h-full">
          <textarea style={{ minHeight: "16rem" }} onChange={handleCodeChange}>
            {code}
          </textarea>
        </code>
      </pre>

      <div className="mt-2">
        <input
          type="text"
          value={arg}
          onChange={(e) => setArg(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <button onClick={execute}>Execute</button>
      </div>
      {loading && <div>Loading...</div>}
      <h2 className="my-4">Result</h2>
      <pre className="text-left">{result}</pre>
    </>
  );
}

export default App;
