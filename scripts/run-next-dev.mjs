import { spawn } from "node:child_process";
import path from "node:path";

const explicitDistDir = process.env.NEXT_DIST_DIR;
const distDir = explicitDistDir || ".next-dev";
const nextBin = path.resolve(process.cwd(), "node_modules/next/dist/bin/next");

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_DIST_DIR: distDir,
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start Next dev server.", error);
  process.exit(1);
});
