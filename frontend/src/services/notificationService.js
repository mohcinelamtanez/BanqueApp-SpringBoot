import { httpClient } from "./httpClient";

const BASE = "/v1/notifications";

const TITLES = {
  NEW_LOAN_APPLICATION: "New loan application",
  LOAN_APPROVED: "Loan approved",
  LOAN_REJECTED: "Loan rejected",
  PAYMENT_DUE: "Payment due",
  PAYMENT_LATE: "Payment late",
};

function timeAgo(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return date.toLocaleDateString();
}

// Maps the backend NotificationResponseDTO(id, type, message, read, createdAt)
// onto the shape NotificationCenter already renders.
function fromDTO(dto) {
  return {
    id: dto.id,
    kind: dto.type,
    title: TITLES[dto.type] || dto.type,
    text: dto.message,
    time: timeAgo(dto.createdAt),
    unread: !dto.read,
  };
}

export const notificationService = {
  // Everything below is scoped server-side to the authenticated user (JWT),
  // for Client, Bank Agent and Admin alike.
  listMine: () =>
    httpClient.get(`${BASE}/me`).then((res) => res.data.map(fromDTO)),
  unreadCount: () =>
    httpClient.get(`${BASE}/me/unread-count`).then((res) => res.data.unread),
  markAsRead: (id) =>
    httpClient.patch(`${BASE}/${id}/read`).then((res) => fromDTO(res.data)),
};
export default notificationService;
