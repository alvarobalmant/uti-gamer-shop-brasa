import React from 'react';
import { Product } from '@/hooks/useProducts';
import { useUTIProOptimized } from '@/hooks/useUTIProOptimized';
import { formatPrice } from '@/utils/formatPrice';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProductPricingProps {
  product: Product;
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  onConditionChange: (condition: 'new' | 'pre-owned' | 'digital') => void;
}

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
const ProductPricing: React.FC<ProductPricingProps> = ({
  product,
  selectedCondition,
  onConditionChange,
}) => {
  const utiPro = useUTIProOptimized(product);

  // --- Price Calculation --- 
  const prices = {
    'pre-owned': product.price,
    'new': product.new_price || product.price * 1.1,
    'digital': product.digital_price || product.price * 1.05,
  };
  const currentPrice = prices[selectedCondition];
  const listPrice = product.list_price;

  // --- Condition Options --- 
  // Determine available conditions based on product data (e.g., tags or specific fields)
  const availableConditions = [
    { key: 'pre-owned', label: 'Usado', price: prices['pre-owned'] },
    // Only show 'new' if new_price exists or product tag indicates 'novo'
    (prices['new'] && product.tags?.some(t => t.name.toLowerCase() === 'novo')) && 
      { key: 'new', label: 'Novo', price: prices['new'] },
    // Only show 'digital' if digital_price exists or product tag indicates 'digital'
    (prices['digital'] && product.tags?.some(t => t.name.toLowerCase() === 'digital')) && 
      { key: 'digital', label: 'Digital', price: prices['digital'] },
  ].filter(Boolean) as { key: 'new' | 'pre-owned' | 'digital'; label: string; price: number }[];

  // Sort conditions by price (optional, but logical)
  availableConditions.sort((a, b) => a.price - b.price);

  return (
    <div className="space-y-4">
      {/* Não mostrar nada se ainda está carregando */}
      {utiPro.loading && (
        <div className="flex flex-col items-start">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(currentPrice)}
          </span>
          {listPrice && listPrice > currentPrice && (
            <span className="text-sm text-muted-foreground line-through ml-1">
              {formatPrice(listPrice)}
            </span>
          )}
        </div>
      )}

      {/* Conteúdo normal quando carregamento terminar */}
      {!utiPro.loading && (
        <div className="flex flex-col items-start">
          <span className="text-3xl font-bold text-foreground">
            {formatPrice(currentPrice)}
          </span>
          {listPrice && listPrice > currentPrice && (
            <span className="text-sm text-muted-foreground line-through ml-1">
              {formatPrice(listPrice)}
            </span>
          )}
          
          {/* SEU PREÇO UTI PRO - para membros */}
          {utiPro.showMemberMessage && utiPro.proPrice && (
            <div className="mt-2 bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300 rounded-lg p-3 w-full">
              <div className="flex items-center gap-1.5 text-yellow-800">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-bold">SEU PREÇO UTI PRO</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-bold text-yellow-800">
                  {formatPrice(utiPro.proPrice)}
                </span>
                <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                  -{utiPro.discountPercentage}% OFF
                </span>
              </div>
              <span className="text-xs text-yellow-700">
                Você está economizando {formatPrice(utiPro.savings || 0)}
              </span>
            </div>
          )}
          
          {/* PREÇO MEMBRO UTI PRO - para não membros */}
          {utiPro.showProMessage && utiPro.proPrice && (
            <div className="mt-1 flex items-center gap-1.5 text-purple-600">
              <Crown className="h-4 w-4" />
              <span className="text-base font-semibold">
                {formatPrice(utiPro.proPrice)}
              </span>
              <span className="text-sm font-medium">para membros UTI PRO</span>
            </div>
          )}
        </div>
      )}

      {/* Seção de condição removida conforme solicitado pelo usuário */}
    </div>
  );
};

export default ProductPricing;

