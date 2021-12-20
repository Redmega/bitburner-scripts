/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */
/** @param {string} command* @returns {void}

*/
export function cmd(command) {
    const input = Cheat.doc.getElementById("terminal-input");
    input.value = command;
    const handler = Object.keys(input)[1];
    input[handler].onChange({ target: input });
    input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
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
            requiredHackingLevel: ns.getServerRequiredHackingLevel(name),
            requiredOpenPorts: ns.getServerNumPortsRequired(name),
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
/**
 *
 */
export class Options {
    args;
    values = {};
    constructor(args) {
        this.args = args;
        let tuple = [];
        for (const arg of args) {
            // handle string args
            if (typeof arg === "string") {
                if (arg.startsWith("--")) {
                    tuple.push(arg);
                }
                else if (arg.startsWith("-")) {
                    this.values[arg] = true;
                    tuple = [];
                }
                else {
                    if (tuple.length === 1) {
                        this.values[tuple[0]] = arg;
                        tuple = [];
                    }
                    else {
                        throw new Error("Unpaired raw value");
                    }
                }
            }
        }
    }
    add(key, value) {
        this.values[key] = value;
    }
}
/**
 * Bypass document RAM cost
 */
export class Cheat {
    static get doc() {
        return globalThis["document"];
    }
    static get win() {
        return globalThis;
    }
}
