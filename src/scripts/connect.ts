import type { NS } from "types/NetscriptDefinitions";
import { getServers } from "/scripts/util/game.js";
import { cmd } from "/scripts/util/dom.js";

/**
 * Generates a connection path and copies it to the clipboard
 */
type Args = [target: string];
export async function main(ns: NS) {
  const [target] = ns.args as Args;

  if (typeof target !== "string") throw new Error("Invalid target.");

  const server = getServers(ns).find((s) => s.name === target);

  const command = `connect ${server.path.join("; connect ")};`;

  cmd(command);
}
