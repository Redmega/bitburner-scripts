/**
 * Gets all scannable servers, including depth, root access, and path info
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 * @FIXME IServer doesn't convert to jsdoc returns nicely.
 * @param {NS} ns
*/
export function getServers(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("enableLog");
    ns.disableLog("scan");
    ns.disableLog("getServerNumPortsRequired");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("hasRootAccess");
    let result = [];
    let visited = { home: 0 };
    let queue = Object.keys(visited);
    let name;
    while ((name = queue.pop())) {
        let depth = visited[name];
        const neighbors = ns.scan(name);
        result.push({
            name,
            depth,
            root: ns.hasRootAccess(name),
            requiredHackingLevel: ns.getServerRequiredHackingLevel(name),
            requiredOpenPorts: ns.getServerNumPortsRequired(name),
            neighbors,
        });
        for (const server of neighbors) {
            if (visited[server] === undefined) {
                queue.push(server);
                visited[server] = depth + 1;
            }
        }
    }
    ns.enableLog("scan");
    ns.enableLog("getServerNumPortsRequired");
    ns.enableLog("getServerRequiredHackingLevel");
    ns.enableLog("hasRootAccess");
    ns.enableLog("disableLog");
    ns.enableLog("enableLog");
    return result;
}
/**
 * Sometimes we just want the names...
 * @param {NS} ns
*/
export function getServerNames(ns) {
    ns.disableLog("scan");
    let result = new Set();
    let queue = ["home"];
    let name;
    while ((name = queue.pop())) {
        result.add(name);
        queue.push(...ns.scan(name).filter((s) => !result.has(s)));
    }
    ns.enableLog("scan");
    return Array.from(result);
}
/**
 * Sometimes we want the path to a server
 * @param {NS} ns
* @param {string} target
*/
export function getServerPath(ns, target) {
    // Memoize our servers so we don't need to loop so much
    const servers = getServers(ns).reduce((record, server) => ({ ...record, [server.name]: server }), {});
    const server = servers[target];
    if (!server) {
        ns.tprint(`ERROR "${target}" not found.`);
        return undefined;
    }
    const path = [server.name];
    // Start searching!
    let lastServer = server;
    while (lastServer.name !== "home") {
        for (const name of lastServer.neighbors) {
            const neighbor = servers[name];
            if (!neighbor)
                continue;
            if (neighbor.name === "home") {
                lastServer = neighbor;
                break;
            }
            if (neighbor.depth < lastServer.depth) {
                path.push(neighbor.name);
                lastServer = neighbor;
                break;
            }
        }
    }
    return path.reverse();
}
