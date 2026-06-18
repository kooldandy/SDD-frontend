/**
 * Base API Service Class
 * 
 * Provides a foundation for domain-specific API services with common
 * HTTP methods (GET, POST, PUT, DELETE, PATCH) wrapped with error
 * normalization and proper type safety.
 */

import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { apiRequest } from './apiRequest'

export class BaseApi {
  protected api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  /**
   * Execute a GET request
   * @param url - The endpoint URL
   * @param config - Optional axios config
   * @returns The response data
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiRequest<T>(() => this.api.get(url, config));
  }

  /**
   * Execute a POST request
   * @param url - The endpoint URL
   * @param data - The request body
   * @param config - Optional axios config
   * @returns The response data
   */
  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return apiRequest<T>(() => this.api.post(url, data, config));
  }

  /**
   * Execute a PUT request
   * @param url - The endpoint URL
   * @param data - The request body
   * @param config - Optional axios config
   * @returns The response data
   */
  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return apiRequest<T>(() => this.api.put(url, data, config));
  }

  /**
   * Execute a PATCH request
   * @param url - The endpoint URL
   * @param data - The request body
   * @param config - Optional axios config
   * @returns The response data
   */
  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return apiRequest<T>(() => this.api.patch(url, data, config));
  }

  /**
   * Execute a DELETE request
   * @param url - The endpoint URL
   * @param config - Optional axios config
   * @returns The response data
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return apiRequest<T>(() => this.api.delete(url, config));
  }
}
