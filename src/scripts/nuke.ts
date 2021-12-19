/**
 * Copied from somewhere but I can't remember right now
 * */

import type { NS } from "types/bitburner";
import type { IServer } from "types/scripts";
import { getServers } from "scripts/util";

interface AugmentedServer extends IServer {
  hLvl: number;
  ports: number;
}

const portBusters = [
  "BruteSSH.exe",
  "FTPCrack.exe",
  "relaySMTP.exe",
  "HTTPWorm.exe",
  "SQLInject.exe",
  "XX",
];

export async function main(ns: NS) {
  //Initialise
  let hackThreshold = 0;
  let portThreshold = 0;
  let numBusters = 0;
  let myHackLevel = ns.getHackingLevel();

  ns.disableLog("ALL");
  ns.enableLog("nuke");

  //Generate list of all unhacked servers
  let svToNuke: AugmentedServer[] = [];
  getServers(ns).forEach((server: AugmentedServer) => {
    if (!server.root) {
      server.hLvl = ns.getServerRequiredHackingLevel(server.name);
      server.ports = ns.getServerNumPortsRequired(server.name);
      svToNuke.push(server);
    }
  });
  svToNuke.sort(function (a, b) {
    return a.hLvl - b.hLvl;
  });

  while (svToNuke.length > 0) {
    //Wait till hacking or busters crosses threshold
    while (myHackLevel < hackThreshold && numBusters < portThreshold) {
      myHackLevel = ns.getHackingLevel();
      for (; ns.fileExists(portBusters[numBusters], "home"); numBusters++);
      await ns.sleep(1000);
    }
    hackThreshold = myHackLevel + 1;
    portThreshold = numBusters + 1;

    //Try nuking servers
    for (let i = 0; i < svToNuke.length; i++) {
      let sv = svToNuke[i];
      if (sv.hLvl > myHackLevel) {
        hackThreshold = sv.hLvl;
        break; //Stop looking for more servers
      } else if (sv.ports > numBusters) {
        portThreshold = Math.min(portThreshold, sv.ports);
      } else {
        if (sv.ports > 0) ns.brutessh(sv.name);
        if (sv.ports > 1) ns.ftpcrack(sv.name);
        if (sv.ports > 2) ns.relaysmtp(sv.name);
        if (sv.ports > 3) ns.httpworm(sv.name);
        if (sv.ports > 4) ns.sqlinject(sv.name);
        ns.nuke(sv.name);
        ns.tprint(`Nuked: ${sv.name}`);
        svToNuke.splice(i--, 1); //Delete server from future consideration
      }
    }
    ns.print(
      `Wait till Hack Level: ${hackThreshold} or Busters: ${portThreshold}`
    );
  }
  ns.tprintf("SUCCESS All Servers Nuked");
}
