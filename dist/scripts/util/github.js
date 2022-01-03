import { Cheat } from "/scripts/util/dom.js";
export default class Github {
    constructor(ns) {
        this.headers = new Headers({ Accept: "application/vnd.github.v3+json" });
        this.ns = ns;
        // Generate Headers
        const token = ns.read(Github.TOKEN_PATH);
        if (!token) {
            ns.print("WARN Token not found. Using unauthenticated requests.");
        }
        else {
            this.headers.append("Authorization", `token ${token}`);
        }
        const lastFetched = ns.read(Github.LAST_FETCH_TIME_PATH);
        if (lastFetched) {
            this.headers.append("If-Modified-Since", lastFetched);
        }
    }
    async updateLastFetched(date) {
        this.ns.print("INFO Writing last fetched time to storage path");
        return this.ns.write(Github.LAST_FETCH_TIME_PATH, [date], "w");
    }
    async fetchContents(path, { recursive }) {
        const response = await Cheat.win.fetch(`${this.contentUrl}/${path}`, {
            headers: this.headers,
        });
        const body = await response.json();
        let files = [...body.filter((item) => item.type === "file")];
        if (recursive) {
            files = files.concat(...(await Promise.all(body.filter((item) => item.type === "dir").map((item) => this.fetchContents(item.path, { recursive })))));
        }
        return files;
    }
    get contentUrl() {
        return [Github.API_URL, "repos/redmega/bitburner-scripts/contents"].join("/");
    }
}
Github.API_URL = "https://api.github.com";
Github.TOKEN_PATH = "/.git/token.txt";
Github.LAST_FETCH_TIME_PATH = "/.git/last_fetch_time.txt";
