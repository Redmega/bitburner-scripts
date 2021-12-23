import { Cheat } from "/scripts/util.js";
import type { NS } from "types/NetscriptDefinitions";

interface GithubContentResponse {
  path: string;
  type: string;
  download_url: string;
}

const getGithubApiUrl = (path) =>
  `https://api.github.com/repos/redmega/bitburner-scripts/contents/${path}`;

async function fetchFiles(path: string) {
  const response = await Cheat.win.fetch(getGithubApiUrl(path));
  let body: GithubContentResponse[] = await response.json();

  for (const item of body) {
    if (item.type === "dir") {
      body.push(...(await fetchFiles(item.path)));
    }
  }

  return body.filter((item) => item.type === "file");
}

export async function main(ns: NS) {
  const files = await fetchFiles("dist/scripts");
  const processes = ns.ps();
  for (const file of files) {
    const path = file.path.replace("dist", "");
    const process = processes.find((p) => p.filename === path);
    ns.tprintf("INFO Downloading %s", path);

    if (process) {
      ns.tprintf("WARN Killing %s", path);
      ns.scriptKill(path, "home");
    }

    await ns.wget(`${file.download_url}?t=${Date.now()}`, path);
    if (process?.args.includes("--restart")) {
      ns.run(path, process.threads, ...process.args);
      ns.tprintf("SUCCESS Restarted %s", path);
    }
  }

  ns.tprintf("SUCCESS Downloaded %d files", files.length);
}
