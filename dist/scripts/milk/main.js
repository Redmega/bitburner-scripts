import { getServers } from "/scripts/util.js";
import { calculateGrowthThreadsWithFormula } from "/scripts/milk/util.js";
let ns;
const RUNNING_PROCESSES = {
    hack: 0,
    grow: 0,
    weaken: 0,
};
/** @param {NS} _ns*/
export async function main(_ns) {
    ns = _ns;
    const servers = getServers(ns).filter((s) => s.root);
    const bestServer = findOptimal(servers);
    while (true) {
        const availableMoney = ns.getServerMoneyAvailable(bestServer.name);
        const hackThreads = ns.hackAnalyzeThreads(bestServer.name, bestServer.maxMoney);
        const weakenThreads = 2000;
        const growthThreads = calculateGrowthThreadsWithFormula(ns, ns.getServer(bestServer.name), ns.getPlayer(), availableMoney, bestServer.maxMoney);
        ns.tprintf("Calculated growth threads: %d", growthThreads);
        ns.tprintf("Calculated hack threads: %d", hackThreads);
        // ns.tprintf("Calculated weaken threads: %d");
        ns.tprintf('Milking "%s"', bestServer.name);
        for (const process in RUNNING_PROCESSES) {
            if (!checkPid(RUNNING_PROCESSES[process])) {
                RUNNING_PROCESSES[process] = 0;
            }
        }
        const growFinish = Date.now() + ns.getGrowTime(bestServer.name);
        if (!RUNNING_PROCESSES.grow && availableMoney < bestServer.maxMoney) {
            const pid = ns.run("/scripts/milk/hack.js", hackThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.grow = pid;
        }
        let weakenFinish = Date.now() + ns.getWeakenTime(bestServer.name);
        if (!RUNNING_PROCESSES.weaken &&
            (!RUNNING_PROCESSES.grow || growFinish < weakenFinish) &&
            ns.getServerSecurityLevel(bestServer.name) >
                ns.getServerMinSecurityLevel(bestServer.name)) {
            // Figure out how long to get security level down to 0
            const pid = ns.run("/scripts/milk/weaken.js", weakenThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.weaken = pid;
        }
        let hackFinish = Date.now() + ns.getHackTime(bestServer.name);
        if (!RUNNING_PROCESSES.hack &&
            !RUNNING_PROCESSES.grow &&
            (!RUNNING_PROCESSES.weaken || weakenFinish <= hackFinish)) {
            const pid = ns.run("/scripts/milk/hack.js", hackThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.hack = pid;
        }
        await ns.sleep(5000);
    }
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
/**
 * Check if a script is running. We do it once here to save RAM
 * @param {number} pid
*/
function checkPid(pid) {
    return ns.getRunningScript(pid, "home");
}
