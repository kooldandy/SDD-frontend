import { ProductService } from "../products/productService";
import apiClient from "../api/apiClient";

export const globalServices = {
  productService: new ProductService(apiClient),
};
