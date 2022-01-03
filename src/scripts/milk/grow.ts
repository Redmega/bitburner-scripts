import { Cheat } from "/scripts/util/dom.js";
import type { NS } from "types/NetscriptDefinitions";

type Args = [target: string, sleep: number];

export async function main(ns: NS) {
  const [target, sleep = 0] = ns.args as Args;
  await ns.sleep(sleep);

  const self = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);

  const duration = ns.getGrowTime(target);
  const money = ns.getServerMoneyAvailable(target);
  await ns.grow(target);
  const afterMoney = ns.getServerMoneyAvailable(target);
  const security_change = ns.growthAnalyzeSecurity(self.threads);

  Cheat.analytics.track("grow", {
    duration,
    money_change: afterMoney - money,
    security_change,
    server: target,
  });
}
