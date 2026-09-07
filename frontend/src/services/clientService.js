import { httpClient } from "./httpClient";

const BASE = "/v1/clients";

// The backend never hands out a technical id for a client — every lookup
// (get/update/delete) goes through the human-readable clientReference
// (e.g. "CLI-3"), so the frontend treats that reference as the client's
// `id` everywhere (routes, tables, forms) instead of a database key.
//
// Note: ClientResponseDTO is a Java record whose first component is
// declared `ClientReference` (capital C, unlike every other lowerCamelCase
// field on it) — Jackson serializes records using the exact component
// name, so the JSON key really is "ClientReference". This reads that key
// as-is rather than "fixing" it, since changing the backend's wire format
// wasn't asked for here.
function fromDTO(dto) {
  const firstName = dto.firstName ?? "";
  const lastName = dto.lastName ?? "";
  return {
    id: dto.ClientReference,
    reference: dto.ClientReference,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    city: dto.city,
    postalCode: dto.postalCode,
    income: dto.annualIncome,
    email: dto.email,
    status: dto.status === "ACTIVE" ? "Actif" : "Inactif",
    profilePhotoUrl: dto.profilePhotoUrl ?? null,
  };
}

// profilePhotoUrl is deliberately not part of this payload — the backend
// no longer accepts it here at all (see ClientCreateDTO). The photo is
// managed exclusively through clientService.uploadMyPhoto/removeMyPhoto.
function toCreatePayload(values) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    city: values.city,
    postalCode: values.postalCode,
    annualIncome: Number(values.income),
    email: values.email,
  };
}

// ClientUpdateDTO is a plain class (getters/setters), so unlike the
// response DTO it serializes/deserializes with normal lowerCamelCase
// property names — including "clientStatus" (not "status").
function toUpdatePayload(values) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    city: values.city,
    postalCode: values.postalCode,
    annualIncome: Number(values.income),
    email: values.email,
    clientStatus: values.status === "Inactif" ? "INACTIVE" : "ACTIVE",
  };
}

// The Client fields that must be filled in for the business profile to be
// considered complete — mirrors ApplicationServiceImpl.ensureProfileComplete
// on the backend, which remains the authoritative check. This only drives
// frontend UX (e.g. disabling "Start an Application").
export function isProfileComplete(client) {
  return Boolean(
    client &&
      client.firstName &&
      client.lastName &&
      client.city &&
      client.postalCode &&
      client.income != null &&
      client.email,
  );
}

export const clientService = {
  list: () => httpClient.get(BASE).then((res) => res.data.map(fromDTO)),
  get: (reference) =>
    httpClient
      .get(`${BASE}/reference/${reference}`)
      .then((res) => fromDTO(res.data)),
  create: (values) =>
    httpClient
      .post(BASE, toCreatePayload(values))
      .then((res) => fromDTO(res.data)),
  update: (reference, values) =>
    httpClient
      .put(`${BASE}/reference/${reference}`, toUpdatePayload(values))
      .then((res) => fromDTO(res.data)),
  remove: (reference) =>
    httpClient.delete(`${BASE}/reference/${reference}`).then(() => undefined),
  // "My Profile" — always the authenticated user's own Client, resolved
  // server-side. No Client yet returns null (backend responds 204) rather
  // than throwing, so the caller can tell "not created yet" apart from a
  // real error.
  getMine: () =>
    httpClient.get(`${BASE}/me`).then((res) => (res.data ? fromDTO(res.data) : null)),
  // Creates the Client and links it to the authenticated user the first
  // time this is called, or updates the existing one on every call after
  // that — the backend decides which, never the frontend.
  saveMine: (values) =>
    httpClient
      .put(`${BASE}/me`, toCreatePayload(values))
      .then((res) => fromDTO(res.data)),
  // Uploads/replaces the authenticated user's own profile photo. The
  // backend stores the file centrally and returns the updated Client (with
  // the new profilePhotoUrl) — never a client-supplied URL string.
  uploadMyPhoto: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return httpClient
      .post(`${BASE}/me/profile-photo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => fromDTO(res.data));
  },
  removeMyPhoto: () =>
    httpClient.delete(`${BASE}/me/profile-photo`).then((res) => fromDTO(res.data)),
  // Profile photos are served through an authenticated endpoint (never
  // public), so a plain `<img src>` can't load them — it can't carry the
  // Authorization header. This fetches the bytes through the normal
  // JWT-bearing httpClient and hands back an object URL to assign as
  // `<img src>`. Callers must URL.revokeObjectURL(...) it when done.
  fetchPhotoBlobUrl: (profilePhotoUrl) =>
    httpClient
      .get(profilePhotoUrl, { responseType: "blob" })
      .then((res) => URL.createObjectURL(res.data)),
};
export default clientService;
