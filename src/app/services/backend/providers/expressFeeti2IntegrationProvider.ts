import { legacyApiFetch } from "../legacyApi";
import type { Feeti2Event, Feeti2IntegrationProvider } from "../types";

export const expressFeeti2IntegrationProvider: Feeti2IntegrationProvider = {
  mode: "express",

  getStreamingEvents() {
    return legacyApiFetch<Feeti2Event[]>("/integration/feeti2-events");
  },

  async getLiveEvents() {
    const events = await this.getStreamingEvents();
    return events.filter((event) => event.isLive);
  },

  async getReplayEvents() {
    const events = await this.getStreamingEvents();
    return events.filter((event) => !event.isLive && Boolean(event.videoUrl));
  },
};
