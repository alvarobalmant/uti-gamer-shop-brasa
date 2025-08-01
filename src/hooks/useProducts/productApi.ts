// Simple product API for basic functionality
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  digital_price?: number;
  images?: string[];
  category?: string;
  product_type?: string;
}

// Basic API functions - simplified version
export const getProductById = async (id: string): Promise<Product | null> => {
  // This is a placeholder - implement your actual product fetching logic
  return null;
};

export const getProducts = async (): Promise<Product[]> => {
  // This is a placeholder - implement your actual products fetching logic
  return [];
};

// Additional functions for compatibility
export const fetchProductsFromDatabase = getProducts;
export const fetchSingleProductFromDatabase = getProductById;
export const addProductToDatabase = async (product: Product): Promise<Product> => product;
export const updateProductInDatabase = async (product: Product): Promise<Product> => product;
export const deleteProductFromDatabase = async (id: string): Promise<void> => {};
export const fetchProductsByCriteria = async (criteria: any): Promise<Product[]> => [];
export const inheritFromMaster = (product: Product): Product => product;