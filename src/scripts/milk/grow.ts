import type { NS } from "types/bitburner";

export async function main(ns: NS<[string, number]>) {
  const [server, sleep = 1000] = ns.args;
  await ns.sleep(sleep);
  return ns.grow(server);
}
