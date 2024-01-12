import { useCallback, useEffect, useState } from "react";
import "./App.css";
import testScript from "../scripts/test.ts?raw";
import windmillLogo from "./assets/logo.svg";
import { GlobalUserInfo, OpenAPI, Preview, UserService } from "windmill-client";
import { executeInlineScript } from "./utils";

function App() {
  const [result, setResult] = useState("");
  const [arg, setArg] = useState("");
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState<GlobalUserInfo>();

  const executeTest = useCallback(async () => {
    setLoading(true);
    const result = await executeInlineScript(
      Preview.language.DENO,
      testScript,
      {
        x: arg,
      }
    );
    setLoading(false);
    setResult(result);
  }, [arg]);

  const populateUser = useCallback(async () => {
    const userDetails = await UserService.globalWhoami();
    setUserDetails(userDetails);
  }, []);

  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      console.log("Running in development mode");
      OpenAPI.TOKEN = import.meta.env.VITE_TOKEN;
    }
    populateUser();
    executeTest();
  }, [executeTest, populateUser]);

  return (
    <>
      <img src={windmillLogo} className="logo windmill" alt="Windmill logo" />

      <h1 className="my-2">Windmill React App</h1>
      <div>Name: {userDetails?.name}</div>
      <div>Email: {userDetails?.email}</div>

      <pre className="text-left border p-2 bg-gray-50 mt-4">
        <code>{testScript}</code>
      </pre>

      <div className="mt-2">
        <input
          type="text"
          value={arg}
          onChange={(e) => setArg(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <button onClick={() => executeTest()}>Execute</button>
      </div>
      {loading && <div>Loading...</div>}
      <h2 className="my-4">Result</h2>
      <pre className="text-left">{result}</pre>
    </>
  );
}

export default App;
