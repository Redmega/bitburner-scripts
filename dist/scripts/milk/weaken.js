/** @param {NS} ns*/
export async function main(ns) {
    const [server, sleep = 1000] = ns.args;
    await ns.sleep(sleep);
    return ns.weaken(server);
}
