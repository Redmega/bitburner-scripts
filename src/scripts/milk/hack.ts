import type { NS } from "types/bitburner";

export async function main(ns: NS) {
  return ns.hack(ns.args[0] as string, { threads: ns.args[1] as number });
}
