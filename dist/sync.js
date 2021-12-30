import Github from "/scripts/util/github.js";
/** @param {NS} ns*/
export async function main(ns) {
    const startedAt = new Date().toUTCString();
    ns.tprintf("INFO Initializing GitHub Connection");
    const github = new Github(ns);
    ns.tprintf("INFO Fetching contents from GitHub Repo");
    const files = await github.fetchContents("dist/scripts", { recursive: true });
    ns.tprintf("INFO Downloading %d files", files.length);
    const processes = ns.ps();
    for (const file of files) {
        const path = file.path.replace("dist", "");
        const process = processes.find((p) => p.filename === path);
        if (process && !process.args.includes("--no-restart")) {
            ns.tprintf("WARN Killing %s before download", path);
            const success = ns.scriptKill(path, "home");
            if (!success) {
                ns.tprintf("ERROR Failed to kill %s. Skipping...", path);
                continue;
            }
        }
        ns.tprintf("INFO Downloading %s", path);
        const success = await ns.wget(`${file.download_url}`, path);
        if (!success) {
            ns.tprintf("ERROR Failed to download %s", path);
            continue;
        }
        if (process === null || process === void 0 ? void 0 : process.args.includes("--restart")) {
            const pid = ns.run(path, process.threads, ...process.args);
            if (pid > 0) {
                ns.tprintf("SUCCESS Restarted %s", path);
            }
            else {
                ns.tprintf("WARN Failed to restart %s", path);
            }
        }
    }
    await github.updateLastFetched(startedAt);
    ns.tprintf("SUCCESS Downloaded %d files", files.length);
}
