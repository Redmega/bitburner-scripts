import { getServerNames } from "/scripts/util/game.js";
/** @param {NS} ns*/
export async function main(ns) {
    const servers = getServerNames(ns);
    for (const name of servers) {
        if (ns.getServerMaxMoney(name) > 0 && ns.hasRootAccess(name))
            ns.run("/scripts/milk/main.js", 1, name);
    }
}
