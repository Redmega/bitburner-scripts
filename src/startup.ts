import type { NS } from "types/NetscriptDefinitions";

export async function main(ns: NS) {
  // All startup scripts

  // Tracking script for milk stats
  ns.run("/scripts/util/tracking.js", 1, "--restart");

  // Auto nuker
  ns.run("/scripts/nuke.js", 1, "--restart");
}
