import { backendGateway } from "../backend/gateway";
import type { Feeti2Event } from "../backend/types";

const Feeti2EventsAPI = {
  getStreamingEvents(): Promise<Feeti2Event[]> {
    return backendGateway.integration.getStreamingEvents();
  },

  getLiveEvents(): Promise<Feeti2Event[]> {
    return backendGateway.integration.getLiveEvents();
  },

  getReplayEvents(): Promise<Feeti2Event[]> {
    return backendGateway.integration.getReplayEvents();
  },
};

export type { Feeti2Event };
export default Feeti2EventsAPI;
