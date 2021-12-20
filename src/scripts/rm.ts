import type { NS } from "types/bitburner";
import { getServers, Options } from "scripts/util";

interface IOptions {
  path: string;
  "-r": boolean;
  "-f": boolean;
}

function args(args: (string | number)[]) {
  let [path, ...restOpts] = args;
  if (typeof path === "string" && path.startsWith("-")) {
    restOpts.unshift(path);
    path = undefined;
  }
  const options = new Options<IOptions>(restOpts);
  options.add("path", path);
  return options;
}

export async function main(ns: NS<(keyof IOptions)[]>) {
  const options = args(ns.args);

  const files = ns.ls("home", options.values.path);

  if (files.length === 0) {
    ns.tprintf("ERROR File not found");
    return;
  } else if (files.length > 1 && !options.values["-r"]) {
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
