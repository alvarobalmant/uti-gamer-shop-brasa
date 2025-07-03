import React, { memo } from 'react';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProductPageSKUErrorProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
  onBack: () => void;
}

const ProductPageSKUError = memo(({ onCartOpen, onAuthOpen, onBack }: ProductPageSKUErrorProps) => {
  return (
    <div className="min-h-screen bg-white">
      <ProfessionalHeader 
        onCartOpen={onCartOpen}
        onAuthOpen={onAuthOpen}
      />
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6 text-center">
          O produto que você está procurando não existe ou foi removido.
        </p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    </div>
  );
});

ProductPageSKUError.displayName = 'ProductPageSKUError';

export default ProductPageSKUError;