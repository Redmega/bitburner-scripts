import type { NS } from "types/NetscriptDefinitions";
import type { IServer } from "types/scripts";

import { findLastIndex } from "/scripts/util/misc.js";

/**
 * Gets all scannable servers, including depth, root access, and path info
 * Adapted from https://www.reddit.com/r/Bitburner/comments/9nrz3v/scan_script_v2/
 * @FIXME IServer doesn't convert to jsdoc returns nicely.
 */
export function getServers(ns: NS): IServer[] {
  ns.disableLog("disableLog");
  ns.disableLog("enableLog");
  ns.disableLog("scan");
  ns.disableLog("getServerNumPortsRequired");
  ns.disableLog("getServerRequiredHackingLevel");
  ns.disableLog("hasRootAccess");

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
      requiredHackingLevel: ns.getServerRequiredHackingLevel(name),
      requiredOpenPorts: ns.getServerNumPortsRequired(name),
    });

    for (const server of ns.scan(name)) {
      if (visited[server] === undefined) {
        queue.push(server);
        visited[server] = depth + 1;
      }
    }
  }

  ns.enableLog("scan");
  ns.enableLog("getServerNumPortsRequired");
  ns.enableLog("getServerRequiredHackingLevel");
  ns.enableLog("hasRootAccess");
  ns.enableLog("disableLog");
  ns.enableLog("enableLog");

  return result;
}

/**
 * Sometimes we just want the names...
 */
export function getServerNames(ns: NS): string[] {
  ns.disableLog("scan");

  let result = new Set<string>();
  let queue = ["home"];
  let name;
  while ((name = queue.pop())) {
    result.add(name);

    queue.push(...ns.scan(name).filter((s) => !result.has(s)));
  }

  ns.enableLog("scan");

  return Array.from(result);
}
