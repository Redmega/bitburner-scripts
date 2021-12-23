import type { NS } from "types/NetscriptDefinitions";
import { cmd } from "/scripts/util.js";

export async function main(ns: NS) {
  if (ns.scan().indexOf("darkweb") < 0) {
    ns.tprintf("Buy a TOR router first!");
    return;
  }

  // Create the buy message;
  const programs = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "ServerProfiler.exe",
    "DeepscanV1.exe",
    "DeepscanV2.exe",
    "AutoLink.exe",
    "Formulas.exe",
  ];

  const command = `connect darkweb; ${programs
    .map((program) => `buy ${program}; `)
    .join("")} connect home;`;

  cmd(command);
}
