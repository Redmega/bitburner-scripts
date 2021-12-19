/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */

import type { NS } from "types/bitburner";
import type { IServer } from "types/scripts";

export function cmd(command: string) {
  const input = Cheat.doc.getElementById("terminal-input") as HTMLInputElement;
  input.value = command;
  const handler = Object.keys(input)[1];
  input[handler].onChange({ target: input });
  input[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
}

/**
 * Gets all scannable servers, including depth, root access, and path info
 * @FIXME IServer doesn't convert to jsdoc returns nicely.
 */
export function getServers(ns: NS): IServer[] {
  let result: IServer[] = [];
  let visited = { home: 0 };
  let queue = Object.keys(visited);
  let name;
  while ((name = queue.pop())) {
    let depth = visited[name];
    result.push({
      name,
      depth,
      root: ns.hasRootAccess(name),
      path: result
        .slice(findLastIndex(result, (s) => s.depth <= 1))
        .map((s) => s.name)
        .concat(name),
      maxMoney: ns.getServerMaxMoney(name),
    });

    for (const server of ns.scan(name)) {
      if (visited[server] === undefined) {
        queue.push(server);
        visited[server] = depth + 1;
      }
    }
  }
  return result;
}

/**
 * like findIndex, but reverse
 */
export function findLastIndex<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}

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
}
