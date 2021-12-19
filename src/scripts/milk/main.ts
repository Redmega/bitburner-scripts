import type { NS } from "types/bitburner";
import { getServers } from "scripts/util";

export async function main(ns: NS) {
  const servers = getServers(ns);
}
