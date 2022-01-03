import type { NS } from "types/NetscriptDefinitions";
import { getServerPath } from "/scripts/util/game.js";
import { cmd } from "/scripts/util/dom.js";

/**
 * Generates a connection path and copies it to the clipboard
 */
type Args = [target: string];
export async function main(ns: NS) {
  const [target] = ns.args as Args;

  if (typeof target !== "string") throw new Error("Invalid target.");

  const path = getServerPath(ns, target);

  if (!path) {
    throw new Error("Path is undefined");
  }

  const command = `home; connect ${path.join("; connect ")};`;

  cmd(command);
}
