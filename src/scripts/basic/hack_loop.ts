import { NS } from "types/NetscriptDefinitions";

let ns: NS;

type Args = [target: string];
export async function main(_ns: NS) {
  ns = _ns;

  const [target] = ns.args as Args;

  const maxMoney = ns.getServerMaxMoney(target);

  // First, weaken to 0 if needed
  if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
    const weakenTime = ns.getWeakenTime(target);
    run("weaken", 2000, target);
    await ns.sleep(weakenTime + 1000);
  }

  while (true) {
    const availableMoney = ns.getServerMoneyAvailable(target) || 1;
    const growThreads =
      Math.ceil(ns.growthAnalyze(target, Math.ceil(maxMoney / availableMoney), ns.getServer("home").cpuCores)) || 1;
    const growSecurity = ns.growthAnalyzeSecurity(growThreads);

    const hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMoneyAvailable(target)) || 1;
    const hackSecurity = ns.hackAnalyzeSecurity(hackThreads);
    const weakenGrowThreads = Math.ceil(growSecurity / 0.05);
    const weakenHackThreads = Math.ceil(hackSecurity / 0.05);

    const maxTime = cycle(target, { growThreads, weakenGrowThreads, weakenHackThreads, hackThreads });

    await ns.sleep(maxTime);
  }
}

function cycle(target: string, { growThreads, weakenGrowThreads, weakenHackThreads, hackThreads }, delay: number = 0): number {
  // grow ->
  const growTime = ns.getGrowTime(target);
  let growOffset = delay;
  run("grow", growThreads, target, growOffset);
  // ns.tprint(`Grow planned time: ${growTime / 1000}s`);

  // weaken ->
  const weakenTime = ns.getWeakenTime(target);
  let weakenOffset = 0;
  if (weakenTime < growTime + growOffset) {
    weakenOffset += growOffset + growTime - weakenTime + 1000;
  }
  run("weaken", weakenGrowThreads, target, weakenOffset);
  // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

  // hack ->
  const hackTime = ns.getHackTime(target);
  let hackOffset = 0;
  if (hackTime < weakenTime + weakenOffset) {
    hackOffset += weakenOffset + weakenTime - hackTime + 1000;
  }
  run("hack", hackThreads, target, hackOffset);
  // ns.tprint(`Hack planned time: ${hackTime / 1000}s after ${hackOffset / 1000}s delay`);

  // weaken ->
  if (weakenTime < hackTime + hackOffset) {
    weakenOffset += hackOffset + hackTime - weakenTime + 1000;
  }
  run("weaken", weakenHackThreads, target, weakenOffset);
  // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

  return Math.max(weakenTime + weakenOffset, hackTime + hackOffset, growTime) + 1000;
}

function run(script: "hack" | "grow" | "weaken", threads: number, target: string, delay: number = 0) {
  return ns.run(`/scripts/milk/${script}.js`, threads, target, delay);
}
