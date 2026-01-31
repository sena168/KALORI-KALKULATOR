import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const configPath = path.join(repoRoot, "config.json");

const configRaw = await readFile(configPath, "utf-8");
const config = JSON.parse(configRaw);
const port = Number(config.devPort) || 8888;

const run = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });

const runShell = (commandString) => {
  if (process.platform === "win32") {
    return run(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", commandString]);
  }
  return run("/bin/sh", ["-lc", commandString]);
};

console.log(`Dev server will run at: http://localhost:${port}/`);

await runShell(`npx kill-port ${port}`);
await runShell(`npx vite --port ${port}`);
