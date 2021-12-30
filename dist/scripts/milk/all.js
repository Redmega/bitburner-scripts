import { getServerNames } from "/scripts/util/game.js";
/** @param {NS} ns*/
export async function main(ns) {
    const servers = getServerNames(ns);
    ns.disableLog("getServerMaxMoney");
    ns.disableLog("hasRootAccess");
    ns.disableLog("getRunningScript");
    ns.disableLog("getHostname");
    for (const name of servers) {
        if (ns.getServerMaxMoney(name) > 0 && ns.hasRootAccess(name) && !ns.getRunningScript("/scripts/milk/main.js", ns.getHostname(), name))
            ns.run("/scripts/milk/main.js", 1, name);
    }
}
