/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobService } from "windmill-client";
import { Preview } from "windmill-client";

declare global {
  // eslint-disable-next-line no-var
  var windmill:
    | {
        workspace: string | undefined;
        email: string | undefined;
        username: string | undefined;
      }
    | undefined;
}

export const workspace: string =
  globalThis.windmill?.workspace ?? import.meta.env.VITE_WORKSPACE;
export const email: string =
  globalThis.windmill?.email ?? import.meta.env.VITE_EMAIL;
export const username: string =
  globalThis.windmill?.username ?? import.meta.env.VITE_USERNAME;

export function getUser() {
  return import.meta.env.USER;
}

export async function executeInlineScript(
  language: "deno" | "python3" | "bash" | "go",
  content: string,
  args: any
): Promise<any> {
  const uuid = await JobService.runScriptPreview({
    workspace: workspace,
    requestBody: {
      content,
      args,
      language: language as Preview.language,
    },
  });
  return getResult(uuid);
}

export async function executeWorkspaceScript(
  path: string,
  args: any
): Promise<any> {
  const uuid = await JobService.runScriptByPath({
    workspace: workspace,
    path,
    requestBody: {
      args,
    },
  });
  return getResult(uuid);
}

export async function executeWorkspaceFlow(
  path: string,
  args: any
): Promise<any> {
  const uuid = await JobService.runFlowByPath({
    workspace: workspace,
    path,
    requestBody: {
      args,
    },
  });
  return getResult(uuid);
}

async function getResult(uuid: string): Promise<any> {
  let jobCompleted = false;
  let jobRunning = false;
  while (!jobCompleted) {
    const { running, completed } = await JobService.getJobUpdates({
      workspace: workspace,
      id: uuid,
      running: jobRunning,
    });
    if (!jobRunning && running) {
      jobRunning = true;
    }
    jobCompleted = completed ?? false;
  }
  return JobService.getCompletedJobResult({
    workspace: workspace,
    id: uuid,
  });
}
