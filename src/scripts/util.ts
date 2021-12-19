/**
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 */

import type { NS } from "types/bitburner";

interface IServer {
  name: string;
  depth: number;
  root: boolean;
  path: string[];
  maxMoney: number;
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
