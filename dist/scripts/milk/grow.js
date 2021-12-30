import { Cheat } from "/scripts/util/dom.js";
/** @param {NS} ns*/
export async function main(ns) {
    const [target, sleep = 0] = ns.args;
    await ns.sleep(sleep);
    const self = ns.getRunningScript(ns.getScriptName(), ns.getHostname(), ...ns.args);
    const duration = ns.getGrowTime(target);
    const money = ns.getServerMoneyAvailable(target);
    await ns.grow(target);
    const afterMoney = ns.getServerMoneyAvailable(target);
    const security_change = ns.growthAnalyzeSecurity(self.threads);
    Cheat.analytics.track("grow", {
        duration,
        money_change: afterMoney - money,
        security_change,
        server: target,
    });
}
