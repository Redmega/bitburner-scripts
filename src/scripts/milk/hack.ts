import { Cheat } from "/scripts/util/dom.js";

import type { NS } from "types/NetscriptDefinitions";

type Args = [target: string, sleep: number];

export async function main(ns: NS) {
  const [target, sleep = 0] = ns.args as Args;
  await ns.sleep(sleep);

  const self = ns.getRunningScript(
    ns.getScriptName(),
    ns.getHostname(),
    ...ns.args
  );

  const duration = ns.getHackTime(target);

  const security_change = ns.hackAnalyzeSecurity(self.threads);
  const hack = await ns.hack(target);

  Cheat.analytics.track("hack", {
    duration,
    money_change: hack,
    security_change,
    server: target,
  });
}
