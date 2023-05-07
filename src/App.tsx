import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import testScript from "../scripts/test.ts?raw";
import { OpenAPI, UserService } from "windmill-client";

async function whoami() {
  const res = await UserService.globalWhoami();
  console.log(res);
}

function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (import.meta.env.MODE === "development") {
      console.log("Running in development mode");
      OpenAPI.BASE = import.meta.env.VITE_WINDMILL_BASE_URL;
      OpenAPI.TOKEN = import.meta.env.VITE_TOKEN;
      console.log(OpenAPI.BASE);
      console.log(OpenAPI.TOKEN);
    }

    whoami();
  }, []);
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>FOO{JSON.stringify(import.meta.env)}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">{testScript}</p>
    </>
  );
}

export default App;
