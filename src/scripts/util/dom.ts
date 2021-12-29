/**
 * Bypass document RAM cost
 */
export class Cheat {
  static get doc() {
    return globalThis["document"] as Document;
  }

  static get win() {
    return globalThis as typeof window;
  }

  static get analytics() {
    return Cheat.win.analytics;
  }
}

/**
 * Run a command in the terminal
 */
export function cmd(command: string) {
  const input = Cheat.doc.getElementById("terminal-input") as HTMLInputElement;
  input.value = command;
  const handler = Object.keys(input)[1];
  input[handler].onChange({ target: input });
  input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}
