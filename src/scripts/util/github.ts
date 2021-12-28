import type { NS } from "types/NetscriptDefinitions";
import { Cheat } from "/scripts/util/dom.js";

interface FetchOptions {
  recursive?: boolean; // Fetch subdirectories in a given path.
}

interface GithubContentResponse {
  path: string;
  type: string;
  download_url: string;
}

export default class Github {
  static API_URL = "https://api.github.com";
  static TOKEN_PATH = "/.git/token.txt";
  static LAST_FETCH_TIME_PATH = "/.git/last_fetch_time.txt";

  ns: NS;
  headers = new Headers({ Accept: "application/vnd.github.v3+json" });

  constructor(ns: NS) {
    this.ns = ns;
    // Generate Headers
    const token = ns.read(Github.TOKEN_PATH);
    if (!token) {
      ns.print("WARN Token not found. Using unauthenticated requests.");
    } else {
      this.headers.append("Authorization", `token ${token}`);
    }

    const lastFetched = ns.read(Github.LAST_FETCH_TIME_PATH);
    if (lastFetched) {
      this.headers.append("If-Modified-Since", lastFetched);
    }
  }

  async updateLastFetched(date: string) {
    this.ns.print("INFO Writing last fetched time to storage path");
    return this.ns.write(Github.LAST_FETCH_TIME_PATH, [date], "w");
  }

  async fetchContents(path: string, { recursive }: FetchOptions) {
    const response = await Cheat.win.fetch(`${this.contentUrl}/${path}`, {
      headers: this.headers,
    });
    const body: GithubContentResponse[] = await response.json();

    let files = [...body.filter((item) => item.type === "file")];

    if (recursive) {
      files = files.concat(
        ...(await Promise.all(
          body
            .filter((item) => item.type === "dir")
            .map((item) => this.fetchContents(item.path, { recursive }))
        ))
      );
    }

    return files;
  }

  private get contentUrl() {
    return [Github.API_URL, "repos/redmega/bitburner-scripts/contents"].join(
      "/"
    );
  }
}
