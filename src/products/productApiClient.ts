import axios from 'axios'

// Provide typings for Vite's import.meta.env to satisfy TypeScript
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' }
})

export default api
