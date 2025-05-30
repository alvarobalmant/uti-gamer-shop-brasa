
import React from 'react';
import { Product } from '@/types/product';
import { useSubscriptions } from '@/hooks/useSubscriptions';
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
  const { hasActiveSubscription } = useSubscriptions();
  const isProMember = hasActiveSubscription();

  // --- Price Calculation --- 
  // Use actual prices if available, otherwise calculate based on base price
  // Example: Assume product.price is pre-owned, product.new_price, product.digital_price exist
  const prices = {
    'pre-owned': product.price,
    'new': product.new_price || product.price * 1.1, // Example fallback
    'digital': product.digital_price || product.price * 1.05, // Example fallback
  };
  const currentPrice = prices[selectedCondition];
  const listPrice = product.list_price; // Use if available

  // Calculate Pro price (example: 10% discount on current condition price)
  const proDiscount = 0.10;
  const proPrice = currentPrice * (1 - proDiscount);

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
      {/* Price Display */}
      <div className="flex flex-col items-start">
        <span className="text-3xl font-bold text-foreground">
          R$ {currentPrice.toFixed(2)}
        </span>
        {listPrice && listPrice > currentPrice && (
          <span className="text-sm text-muted-foreground line-through ml-1">
            R$ {listPrice.toFixed(2)}
          </span>
        )}
        {/* Pro Price Info */}
        <div className="mt-1 flex items-center gap-1.5 text-uti-pro">
          <Crown className="h-4 w-4" />
          <span className="text-base font-semibold">
            R$ {proPrice.toFixed(2)}
          </span>
          <span className="text-sm font-medium">para membros UTI PRO</span>
          {/* Optional: Link to join Pro */}
          {/* <a href="/pro" className="text-xs underline ml-2">Saiba mais</a> */}
        </div>
      </div>

      {/* Condition Selection (Radio Group - GameStop Style) */}
      {availableConditions.length > 1 && (
        <div>
          <Label className="text-sm font-medium text-foreground mb-2 block">Condição:</Label>
          <RadioGroup
            value={selectedCondition}
            onValueChange={(value) => onConditionChange(value as any)}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {availableConditions.map(({ key, label, price }) => (
              <Label
                key={key}
                htmlFor={`condition-${key}`}
                className={cn(
                  "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  selectedCondition === key ? "border-uti-red ring-1 ring-uti-red" : ""
                )}
              >
                <RadioGroupItem value={key} id={`condition-${key}`} className="sr-only" />
                <span className="text-sm font-semibold mb-0.5">{label}</span>
                <span className="text-xs text-muted-foreground">R$ {price.toFixed(2)}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
};

export default ProductPricing;

