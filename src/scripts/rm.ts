import type { NS } from "types/NetscriptDefinitions";

type Args = [path: string, recursive: "-r"];
export async function main(ns: NS) {
  const [path, recursive] = ns.args as Args;

  const files = ns.ls("home", path);

  if (files.length === 0) {
    ns.tprintf("ERROR File not found");
    return;
  } else if (files.length > 1 && recursive !== "-r") {
    ns.tprintf(
      "ERROR Multiple files found with that grep. Please use `-r` for recursive deletion.\n%j",
      files
    );
    return;
  }
  for (const file of files) {
    ns.rm(file, "home");
  }

  ns.tprintf("SUCCESS Deleted %d files", files.length);
}
