import { getServers } from "/scripts/util.js";
/** @param {NS} ns*/
export async function main(ns) {
    const servers = getServers(ns).filter((s) => s.root && s.maxMoney > 0);
    for (const server of servers) {
        ns.run("/scripts/basic/hack_loop.js", 1, server.name);
    }
}
