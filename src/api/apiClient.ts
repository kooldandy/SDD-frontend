import axios from 'axios'
import { authAdapter } from '../api/authAdapter'

/**
 * Axios instance for product API calls
 * 
 * Features:
 * - Automatic Auth0 token injection via interceptor
 * - Correlation ID tracking for observability
 * - Global error handling and response normalization
 * - Request/response logging
 */
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

/**
 * Request Interceptor
 * Adds Auth0 access token and correlation ID to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    // Inject Auth0 access token
    const token = await authAdapter.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add correlation ID for request tracing
    config.headers['x-correlation-id'] = crypto.randomUUID()

    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor
 * Handles global error cases like 401, 403, 500
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status

    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        console.error('Unauthorized: Please log in again')
        // Could trigger re-authentication here
        break

      case 403:
        console.error('Forbidden: You do not have access to this resource')
        break

      case 500:
        console.error('Server Error: The server encountered an unexpected condition')
        break

      default:
        // Other errors handled by calling code
        break
    }

    return Promise.reject(error)
  }
)

export default apiClient

