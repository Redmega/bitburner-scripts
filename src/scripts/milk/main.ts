import { NS } from "types/NetscriptDefinitions";

type Args = [target: string];
export async function main(ns: NS) {
  const [target] = ns.args as Args;

  const maxMoney = ns.getServerMaxMoney(target);

  // First, prime the server.
  if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
    const weakenTime = ns.getWeakenTime(target);
    run(ns, "weaken", { threads: 2000, target });
    await ns.sleep(weakenTime + 1000);
  }

  while (true) {
    const availableMoney = ns.getServerMoneyAvailable(target) || 1;
    const growThreads =
      Math.ceil(
        ns.growthAnalyze(target, Math.ceil(maxMoney / availableMoney), ns.getServer(ns.getHostname()).cpuCores)
      ) || 1;
    const growSecurity = ns.growthAnalyzeSecurity(growThreads);

    const hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMoneyAvailable(target)) || 1;
    const hackSecurity = ns.hackAnalyzeSecurity(hackThreads);
    const weakenGrowThreads = Math.ceil(growSecurity / 0.05);
    const weakenHackThreads = Math.ceil(hackSecurity / 0.05);

    // Initial cycle
    const maxTime = cycle(ns, target, {
      growThreads,
      weakenGrowThreads,
      weakenHackThreads,
      hackThreads,
    });

    // Spin up cycles on purchased servers
    // for (const [i, server] of Object.entries(ns.getPurchasedServers())) {
    //   await ns.scp(
    //     [
    //       "/scripts/util/dom.js",
    //       "/scripts/milk/grow.js",
    //       "/scripts/milk/hack.js",
    //       "/scripts/milk/weaken.js",
    //     ],
    //     "home",
    //     server
    //   );

    //   cycle(
    //     ns,
    //     target,
    //     {
    //       growThreads,
    //       weakenGrowThreads,
    //       weakenHackThreads,
    //       hackThreads,
    //     },
    //     server,
    //     (1 + Number(i)) * 1000
    //   );
    // }

    await ns.sleep(maxTime);
  }
}

function cycle(
  ns: NS,
  target: string,
  { growThreads, weakenGrowThreads, weakenHackThreads, hackThreads },
  host: string = ns.getHostname(),
  delay: number = 0
): number {
  // grow ->
  const growTime = ns.getGrowTime(target);
  let growOffset = delay;
  run(ns, "grow", { host, threads: growThreads, target, delay: growOffset });
  // ns.tprint(`Grow planned time: ${growTime / 1000}s`);

  // weaken ->
  const weakenTime = ns.getWeakenTime(target);
  let weakenOffset = 0;
  if (weakenTime < growTime + growOffset) {
    weakenOffset += growOffset + growTime - weakenTime + 1000;
  }
  run(ns, "weaken", {
    host,
    threads: weakenGrowThreads,
    target,
    delay: weakenOffset,
  });
  // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

  // hack ->
  const hackTime = ns.getHackTime(target);
  let hackOffset = 0;
  if (hackTime < weakenTime + weakenOffset) {
    hackOffset += weakenOffset + weakenTime - hackTime + 1000;
  }
  run(ns, "hack", { host, threads: hackThreads, target, delay: hackOffset });
  // ns.tprint(`Hack planned time: ${hackTime / 1000}s after ${hackOffset / 1000}s delay`);

  // weaken ->
  if (weakenTime < hackTime + hackOffset) {
    weakenOffset += hackOffset + hackTime - weakenTime + 1000;
  }
  run(ns, "weaken", {
    host,
    threads: weakenHackThreads,
    target,
    delay: weakenOffset,
  });
  // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

  return Math.max(weakenTime + weakenOffset, hackTime + hackOffset, growTime) + 1000;
}

interface RunOptions {
  threads: number;
  target: string;
  delay?: number;
  host?: string;
}
function run(
  ns: NS,
  script: "hack" | "grow" | "weaken",
  { threads, target, delay = 0, host = ns.getHostname() }: RunOptions
) {
  return ns.exec(`/scripts/milk/${script}.js`, host, threads, target, delay);
}
