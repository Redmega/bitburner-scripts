import type { NS } from "types/NetscriptDefinitions";
import { Cheat, cmd } from "/scripts/util/dom.js";

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
] as const;

enum Script {
  OpenDevMenu = "openDevMenu",
  BuyPrograms = "buyPrograms",
}
type Args = [script: Script];
export async function main(ns: NS) {
  switch (ns.args[0] as Script) {
    case Script.BuyPrograms:
      if (ns.scan().indexOf("darkweb") < 0) {
        // @TODO: Buy TOR Router automatically
        ns.tprintf("Buy a TOR router first!");
        return;
      }
      return cmd(programs.map((program) => `buy ${program}; `).join(""));
    case Script.OpenDevMenu:
      return Cheat.openDevMenu();
    default:
      ns.tprintf("ERROR Unknown script");
  }
}

export function autocomplete() {
  return Object.values(Script);
}
