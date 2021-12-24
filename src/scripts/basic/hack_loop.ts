import { NS } from "types/NetscriptDefinitions";

type Args = [target: string];
export async function main(ns: NS) {
  const [target] = ns.args as Args;

  const maxMoney = ns.getServerMaxMoney(target);

  // First, weaken to 0 if needed
  if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
    const weakenTime = ns.getWeakenTime(target);
    ns.run("/scripts/milk/weaken.js", 2000, target);
    await ns.sleep(weakenTime + 1000);
  }

  while (true) {
    const availableMoney = ns.getServerMoneyAvailable(target) || 1;

    const growThreads =
      Math.ceil(ns.growthAnalyze(target, Math.ceil(maxMoney / availableMoney), ns.getServer("home").cpuCores)) || 1;
    const growSecurity = ns.growthAnalyzeSecurity(growThreads);

    // grow ->
    const growTime = ns.getGrowTime(target);
    ns.run("/scripts/milk/grow.js", growThreads, target);
    // ns.tprint(`Grow planned time: ${growTime / 1000}s`);

    const hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMoneyAvailable(target)) || 1;
    const hackSecurity = ns.hackAnalyzeSecurity(hackThreads);
    const weakenGrowThreads = Math.ceil(growSecurity / 0.05);
    const weakenHackThreads = Math.ceil(hackSecurity / 0.05);

    // weaken ->
    const weakenTime = ns.getWeakenTime(target);
    let weakenOffset = 0;
    if (weakenTime < growTime) {
      weakenOffset += growTime - weakenTime + 1000;
    }
    ns.run("/scripts/milk/weaken.js", weakenGrowThreads, target, weakenOffset);
    // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

    // hack ->
    const hackTime = ns.getHackTime(target);
    let hackOffset = 0;
    if (hackTime < weakenTime + weakenOffset) {
      hackOffset += weakenOffset + weakenTime - hackTime + 1000;
    }
    ns.run("/scripts/milk/hack.js", hackThreads, target, hackOffset);
    // ns.tprint(`Hack planned time: ${hackTime / 1000}s after ${hackOffset / 1000}s delay`);

    // weaken ->
    if (weakenTime < hackTime + hackOffset) {
      weakenOffset += hackOffset + hackTime - weakenTime + 1000;
    }
    ns.run("/scripts/milk/weaken.js", weakenHackThreads, target, weakenOffset);
    // ns.tprint(`Weaken planned time: ${weakenTime / 1000}s after ${weakenOffset / 1000}s delay`);

    await ns.sleep(Math.max(weakenTime + weakenOffset, hackTime + hackOffset, growTime, 1000));
  }
}