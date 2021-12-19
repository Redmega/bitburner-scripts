/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */
/**
 * Gets all scannable servers, including depth, root access, and path info
 * @FIXME IServer doesn't convert to jsdoc returns nicely.
 * @param {NS} ns
*/
export function getServers(ns) {
    let result = [];
    let visited = { home: 0 };
    let queue = Object.keys(visited);
    let name;
    while ((name = queue.pop())) {
        let depth = visited[name];
        result.push({
            name,
            depth,
            root: ns.hasRootAccess(name),
            path: result
                .slice(findLastIndex(result, (s) => s.depth <= 1))
                .map((s) => s.name)
                .concat(name),
            maxMoney: ns.getServerMaxMoney(name),
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
 * @param {T[]} array
* @param {(value: T, index: number, array: T[]) => boolean} predicate
* @returns {number}
*/
export function findLastIndex(array, predicate) {
    let l = array.length;
    while (l--) {
        if (predicate(array[l], l, array))
            return l;
    }
    return -1;
}
