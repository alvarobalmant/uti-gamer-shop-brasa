import React from 'react';

// Define a simplified Product type for the placeholder
type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  // Add other fields as needed by the actual component
};

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  // Placeholder implementation
  return (
    <div className="container mx-auto my-8 p-6 bg-gray-800 border border-gray-700 rounded">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="border border-gray-700 rounded p-3 text-center bg-gray-750">
              <div className="w-full h-32 bg-gray-600 mb-2 rounded flex items-center justify-center text-gray-400">
                [Imagem {product.image_url ? '' : 'Indisponível'}]
              </div>
              <p className="text-white text-sm truncate">{product.name}</p>
              <p className="text-green-400 font-semibold">R$ {product.price.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">[Nenhum produto para exibir nesta seção]</p>
        )}
      </div>
    </div>
  );
};

export default ProductSection;

