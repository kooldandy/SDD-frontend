/**
 * API Request Utilities
 * 
 * Provides centralized error normalization and request handling
 * to ensure consistent error structures across the application.
 */

import { AxiosError } from 'axios';

export interface NormalizedError {
  status?: number;
  message: string;
  originalError?: unknown;
}

/**
 * Normalize API errors to a consistent structure
 * @param error - The error from axios or other source
 * @returns Normalized error object
 */
export const normalizeApiError = (error: unknown): NormalizedError => {
  if (error instanceof AxiosError) {
    return {
      status: error.response?.status,
      message:
        (error.response?.data as Record<string, unknown>)?.message ||
        error.message ||
        'Unknown error occurred',
      originalError: error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
    };
  }

  return {
    message: 'Unknown error occurred',
    originalError: error,
  };
};

/**
 * Execute an API request with error normalization
 * @param request - Async function that performs the API call
 * @returns The response data or throws normalized error
 */
export const apiRequest = async <T>(
  request: () => Promise<{ data: T }>
): Promise<T> => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};
