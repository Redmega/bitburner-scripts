import type { NS } from "types/bitburner";

export async function main(ns: NS) {
  return ns.grow(ns.args[0] as string, { threads: ns.args[1] as number });
}
