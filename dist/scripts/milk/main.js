import { getServers } from "/scripts/util.js";
let ns;
/** @param {NS} _ns*/
export async function main(_ns) {
    ns = _ns;
    const servers = getServers(ns).filter((s) => s.root);
    const bestServer = findOptimal(servers);
    ns.tprintf("Best Server for hacking: %s; max money: %s", bestServer.name, bestServer.maxMoney);
}
/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/rk6ltp/565_gb_script_for_hacking_servers/
 * Finds the best server to hack.
 * The algorithm works by assigning a value to each server and returning the max value server.
 * The value is the serverMaxMoney divided by the sum of the server's weaken time, grow time, and hack time.
 * You can easily change this function to choose a server based on whatever optimizing algorithm you want,
 *  just return the server name to hack.
 * @param {IServer[]} servers
*/
function findOptimal(servers) {
    let optimalServer = servers.find((s) => s.name === "n00dles");
    let optimalRatio = 0;
    for (const server of servers) {
        const cycleTime = ns.getWeakenTime(server.name) +
            ns.getGrowTime(server.name) +
            ns.getHackTime(server.name);
        const workRatio = server.maxMoney / cycleTime;
        if (workRatio >= optimalRatio) {
            optimalRatio = workRatio;
            optimalServer = server;
        }
    }
    return optimalServer;
}
