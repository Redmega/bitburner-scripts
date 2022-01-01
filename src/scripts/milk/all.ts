import { NS } from "types/NetscriptDefinitions";
import { getServerNames } from "/scripts/util/game.js";

type Args = [target: string];
export async function main(ns: NS) {
  const [target = "home"] = ns.args as Args;

  const servers = getServerNames(ns);

  ns.disableLog("getServerMaxMoney");
  ns.disableLog("hasRootAccess");
  ns.disableLog("getRunningScript");
  ns.disableLog("getHostname");

  for (const name of servers) {
    if (
      ns.getServerMaxMoney(name) > 0 &&
      ns.hasRootAccess(name) &&
      !ns.getRunningScript("/scripts/milk/main.js", target, name)
    )
      ns.exec("/scripts/milk/main.js", target, 1, name);
  }
}
