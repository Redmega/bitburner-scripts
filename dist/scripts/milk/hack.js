import { Cheat } from "/scripts/util/dom.js";
/** @param {NS} ns*/
export async function main(ns) {
    const [target, sleep = 0] = ns.args;
    await ns.sleep(sleep);
    const self = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);
    const duration = ns.getHackTime(target);
    const security_change = ns.hackAnalyzeSecurity(self.threads);
    const hack = await ns.hack(target);
    Cheat.analytics.track("hack", {
        duration,
        money_change: hack,
        security_change,
        server: target,
    });
}
