import { Cheat } from "/scripts/util/dom.js";
import type { NS } from "types/NetscriptDefinitions";

interface ITrackingEvent {
  event_type: "hack" | "grow" | "weaken";
  user_id: string;
  time: number;
  event_properties: {
    duration: number;
    security_change?: number;
    money_change?: number;
  };
}

declare global {
  interface Window {
    analytics: Analytics;
  }
}

export async function main(ns: NS) {
  // Setup analytics

  const analytics = new Analytics(ns);

  analytics.init();

  while (true) {
    ns.asleep(60000);
  }
}

class Analytics {
  static URL = "https://api2.amplitude.com/2/httpapi";
  static AMPLITUDE_TOKEN_PATH = "/.env/amplitude.txt";

  private apiKey: string;
  private headers = new Headers({
    "Content-Type": "application.json",
    Accept: "*/*",
  });
  ns: NS;

  constructor(ns: NS) {
    this.ns = ns;
    // Read the api key
    this.apiKey = ns.read(Analytics.AMPLITUDE_TOKEN_PATH);
    if (!this.apiKey) {
      ns.tprintf("ERROR Missing Amplitude API key. Analytics will not work.");
    }
  }

  init() {
    window.analytics = this;
  }

  async track(
    event_type: ITrackingEvent["event_type"],
    event_properties: ITrackingEvent["event_properties"],
    time = Date.now()
  ) {
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
      this.ns.print(
        `ERROR tracking "${event_type}". ${response.status}: ${response.statusText}`
      );
    }
  }
}
