const { spawnSync } = require("child_process");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const prismaBin = path.resolve(rootDir, "node_modules/prisma/build/index.js");
const nextBin = path.resolve(rootDir, "node_modules/next/dist/bin/next");

console.log("📦 Generating Prisma Client...");
try {
  spawnSync("node", [prismaBin, "generate"], {
    stdio: "inherit",
    cwd: rootDir,
  });
} catch (e) {}

console.log("🚀 Building Next.js App...");
const nextBuild = spawnSync("node", [nextBin, "build"], {
  stdio: "inherit",
  cwd: rootDir,
});

process.exit(nextBuild.status || 0);
