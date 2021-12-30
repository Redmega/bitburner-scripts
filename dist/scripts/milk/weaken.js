import { Cheat } from "/scripts/util/dom.js";
/** @param {NS} ns*/
export async function main(ns) {
    const [target, sleep = 0] = ns.args;
    await ns.sleep(sleep);
    const duration = ns.getWeakenTime(target);
    const weaken = await ns.weaken(target);
    Cheat.analytics.track("weaken", {
        duration,
        security_change: weaken * -1,
        server: target,
    });
}
