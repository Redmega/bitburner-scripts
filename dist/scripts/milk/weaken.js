/** @param {NS} ns*/
export async function main(ns) {
    const [server, sleep = 0] = ns.args;
    await ns.sleep(sleep);
    return ns.weaken(server);
}
