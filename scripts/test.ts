export async function main(x: string) {
  console.log("Hello from test.ts");
  return foo(x);
}

function foo(x: string): string {
  return "FOO: " + x;
}
