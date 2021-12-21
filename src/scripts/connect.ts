import type { NS } from "types/bitburner";
import { getServers, cmd } from "scripts/util";

/**
 * Generates a connection path and copies it to the clipboard
 */
export async function main(ns: NS) {
  const target = ns.args[0];

  if (typeof target !== "string") throw new Error("Invalid target.");

  const server = getServers(ns).find((s) => s.name === target);

  const command = `connect ${server.path.join("; connect ")};`;

  cmd(command);
}
