import { getServers, cmd } from "/scripts/util.js";
/** @param {NS} ns*/
export async function main(ns) {
    const [target] = ns.args;
    if (typeof target !== "string")
        throw new Error("Invalid target.");
    const server = getServers(ns).find((s) => s.name === target);
    const command = `connect ${server.path.join("; connect ")};`;
    cmd(command);
}
