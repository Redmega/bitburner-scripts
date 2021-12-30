import { Cheat } from "/scripts/util/dom.js";
import type { NS } from "types/NetscriptDefinitions";

type Args = [target: string, sleep: number];

export async function main(ns: NS) {
  const [target, sleep = 0] = ns.args as Args;
  await ns.sleep(sleep);

  const duration = ns.getWeakenTime(target);
  const weaken = await ns.weaken(target);

  Cheat.analytics.track("weaken", {
    duration,
    security_change: weaken * -1,
    server: target,
  });
}
