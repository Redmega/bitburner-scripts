import { Cheat } from "scripts/util";
import type { NS } from "types/bitburner";

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

  for (const file of files) {
    ns.tprintf("INFO Downloading %s", file.path);
    await ns.wget(
      `${file.download_url}?t=${Date.now()}`,
      file.path.replace("dist", "")
    );
  }

  ns.tprintf("SUCCESS Downloaded %d files", files.length);
}
