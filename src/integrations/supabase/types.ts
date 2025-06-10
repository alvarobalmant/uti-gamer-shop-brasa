export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  specifications?: Array<{
    label: string;
    value: string;
  }>;
  images?: string[];
  // ... outros campos existentes do produto
}

