import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductModalFeaturesProps {
  product: Product;
}

const ProductModalFeatures: React.FC<ProductModalFeaturesProps> = ({ product }) => {
  // Debug: log the product to see what we're getting
  console.log('ProductModalFeatures - Product:', product);
  console.log('ProductModalFeatures - Specifications:', product.specifications);

  // Check if specifications exist and are an array
  const specifications = product.specifications;

  // If no specifications, don't render the section
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

