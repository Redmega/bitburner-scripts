import { getServers } from "/scripts/util/game.js";
const FACTION_SERVERS = {
    home: "🏠",
    CSEC: " 🌐",
    "avmnite-02h": " 🌃",
    "I.I.I.I": " ✋",
    run4theh111z: " 🏃",
    "The-Cave": " 🕳️",
    w0r1d_d43m0n: " 😈",
};
/**
 * Generates a prefix properly spacing servers based on depth
 * @param {number} depth
* @returns {string}
*/
function getPrefix(depth) {
    const chars = [];
    if (depth === 0)
        return "";
    if (depth > 1)
        chars.push(" ".repeat(depth));
    chars.push("└─");
    return chars.join("");
}
/** @param {NS} ns*/
export async function main(ns) {
    var _a;
    const servers = getServers(ns);
    for (const { name, depth, root } of servers) {
        ns.tprintf(`${getPrefix(depth)}${(_a = FACTION_SERVERS[name]) !== null && _a !== void 0 ? _a : ""} ${name} ${root ? "✅" : ""}`);
    }
}
