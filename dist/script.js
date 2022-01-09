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
];
var Script;
(function (Script) {
    Script["OpenDevMenu"] = "openDevMenu";
    Script["BuyPrograms"] = "buyPrograms";
})(Script || (Script = {}));
/** @param {NS} ns*/
export async function main(ns) {
    switch (ns.args[0]) {
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
/**/
export function autocomplete() {
    return Object.values(Script);
}
