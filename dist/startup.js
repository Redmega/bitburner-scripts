/** @param {NS} ns*/
export async function main(ns) {
    // All startup scripts
    // Tracking script for milk stats
    ns.run("/scripts/util/tracking.js", 1, "--restart");
    // Auto nuker
    ns.run("/scripts/nuke.js", 1, "--restart");
}
