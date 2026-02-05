// Stub: product_specifications table removed - use product.specifications from integra_products
import { useState, useEffect, useMemo } from 'react';

export interface ProductSpecification {
  id: string;
  product_id: string;
  category: string;
  label: string;
  value: string;
  highlight: boolean;
  order_index: number;
  icon?: string;
}

export interface SpecificationCategory {
  category: string;
  items: ProductSpecification[];
}

export const useProductSpecifications = (productId: string, viewType: 'mobile' | 'desktop' = 'desktop', product?: any) => {
  const [loading, setLoading] = useState(false);

  // Extract specifications from product object (from integra_products via mapper)
  const specifications = useMemo<ProductSpecification[]>(() => {
    if (!product) return [];

    // Try to get specs from product.specifications array
    const specs = product.specifications || [];
    
    if (Array.isArray(specs)) {
      return specs.map((spec: any, index: number) => ({
        id: `${productId}-spec-${index}`,
        product_id: productId,
        category: spec.category || 'Informações Gerais',
        label: spec.label || spec.name || '',
        value: spec.value || '',
        highlight: spec.highlight || false,
        order_index: spec.order_index || index,
        icon: spec.icon,
      }));
    }

    return [];
  }, [product, productId]);

  // Group by category
  const categorizedSpecs = useMemo<SpecificationCategory[]>(() => {
    const categoryMap = new Map<string, ProductSpecification[]>();
    
    specifications.forEach((spec) => {
      if (!categoryMap.has(spec.category)) {
        categoryMap.set(spec.category, []);
      }
      categoryMap.get(spec.category)!.push(spec);
    });

    return Array.from(categoryMap.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.order_index - b.order_index)
    }));
  }, [specifications]);

  // Stub functions - specs are managed via ERP
  const addSpecification = async () => ({ success: false, error: 'Use ERP' });
  const updateSpecification = async () => ({ success: false, error: 'Use ERP' });
  const deleteSpecification = async () => ({ success: false, error: 'Use ERP' });
  const refreshSpecifications = async () => {};

  return {
    specifications,
    categorizedSpecs,
    loading,
    addSpecification,
    updateSpecification,
    deleteSpecification,
    refreshSpecifications
  };
};