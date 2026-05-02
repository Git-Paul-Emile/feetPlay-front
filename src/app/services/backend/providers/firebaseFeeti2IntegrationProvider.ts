import { expressFeeti2IntegrationProvider } from "./expressFeeti2IntegrationProvider";

export const firebaseFeeti2IntegrationProvider = {
  ...expressFeeti2IntegrationProvider,
  mode: "firebase" as const,
};
