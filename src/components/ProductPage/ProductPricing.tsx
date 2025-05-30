
import { Button } from '@/components/ui/button';
import { Product } from '@/hooks/useProducts';

interface ProductPricingProps {
  product: Product;
  selectedCondition: 'new' | 'pre-owned' | 'digital';
  onConditionChange: (condition: 'new' | 'pre-owned' | 'digital') => void;
}

const ProductPricing = ({ product, selectedCondition, onConditionChange }: ProductPricingProps) => {
  const newPrice = product.price + 1.71;
  const digitalPrice = product.price + 6.65;

  const getCurrentPrice = () => {
    switch (selectedCondition) {
      case 'new': return newPrice;
      case 'digital': return digitalPrice;
      default: return product.price;
    }
  };

  return (
    <>
      {/* Pricing Block */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-gray-900">
              R$ {getCurrentPrice().toFixed(2)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              R$ {(getCurrentPrice() * 1.2).toFixed(2)}
            </span>
          </div>
          
          <div className="text-lg font-semibold text-purple-600">
            R$ {(getCurrentPrice() * 0.95).toFixed(2)} Membros Pro
          </div>
          
          <div className="text-gray-600">
            ou 12x de R$ {(getCurrentPrice() / 12).toFixed(2)} sem juros
          </div>
        </div>
      </div>

      {/* Condition Selection */}
      <div className="space-y-3">
        <label className="text-lg font-semibold text-gray-900">
          Condição: <span className="font-normal text-gray-700">
            {selectedCondition === 'new' ? 'Novo' : selectedCondition === 'digital' ? 'Digital' : 'Usado'}
          </span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'digital', label: 'Digital', extra: '+R$ 6.65' },
            { key: 'new', label: 'Novo', extra: '+R$ 1.71' },
            { key: 'pre-owned', label: 'Usado', extra: 'Melhor preço' }
          ].map(({ key, label, extra }) => (
            <Button
              key={key}
              variant={selectedCondition === key ? 'default' : 'outline'}
              onClick={() => onConditionChange(key as any)}
              className={`h-auto py-4 ${
                selectedCondition === key 
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                  : 'border-gray-300 hover:border-red-500 hover:text-red-600'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold">{label}</div>
                <div className="text-xs opacity-80">{extra}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductPricing;
