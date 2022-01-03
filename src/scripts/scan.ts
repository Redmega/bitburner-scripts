import type { NS } from "types/NetscriptDefinitions";
import { getServers } from "/scripts/util/game.js";

const FACTION_SERVERS = {
  home: "🏠",
  CSEC: " 🌐",
  "avmnite-02h": " 🌃",
  "I.I.I.I": " ✋",
  run4theh111z: " 🏃",
  "The-Cave": " 🕳️",
  w0r1d_d43m0n: " 😈",
};

/**
 * Generates a prefix properly spacing servers based on depth
 */
function getPrefix(depth: number) {
  const chars = [];

  if (depth === 0) return "";
  if (depth > 1) chars.push(" ".repeat(depth));
  chars.push("└─");

  return chars.join("");
}

export async function main(ns: NS) {
  const servers = getServers(ns);

  for (const { name, depth, root } of servers) {
    ns.tprintf(`${getPrefix(depth)}${FACTION_SERVERS[name] ?? ""} ${name} ${root ? "✅" : ""}`);
  }
}
