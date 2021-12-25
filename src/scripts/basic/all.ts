import { NS } from "types/NetscriptDefinitions";
import { getServers } from "/scripts/util.js";

export async function main(ns: NS) {
  const servers = getServers(ns).filter((s) => s.root && s.maxMoney > 0);
  for (const server of servers) {
    ns.run("/scripts/basic/hack_loop.js", 1, server.name);
  }
}
