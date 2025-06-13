
import { Product } from '@/hooks/useProducts';

export interface RelatedProductsProps {
  relatedProducts: Product[];
  currentProductId: string;
  onProductClick?: (productId: string) => void;
}
