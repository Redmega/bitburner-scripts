import type { NS } from "types/bitburner";
import { Cheat } from "scripts/util";

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

  const input = Cheat.doc.getElementById("terminal-input") as HTMLInputElement;
  input.value = command;
  const handler = Object.keys(input)[1];
  input[handler].onChange({ target: input });
  input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
