/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */

/**
 * Gets all scannable servers, including depth, root access, and path info
 * 
 * @param {NS} ns 
 * @returns {Array} result
 */
export function getServers(ns) {
    let result = [];
    let visited = { 'home': 0 };
    let queue = Object.keys(visited);
    let name;
    while ((name = queue.pop())) {
        let depth = visited[name];
        result.push({
            name,
            depth,
            root: ns.hasRootAccess(name),
            path: result.slice(findLastIndex(result, s => s.depth <= 1)).map(s => s.name).concat(name)
        });

        for (const server of ns.scan(name)) {
            if (visited[server] === undefined) {
                queue.push(server);
                visited[server] = depth + 1;
            }
        }
    }
    return result;
}

/**
 * like findIndex, but reverse
 * 
 * @param {Array} array 
 * @param {Function} fn 
 * @returns {number} result
 */
export function findLastIndex(array, fn) {
    let l = array.length;
    while (l--) {
        if (fn(array[l], l, array)) return l;
    }
    return -1;
}