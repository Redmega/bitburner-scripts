/**
 * Bypass document RAM cost
 */
export class Cheat {
    static get doc() {
        return globalThis["document"];
    }
    static get win() {
        return globalThis;
    }
    static get analytics() {
        return Cheat.win.analytics;
    }
}
/**
 * Run a command in the terminal
 * @param {string} command
* @returns {void}
*/
export function cmd(command) {
    const input = Cheat.doc.getElementById("terminal-input");
    input.value = command;
    const handler = Object.keys(input)[1];
    input[handler].onChange({ target: input });
    input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
