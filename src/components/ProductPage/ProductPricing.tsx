
import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface ProductPricingProps {
  product: Product;
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  onConditionChange: (condition: 'new' | 'pre-owned' | 'digital') => void;
}

// **New Component - Pricing section based on GameStop reference**
const ProductPricing: React.FC<ProductPricingProps> = ({ 
  product, 
  selectedCondition, 
  onConditionChange 
}) => {
  const { hasActiveSubscription } = useSubscriptions();
  const isProMember = hasActiveSubscription();

  // Since we don't have specific pricing fields in the Product type,
  // we'll use the main price and calculate variations
  const basePrice = product.price;
  const proDiscount = 0.10; // 10% Pro discount
  const proPrice = basePrice * (1 - proDiscount);

  // Simulate different pricing for different conditions
  const getPriceForCondition = (condition: 'new' | 'pre-owned' | 'digital') => {
    switch (condition) {
      case 'new':
        return basePrice * 1.1; // New items cost 10% more
      case 'digital':
        return basePrice * 0.9; // Digital items cost 10% less
      case 'pre-owned':
      default:
        return basePrice; // Use base price for pre-owned
    }
  };

  const currentPrice = getPriceForCondition(selectedCondition);
  const currentProPrice = currentPrice * (1 - proDiscount);

  const conditionOptions = [
    { value: 'pre-owned' as const, label: 'Usado', available: true },
    { value: 'new' as const, label: 'Novo', available: true },
    { value: 'digital' as const, label: 'Digital', available: false }, // Not always available
  ];

  return (
    <div className="space-y-4">
      {/* Condition Selector */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Condição</h3>
        <div className="flex flex-wrap gap-2">
          {conditionOptions.map((option) => (
            <Badge
              key={option.value}
              variant={selectedCondition === option.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1 text-sm",
                selectedCondition === option.value 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-secondary",
                !option.available && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => option.available && onConditionChange(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Price Display */}
      <div className="space-y-3">
        {/* Regular Price */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">
            R$ {currentPrice.toFixed(2)}
          </span>
          <Badge variant="outline" className="text-xs">
            {conditionOptions.find(opt => opt.value === selectedCondition)?.label}
          </Badge>
        </div>

        {/* Pro Price (if applicable) */}
        {isProMember && (
          <div className="flex items-center gap-2 p-3 bg-uti-pro/10 border border-uti-pro/20 rounded-lg">
            <Crown className="h-5 w-5 text-uti-pro" />
            <div>
              <p className="text-sm font-medium text-uti-pro">Seu preço UTI PRO</p>
              <p className="text-xl font-bold text-uti-pro">R$ {currentProPrice.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Pro Member Benefits (if not a member) */}
        {!isProMember && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-uti-pro" />
              <span className="text-sm font-medium text-uti-pro">UTI PRO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Membros UTI PRO pagam apenas <span className="font-bold text-uti-pro">R$ {currentProPrice.toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPricing;
