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
  };
}

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
};
export default clientService;
