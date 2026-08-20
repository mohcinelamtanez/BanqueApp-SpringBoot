import axios from 'axios'
export const httpClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 10000, headers: { 'Content-Type': 'application/json' } })
// Services currently use local data. Replace their internals with httpClient calls when the backend contract is available.
