import { getServers, cmd } from "/scripts/util.js";
/**
 * Generates a connection path and copies it to the clipboard
 * @param {NS} ns
*/
export async function main(ns) {
    const target = ns.args[0];
    if (typeof target !== "string")
        throw new Error("Invalid target.");
    const server = getServers(ns).find((s) => s.name === target);
    const command = `connect ${server.path.join("; connect ")};`;
    cmd(command);
}
