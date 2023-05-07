/* eslint-disable @typescript-eslint/no-explicit-any */
import { JobService } from "windmill-client";
import { Preview } from "windmill-client";

declare global {
  // eslint-disable-next-line no-var
  var workspace: string | undefined;
  // eslint-disable-next-line no-var
  var email: string | undefined;
  // eslint-disable-next-line no-var
  var username: string | undefined;
}

export function getWorkspace(): string {
  return globalThis.workspace ?? import.meta.env.VITE_WORKSPACE;
}
export function getEmail(): string {
  return globalThis.email ?? import.meta.env.VITE_EMAIL;
}
export function getUsername(): string {
  return globalThis.username ?? import.meta.env.VITE_USERNAME;
}

export function getUser() {
  return import.meta.env.USER;
}

export async function executeInlineScript(
  language: "deno" | "python3" | "bash" | "go",
  content: string,
  args: any
): Promise<any> {
  const uuid = await JobService.runScriptPreview({
    workspace: getWorkspace(),
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
    workspace: getWorkspace(),
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
    workspace: getWorkspace(),
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
      workspace: getWorkspace(),
      id: uuid,
      running: jobRunning,
    });
    if (!jobRunning && running) {
      jobRunning = true;
    }
    jobCompleted = completed ?? false;
  }
  return JobService.getCompletedJobResult({
    workspace: getWorkspace(),
    id: uuid,
  });
}
