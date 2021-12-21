import { getServers } from "/scripts/util.js";
import { calculateGrowthThreadsWithFormula } from "/scripts/milk/util.js";
let ns;
const RUNNING_PROCESSES = {
    hack: {
        pid: 0,
        time: 0,
    },
    grow: {
        pid: 0,
        time: 0,
    },
    weaken: {
        pid: 0,
        time: 0,
    },
};
/** @param {NS} _ns*/
export async function main(_ns) {
    ns = _ns;
    let activeServer = "";
    while (true) {
        const servers = getServers(ns).filter((s) => s.root);
        const bestServer = findOptimal(servers);
        if (bestServer.name !== activeServer) {
            ns.tprintf('Milking "%s"', bestServer.name);
            Object.values(RUNNING_PROCESSES).forEach(({ pid }) => ns.kill(pid, "home"));
            activeServer = bestServer.name;
        }
        const availableMoney = ns.getServerMoneyAvailable(bestServer.name);
        const hackThreads = ns.hackAnalyzeThreads(bestServer.name, bestServer.maxMoney);
        const weakenThreads = 2000;
        const growthThreads = calculateGrowthThreadsWithFormula(ns, ns.getServer(bestServer.name), ns.getPlayer(), availableMoney, bestServer.maxMoney);
        for (const process in RUNNING_PROCESSES) {
            if (!checkPid(RUNNING_PROCESSES[process])) {
                RUNNING_PROCESSES[process] = 0;
            }
        }
        const growTime = ns.getGrowTime(bestServer.name);
        const growFinish = Date.now() + growTime;
        if (!RUNNING_PROCESSES.grow.pid && availableMoney < bestServer.maxMoney) {
            const pid = ns.run("/scripts/milk/grow.js", growthThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.grow = { pid, time: growTime };
        }
        const weakenTime = ns.getWeakenTime(bestServer.name);
        const weakenFinish = Date.now() + weakenTime;
        if (!RUNNING_PROCESSES.weaken &&
            (!RUNNING_PROCESSES.grow || growFinish < weakenFinish) &&
            ns.getServerSecurityLevel(bestServer.name) >
                ns.getServerMinSecurityLevel(bestServer.name)) {
            // Figure out how long to get security level down to 0
            const pid = ns.run("/scripts/milk/weaken.js", weakenThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.weaken = { pid, time: weakenTime };
        }
        const hackTime = ns.getHackTime(bestServer.name);
        const hackFinish = Date.now() + hackTime;
        if (hackThreads > 0 &&
            !RUNNING_PROCESSES.hack &&
            !RUNNING_PROCESSES.grow &&
            (!RUNNING_PROCESSES.weaken || weakenFinish <= hackFinish)) {
            const pid = ns.run("/scripts/milk/hack.js", hackThreads, bestServer.name);
            if (pid)
                RUNNING_PROCESSES.hack = { pid, time: hackTime };
        }
        await ns.sleep(Math.max(5000, Math.min(RUNNING_PROCESSES.grow.time, RUNNING_PROCESSES.weaken.time)));
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
