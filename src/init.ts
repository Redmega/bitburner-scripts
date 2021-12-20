import type { NS } from "types/bitburner";

interface GithubContentResponse {
  path: string;
  type: string;
  download_url: string;
}

export async function main(ns: NS) {
  ns.tprintf("INFO Initializing Scripts");

  ns.tprintf("INFO Downloading util script.");
  await ns.wget(
    "https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/scripts/util.js",
    "/scripts/util.js"
  );

  ns.tprintf("INFO Downloading sync script.");
  await ns.wget(
    "https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/sync.js",
    "sync.js"
  );

  ns.tprintf("INFO Spawning sync script");
  const pid = await ns.exec("sync.js", ns.getHostname(), 1);

  if (pid > 0) {
    ns.exit();
  }
}
