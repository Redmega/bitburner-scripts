import type { NS } from "types/NetscriptDefinitions";
import { IServer } from "types/scripts";

import { getServers } from "/scripts/util.js";

let ns: NS;

export async function main(_ns: NS) {
  ns = _ns;
  const { name, maxMoney } = findOptimal(getServers(ns).filter((s) => s.root));

  let availableMoney = ns.getServerMoneyAvailable(name);

  let growThreads = Math.ceil(
    ns.growthAnalyze(
      name,
      Math.ceil(maxMoney / (availableMoney || 1)),
      ns.getServer("home").cpuCores
    )
  );

  /**
   * Priming the server
   */
  if (availableMoney < maxMoney) {
    const [weakenTime, growTime] = [
      ns.getWeakenTime(name),
      ns.getGrowTime(name),
    ];

    const scripts = [
      // Pass max weaken threads because weakenThreads accounts for currentSecurity.
      ["weaken", 2000, name, 0],
      ["grow", growThreads, name, 0],
    ];
    if (weakenTime < growTime) {
      scripts[0][3] = 1000 + (growTime - weakenTime);
    }

    // @ts-ignore
    scripts.forEach((s) => run(...s));
    await ns.sleep(Math.max(weakenTime, growTime) + 1000);

    availableMoney = ns.getServerMoneyAvailable(name);
  }

  /**
   * Security Check
   */
  const minSecurity = ns.getServerMinSecurityLevel(name);
  let currentSecurity = ns.getServerSecurityLevel(name);

  // We double check that security is min value
  if (currentSecurity > minSecurity) {
    const weakenTime = ns.getWeakenTime(name);

    run("weaken", 2000, name, 0);
    await ns.sleep(weakenTime + 1000);

    currentSecurity = ns.getServerSecurityLevel(name);
  }

  /**
   * Main Hack Loop
   */
  const player = ns.getPlayer();
  const server = ns.getServer(name);

  growThreads = Math.ceil(
    5 /
      (ns.formulas.hacking.growPercent(
        server,
        1,
        player,
        ns.getServer("home").cpuCores
      ) -
        1)
  );
  const hackThreads = ns.hackAnalyzeThreads(name, availableMoney);
  const weakenThreads = 2000;

  const weakenTime = ns.getWeakenTime(name);
  const growTime = ns.getGrowTime(name);
  const hackTime = ns.getHackTime(name);

  const sleepOffset = 5000;

  // FIXME: Goes almost immediately out of sync after the first round.
  while (true) {
    let weakenSleep = 0;
    let growSleep = weakenTime - growTime - sleepOffset / 4;
    let hackSleep = weakenTime - hackTime - sleepOffset / 2;

    ns.print(`Weaken duration: ${weakenTime}`);
    run("weaken", weakenThreads, name, weakenSleep);
    ns.print(`Grow duration: ${growTime}`);
    run("grow", growThreads, name, growSleep);
    ns.print(`Hack duration: ${hackTime}`);
    run("hack", hackThreads, name, hackSleep);

    await ns.sleep(Math.max(weakenTime, growTime, hackTime) + sleepOffset);
  }
}

/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/rk6ltp/565_gb_script_for_hacking_servers/
 * Finds the best server to hack.
 * The algorithm works by assigning a value to each server and returning the max value server.
 * The value is the serverMaxMoney divided by the sum of the server's weaken time, grow time, and hack time.
 * You can easily change this function to choose a server based on whatever optimizing algorithm you want,
 *  just return the server name to hack.
 */
function findOptimal(servers: IServer[]) {
  let optimalServer = servers.find((s) => s.name === "n00dles");
  let optimalRatio = 0;

  for (const server of servers) {
    const { name, maxMoney } = server;
    const cycleTime = Math.max(
      ns.getWeakenTime(name),
      ns.getGrowTime(name),
      ns.getHackTime(name)
    );
    const workRatio = maxMoney / cycleTime;
    if (workRatio > optimalRatio) {
      optimalRatio = workRatio;
      optimalServer = server;
    }
  }
  return optimalServer;
}

/**
 * Check if a script is running. We do it once here to save RAM
 */
function checkPid(pid: number) {
  return ns.getRunningScript(pid, "home");
}

/**
 * Helper so we don't have to keep writing our script paths
 */
function run(
  script: "grow" | "hack" | "weaken",
  threads: number,
  target: string,
  sleep: number
) {
  return ns.run(`/scripts/milk/${script}.js`, threads, target, sleep);
}
