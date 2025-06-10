
import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  products: Product[];
}

const ProductModal: React.FC<ProductModalProps> = ({ 
  isOpen, 
  onClose, 
  productId, 
  products 
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        // Resetar estado quando um novo produto é selecionado
        setQuantity(1);
        setSelectedImageIndex(0);
        
        // Selecionar primeiro tamanho e cor disponíveis
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        } else {
          setSelectedSize('');
        }
        
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        } else {
          setSelectedColor('');
        }
      }
    }
  }, [productId, products]);

  if (!isOpen || !product) return null;

  const allImages = [product.image, ...(product.additional_images || [])].filter(Boolean);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(
        product, 
        selectedSize || undefined, 
        selectedColor || undefined
      );
    }
    
    // Resetar quantidade após adicionar ao carrinho
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Detalhes do Produto</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galeria de Imagens */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {allImages.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImageIndex === index 
                          ? 'border-red-600' 
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Nome e Badge */}
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {product.name}
                  </h1>
                  {product.badge_text && (
                    <Badge 
                      className="text-xs"
                      style={{ 
                        backgroundColor: product.badge_color || '#EF4444',
                        color: '#FFFFFF'
                      }}
                    >
                      {product.badge_text}
                    </Badge>
                  )}
                </div>
                
                {/* Avaliação */}
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!) 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({product.rating})
                    </span>
                  </div>
                )}
              </div>

              {/* Preços */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.list_price && product.list_price > product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.list_price)}
                    </span>
                  )}
                </div>

                {product.pro_price && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      UTI PRO
                    </Badge>
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(product.pro_price)}
                    </span>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {product.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Opções de Tamanho */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tamanho</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          selectedSize === size
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Opções de Cor */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cor</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-2 border rounded-md text-sm font-medium ${
                          selectedColor === color
                            ? 'border-red-600 bg-red-50 text-red-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Controle de Quantidade */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Quantidade</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold px-4">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Estoque */}
              {product.stock !== undefined && (
                <div className="text-sm text-gray-600">
                  {product.stock > 0 ? (
                    <span className="text-green-600">
                      ✓ {product.stock} unidades em estoque
                    </span>
                  ) : (
                    <span className="text-red-600">
                      ✗ Produto indisponível
                    </span>
                  )}
                </div>
              )}

              {/* Botão Adicionar ao Carrinho */}
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho ({quantity})
              </Button>

              {/* Especificações */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Especificações</h3>
                  <div className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-1 border-b border-gray-200 last:border-b-0">
                        <span className="text-gray-600">{spec.label}:</span>
                        <span className="font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Informações de Entrega */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Informações de Entrega</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📦 Entrega rápida para toda Grande Vitória</p>
                  <p>🚚 Frete grátis para compras acima de R$ 200</p>
                  <p>🔄 30 dias para trocas e devoluções</p>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
