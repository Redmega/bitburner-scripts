/**
 * Adapted (mostly stolen :P) from https://discord.com/channels/415207508303544321/415247422638522395/856627293593141248
 * @param {NS} ns
* @param {Server} server
* @param {Player} player
* @param {number} start
* @param {number} goal
* @param {number} maxIterations
* @returns {number}
*/
export function calculateGrowthThreadsWithFormula(ns, server, player, start = 0, goal = server.moneyMax, maxIterations = 100) {
    start = Math.max(0, start); // We can't start with negative money.
    if (start >= goal) {
        // We're already there!
        return 0;
    }
    let best = goal - start, // Current best number of threads that will reach the goal
    lower = 0, // Lower bound; last guess that failed to reach the goal
    guess = Math.min(1000000, Math.ceil(best / 2)); // Current guess; 1000000 will almost certainly be too high, but it will also be a better first guess than the halfway point on most servers.
    for (let i = 0; guess != best && i < maxIterations; ++i) {
        const expectedOutcome = (start + guess) * ns.formulas.hacking.growPercent(server, guess, player);
        if (expectedOutcome >= goal) {
            // This many threads will reach our goal!
            if (best < guess) {
                // This shouldn't be possible, but better safe than sorry.
                return best;
            }
            best = guess; // Make this our new best guess
            guess = Math.ceil((lower + guess) / 2); // Aim for the midpoint between upper and lower bounds.
        }
        else {
            lower = guess; // Make this our new lower bound
            guess = Math.ceil((guess + best) / 2); // Aim for the midpoint between upper and lower bounds.
        }
    }
    return best; // Whether we ran out of iterations or not, this is our best answer.
}
