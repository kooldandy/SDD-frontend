import apiClient from './productApiClient'
import { Product, ProductInput } from './productTypes'
import { BaseApi } from '../api/BaseApi'

/**
 * Product Service
 * 
 * Extends BaseApi to provide typed product API endpoints with
 * automatic error normalization and Auth0 token injection.
 */
export class ProductService extends BaseApi {
  constructor() {
    super(apiClient)
  }

  /**
   * Fetch all products
   */
  async listProducts(): Promise<Product[]> {
    return this.get<Product[]>('/product')
  }

  /**
   * Create a new product
   */
  async createProduct(input: ProductInput): Promise<Product> {
    return this.post<Product>('/product', input)
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, input: ProductInput): Promise<Product> {
    return this.patch<Product>(`/product/${id}`, input)
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    return this.delete(`/product/${id}`)
  }
}

// Export singleton instance for use in Redux thunks
export const productService = new ProductService()

