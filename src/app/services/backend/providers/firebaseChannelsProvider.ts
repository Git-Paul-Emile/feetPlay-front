import { getDocs, query, where, collection, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase";
import { normalizeChannel } from "../helpers";
import type { Channel, ChannelsProvider } from "../types";

async function listChannels(filters: Array<ReturnType<typeof where>> = []): Promise<Channel[]> {
  const snap = await getDocs(query(collection(db, "channels"), where("isActive", "==", true), ...filters, orderBy("name")));
  return snap.docs.map((item) => normalizeChannel({ id: item.id, ...item.data() }));
}

export const firebaseChannelsProvider: ChannelsProvider = {
  mode: "firebase",

  getAll() {
    return listChannels();
  },

  async getById(id: string) {
    const snap = await getDoc(doc(db, "channels", id));
    return snap.exists() ? normalizeChannel({ id: snap.id, ...snap.data() }) : null;
  },

  async getBySlug(slug: string) {
    const channels = await listChannels([where("slug", "==", slug)]);
    return channels[0] ?? null;
  },

  getByCategory(category: string) {
    return listChannels([where("category", "==", category)]);
  },

  async search(searchTerm: string) {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return this.getAll();
    }

    const channels = await this.getAll();
    return channels.filter((channel) =>
      [channel.name, channel.description, channel.category, channel.country ?? ""].join(" ").toLowerCase().includes(normalized),
    );
  },
};
