const REQUIRED_STARTUP_SCRIPTS = [
    ["https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/scripts/util/dom.js", "/scripts/util/dom.js"],
    [
        "https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/scripts/util/github.js",
        "/scripts/util/github.js",
    ],
    ["https://raw.githubusercontent.com/Redmega/bitburner-scripts/main/dist/sync.js", "sync.js"],
];
/** @param {NS} ns*/
export async function main(ns) {
    ns.tprintf("INFO Initializing Required Scripts");
    for (const [url, path] of REQUIRED_STARTUP_SCRIPTS) {
        const success = await ns.wget(`${url}?t=${Date.now()}`, path);
        if (!success) {
            ns.tprintf("ERROR Failed to download required script: %s", path);
        }
    }
    ns.tprintf("INFO Spawning sync script");
    const pid = await ns.run("sync.js", 1);
    if (pid > 0) {
        ns.exit();
    }
    else {
        ns.tprintf("ERROR Failed to start sync.js. Check logs for more info.");
    }
}
