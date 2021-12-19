/** @param {NS} ns*/
export async function main(ns) {
    return ns.hack(ns.args[0], { threads: ns.args[1] });
}
