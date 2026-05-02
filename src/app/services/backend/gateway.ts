import { getBackendProviderMode } from "./mode";
import { expressAuthProvider } from "./providers/expressAuthProvider";
import { firebaseAuthProvider } from "./providers/firebaseAuthProvider";
import { expressEventsProvider } from "./providers/expressEventsProvider";
import { firebaseEventsProvider } from "./providers/firebaseEventsProvider";
import { expressChannelsProvider } from "./providers/expressChannelsProvider";
import { firebaseChannelsProvider } from "./providers/firebaseChannelsProvider";
import { expressStreamingProvider } from "./providers/expressStreamingProvider";
import { firebaseStreamingProvider } from "./providers/firebaseStreamingProvider";
import { expressFeeti2IntegrationProvider } from "./providers/expressFeeti2IntegrationProvider";
import { firebaseFeeti2IntegrationProvider } from "./providers/firebaseFeeti2IntegrationProvider";
import { expressCheckoutProvider } from "./providers/expressCheckoutProvider";
import { firebaseCheckoutProvider } from "./providers/firebaseCheckoutProvider";

function resolveMode() {
  return getBackendProviderMode();
}

export const backendGateway = {
  get mode() {
    return resolveMode();
  },

  get auth() {
    return this.mode === "firebase" ? firebaseAuthProvider : expressAuthProvider;
  },

  get events() {
    return this.mode === "firebase" ? firebaseEventsProvider : expressEventsProvider;
  },

  get channels() {
    return this.mode === "firebase" ? firebaseChannelsProvider : expressChannelsProvider;
  },

  get streaming() {
    return this.mode === "firebase" ? firebaseStreamingProvider : expressStreamingProvider;
  },

  get integration() {
    return this.mode === "firebase" ? firebaseFeeti2IntegrationProvider : expressFeeti2IntegrationProvider;
  },

  get checkout() {
    return this.mode === "firebase" ? firebaseCheckoutProvider : expressCheckoutProvider;
  },
};
