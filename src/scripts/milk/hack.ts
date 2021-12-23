import type { NS } from "types/NetscriptDefinitions";

type Args = [server: string, sleep: number];
export async function main(ns: NS) {
  const [server, sleep = 0] = ns.args as Args;
  await ns.sleep(sleep);
  return ns.hack(server);
}
