// Provide typings for Vite's import.meta.env to satisfy TypeScript
/// <reference types="vite/client" />
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_AUTH0_DOMAIN: string
    readonly VITE_AUTH0_CLIENT_ID: string
    readonly VITE_AUTH0_AUDIENCE: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}