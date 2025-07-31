import React from 'react';
import { Product } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onOpenChange,
  onAddToCart
}) => {
  if (!product) return null;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <img
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
              {product.brand && (
                <p className="text-muted-foreground">{product.brand}</p>
              )}
            </div>
            
            <div className="text-3xl font-bold text-primary">
              R$ {product.price.toFixed(2)}
            </div>
            
            {product.description && (
              <div>
                <h4 className="font-semibold mb-2">Descrição</h4>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleAddToCart} className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;