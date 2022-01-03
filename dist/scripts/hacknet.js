let ns;
/** @param {NS} _ns*/
export async function main(_ns) {
    // Make NS global
    ns = _ns;
    ns.disableLog("sleep");
    await maximizeHacknet();
}
const maximizeHacknet = (n = 1000) => delay(async () => {
    let { money } = ns.getPlayer();
    const maxNodes = ns.hacknet.maxNumNodes();
    let nodeCost = ns.hacknet.getPurchaseNodeCost();
    let nodeCount = ns.hacknet.numNodes();
    if (money > nodeCost && nodeCount < maxNodes) {
        ns.hacknet.purchaseNode();
        return maximizeHacknet();
    }
    const nodes = [...Array(nodeCount).keys()].map((i) => {
        const node = ns.hacknet.getNodeStats(i);
        return {
            ...node,
            index: i,
            canUpgradeLevel: node.level < HacknetNode.maxLevel,
            canUpgradeRam: node.ram < HacknetNode.maxRam,
            canUpgradeCores: node.cores < HacknetNode.maxCores,
        };
    });
    for (const node of nodes) {
        if (node.canUpgradeCores && ns.hacknet.getCoreUpgradeCost(node.index, 1) < money) {
            ns.print(`${node.name} >> Upgrading Core`);
            ns.hacknet.upgradeCore(node.index, 1);
            return maximizeHacknet();
        }
        if (node.canUpgradeRam && ns.hacknet.getRamUpgradeCost(node.index, 1) < money) {
            ns.print(`${node.name} >> Upgrading RAM`);
            ns.hacknet.upgradeRam(node.index, 1);
            return maximizeHacknet();
        }
        if (node.canUpgradeLevel && ns.hacknet.getLevelUpgradeCost(node.index, 5) < money) {
            ns.print(`${node.name} >> Upgrading Level`);
            ns.hacknet.upgradeLevel(node.index, 5);
            return maximizeHacknet();
        }
    }
    if (nodeCount < maxNodes) {
        ns.print("Waiting for income... (10s)");
        return maximizeHacknet(10000);
    }
    ns.tprint("Reached maximum hacknet node count");
}, n);
class HacknetNode {
}
HacknetNode.maxCores = 16;
HacknetNode.maxLevel = 200;
HacknetNode.maxRam = 64;
/** @param {undefined} fn
* @param {undefined} time
*/
async function delay(fn, time = 1000) {
    await ns.sleep(time);
    return fn();
}
