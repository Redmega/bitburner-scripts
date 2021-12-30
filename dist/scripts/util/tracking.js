import { Cheat } from "/scripts/util/dom.js";
/** @param {NS} ns*/
export async function main(ns) {
    // Setup analytics
    const analytics = new Analytics(ns);
    analytics.init();
    ns.atExit(() => {
        analytics.destroy();
    });
    while (true) {
        await ns.asleep(60000);
    }
}
class Analytics {
    constructor(ns) {
        this.headers = new Headers({
            "Content-Type": "application.json",
            Accept: "*/*",
        });
        this.ns = ns;
        // Read the api key
        this.apiKey = ns.read(Analytics.AMPLITUDE_TOKEN_PATH);
        if (!this.apiKey) {
            ns.tprintf("ERROR Missing Amplitude API key. Analytics will not work.");
        }
    }
    init() {
        Cheat.win.analytics = this;
    }
    destroy() {
        Cheat.win.analytics = undefined;
    }
    async track(event_type, event_properties, time = Date.now()) {
        if (!this.apiKey)
            return;
        const response = await Cheat.win.fetch(Analytics.URL, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                api_key: this.apiKey,
                events: [
                    {
                        event_type,
                        user_id: "Redmega",
                        time,
                        event_properties,
                    },
                ],
            }),
        });
        if (!response.ok) {
            this.ns.print(`ERROR tracking "${event_type}". ${response.status}: ${response.statusText}`);
        }
    }
}
Analytics.URL = "https://api2.amplitude.com/2/httpapi";
Analytics.AMPLITUDE_TOKEN_PATH = "/.env/amplitude.txt";
