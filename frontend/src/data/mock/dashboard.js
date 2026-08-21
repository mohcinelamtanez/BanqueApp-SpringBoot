import { clients } from "./data";
export const dashboard = {
  get totalClients() {
    return clients.length;
  },
};
