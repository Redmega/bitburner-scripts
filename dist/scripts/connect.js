import { getServerPath } from "/scripts/util/game.js";
import { cmd } from "/scripts/util/dom.js";
/** @param {NS} ns*/
export async function main(ns) {
    const [target] = ns.args;
    if (typeof target !== "string")
        throw new Error("Invalid target.");
    const path = getServerPath(ns, target);
    if (!path) {
        throw new Error("Path is undefined");
    }
    const command = `home; connect ${path.join("; connect ")};`;
    cmd(command);
}
