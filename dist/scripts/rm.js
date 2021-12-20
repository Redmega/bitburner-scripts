import { getServers, Options } from "/scripts/util.js";
/** @param {(string | number)[]} args*/
function args(args) {
    let [path, ...restOpts] = args;
    if (typeof path === "string" && path.startsWith("-")) {
        restOpts.unshift(path);
        path = undefined;
    }
    const options = new Options(restOpts);
    options.add("path", path);
    return options;
}
/** @param {NS<(keyof IOptions)[]>} ns*/
export async function main(ns) {
    const options = args(ns.args);
    const files = ns.ls("home", options.values.path);
    if (files.length === 0) {
        ns.tprintf("ERROR File not found");
        return;
    }
    else if (files.length > 1 && !options.values["-r"]) {
        ns.tprintf("ERROR Multiple files found with that grep. Please use `-r` for recursive deletion.\n%j", files);
        return;
    }
    for (const file of files) {
        ns.rm(file, "home");
    }
    ns.tprintf("SUCCESS Deleted %d files", files.length);
}
