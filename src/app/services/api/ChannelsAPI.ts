import { backendGateway } from "../backend/gateway";
import type { Channel } from "../backend/types";

const ChannelsAPI = {
  getAll(): Promise<Channel[]> {
    return backendGateway.channels.getAll();
  },

  getById(id: string): Promise<Channel | null> {
    return backendGateway.channels.getById(id);
  },

  getBySlug(slug: string): Promise<Channel | null> {
    return backendGateway.channels.getBySlug(slug);
  },

  getByCategory(category: string): Promise<Channel[]> {
    return backendGateway.channels.getByCategory(category);
  },

  search(query: string): Promise<Channel[]> {
    return backendGateway.channels.search(query);
  },
};

export type { Channel };
export default ChannelsAPI;
