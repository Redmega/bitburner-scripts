import type { Cheat as ICheat } from "scripts/util";
import type { NS } from "types/bitburner";

interface GithubContentResponse {
  path: string;
  type: string;
  download_url: string;
}

let Cheat: typeof ICheat;

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
  await ns.wget(
    "https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/scripts/util.js",
    "/scripts/util.js"
  );
  ({ Cheat } = await import("scripts/util"));

  const files = await fetchFiles("dist/scripts");

  for (const file of files) {
    ns.tprintf("Downloading %s", file.path);
    await ns.wget(file.download_url, file.path.replace("dist", ""));
  }

  ns.tprintf("Downloaded %d files", files.length);
}
