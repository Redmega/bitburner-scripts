import { NS } from "types/NetscriptDefinitions";
import { getServerNames } from "/scripts/util/game.js";

export async function main(ns: NS) {
  const servers = getServerNames(ns);
  for (const name of servers) {
    if (ns.getServerMaxMoney(name) > 0 && ns.hasRootAccess(name))
      ns.run("/scripts/basic/hack_loop.js", 1, name);
  }
}
