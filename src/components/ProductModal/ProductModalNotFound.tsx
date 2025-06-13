
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ProductModalNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
      <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Produto não encontrado
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        O produto que você está tentando visualizar não foi encontrado ou pode ter sido removido.
      </p>
    </div>
  );
};

export default ProductModalNotFound;
