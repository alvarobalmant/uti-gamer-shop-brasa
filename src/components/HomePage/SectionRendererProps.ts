
import { ProductSection } from '@/hooks/useProductSections';

export interface SectionRendererProps {
  section: ProductSection;
  onProductCardClick: (productId: string) => void;
}
