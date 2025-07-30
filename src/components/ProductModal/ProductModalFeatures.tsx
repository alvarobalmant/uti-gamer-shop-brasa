import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useProductSpecifications } from '@/hooks/useProductSpecifications';

interface ProductModalFeaturesProps {
  product: Product;
}

const ProductModalFeatures: React.FC<ProductModalFeaturesProps> = ({ product }) => {
  const { categorizedSpecs, loading } = useProductSpecifications(product?.id);

  // Debug logs
  console.log('ProductModalFeatures - Product:', product);
  console.log('ProductModalFeatures - Categorized Specs:', categorizedSpecs);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h3>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Use categorized specs from the hook (already formatted with emojis and correct names)
  if (categorizedSpecs && categorizedSpecs.length > 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h3>
        {categorizedSpecs.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-2">
            <h4 className="text-md font-medium text-gray-800">{category.category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {category.items.map((spec, index) => (
                <div key={index} className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                  <div>
                    <span className="font-semibold text-gray-900">{spec.label}:</span>
                    <span className="ml-1">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback for legacy specifications format
  const specifications = product.specifications;
  if (!specifications || !Array.isArray(specifications) || specifications.length === 0) {
    console.log('No specifications found, not rendering section');
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Especificações Técnicas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {specifications.map((spec, index) => (
          <div key={index} className="flex items-start gap-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
            <div>
              <span className="font-semibold text-gray-900">{spec.label}:</span>
              <span className="ml-1">{spec.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductModalFeatures;

