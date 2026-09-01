import { date } from "../utils/finance";

export const ROLE_LABEL = {
  ADMIN: "Administrator",
  BANK_AGENT: "Bank Agent",
};

export function formatLastLogin(iso) {
  if (!iso) return "Never";
  const loginDate = new Date(iso);
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(loginDate);
  if (loginDate.toDateString() === now.toDateString()) return `Today ${time}`;
  return `${date(loginDate)} ${time}`;
}
