/** @param {NS} ns*/
export async function main(ns) {
    return ns.weaken(ns.args[0], { threads: ns.args[1] });
}
