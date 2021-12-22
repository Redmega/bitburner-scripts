import { Cheat } from "/scripts/util.js";
const getGithubApiUrl = (path) => `https://api.github.com/repos/redmega/bitburner-scripts/contents/${path}`;
/** @param {string} path*/
async function fetchFiles(path) {
    const response = await Cheat.win.fetch(getGithubApiUrl(path));
    let body = await response.json();
    for (const item of body) {
        if (item.type === "dir") {
            body.push(...(await fetchFiles(item.path)));
        }
    }
    return body.filter((item) => item.type === "file");
}
/** @param {NS} ns*/
export async function main(ns) {
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
        if (process === null || process === void 0 ? void 0 : process.args.includes("--restart")) {
            ns.tprintf("INFO Restarting %s", path);
            ns.run(path, process.threads, ...process.args);
        }
    }
    ns.tprintf("SUCCESS Downloaded %d files", files.length);
}
