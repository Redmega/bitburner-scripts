import { getServers } from "/scripts/util/game.js";
const PORT_OPENING_PROGRAMS = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "XX"];
/** @param {NS} ns*/
export async function main(ns) {
    //Initialise
    let hackThreshold = 0;
    let portThreshold = 0;
    let numBusters = 0;
    let myHackLevel = ns.getHackingLevel();
    ns.disableLog("ALL");
    ns.enableLog("nuke");
    //Generate list of all unhacked servers
    let servers = getServers(ns)
        .filter((s) => !s.root)
        .sort(function (a, b) {
        return a.requiredHackingLevel - b.requiredHackingLevel;
    });
    while (servers.length > 0) {
        //Wait till hacking or busters crosses threshold
        while (myHackLevel < hackThreshold && numBusters < portThreshold) {
            myHackLevel = ns.getHackingLevel();
            for (; ns.fileExists(PORT_OPENING_PROGRAMS[numBusters], "home"); numBusters++)
                ;
            await ns.sleep(10000);
        }
        hackThreshold = myHackLevel + 1;
        portThreshold = Math.max(5, numBusters + 1);
        //Try nuking servers
        for (const server of servers) {
            if (server.requiredHackingLevel > myHackLevel) {
                hackThreshold = server.requiredHackingLevel;
                break; //Stop looking for more servers
            }
            else if (server.requiredOpenPorts > numBusters) {
                portThreshold = Math.min(portThreshold, server.requiredOpenPorts);
            }
            else {
                if (server.requiredOpenPorts > 0)
                    ns.brutessh(server.name);
                if (server.requiredOpenPorts > 1)
                    ns.ftpcrack(server.name);
                if (server.requiredOpenPorts > 2)
                    ns.relaysmtp(server.name);
                if (server.requiredOpenPorts > 3)
                    ns.httpworm(server.name);
                if (server.requiredOpenPorts > 4)
                    ns.sqlinject(server.name);
                ns.nuke(server.name);
                ns.tprint(`Nuked: ${server.name}`);
                servers = servers.filter((s) => s.name !== server.name);
            }
        }
        if (portThreshold === numBusters) {
            ns.tprintf("Waiting until hacking:%d", hackThreshold);
        }
        else {
            ns.tprintf("Waiting until hacking:%d or %d port busters", hackThreshold, portThreshold);
        }
    }
    ns.tprintf("SUCCESS All servers nuked");
}
