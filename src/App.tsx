import { useEffect, useState } from "react";
import "./App.css";
import testScript from "../scripts/test.ts?raw";
import windmillLogo from "./assets/logo.svg";
import { OpenAPI, UserService } from "windmill-client";
import { email, executeInlineScript, username } from "./utils";

async function whoami() {
  const res = await UserService.globalWhoami();
  console.log(res);
}

function App() {
  const [result, setResult] = useState("");
  const [arg, setArg] = useState("");
  const [loading, setLoading] = useState(false);

  async function executeTest() {
    setLoading(true);
    const result = await executeInlineScript("deno", testScript, {
      x: arg,
    });
    setLoading(false);
    setResult(result);
  }

  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      console.log("Running in development mode");
      OpenAPI.TOKEN = import.meta.env.VITE_TOKEN;
    }
    whoami();
    executeTest().then();
  }, []);

  return (
    <>
      <img src={windmillLogo} className="logo windmill" alt="Windmill logo" />

      <h1 className="my-2">Windmill React App</h1>
      <div>Username: {username}</div>
      <div>Email: {email}</div>

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
