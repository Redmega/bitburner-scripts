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
    for (const file of files) {
        const path = file.path.replace("dist", "");
        ns.tprintf("INFO Downloading %s", path);
        if (ns.ps().some((p) => p.filename === path)) {
            ns.tprintf("WARN Killing %s", path);
            ns.scriptKill(path, "home");
        }
        await ns.wget(`${file.download_url}?t=${Date.now()}`, path);
    }
    ns.tprintf("SUCCESS Downloaded %d files", files.length);
}
