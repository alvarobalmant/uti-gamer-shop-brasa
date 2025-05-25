
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Truck, Store, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<'pickup' | 'same-day' | 'ship'>('ship');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        // Definir valores padrão se disponíveis
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors && foundProduct.colors.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      }
    }
  }, [products, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            Voltar à loja
          </Button>
        </div>
      </div>
    );
  }

  const allImages = [product.image, ...(product.additional_images || [])];
  const originalPrice = product.price * 1.2;
  const memberPrice = product.price * 0.95;
  const newPrice = product.price + 1.71;
  const digitalPrice = product.price + 6.65;

  const getCurrentPrice = () => {
    switch (selectedCondition) {
      case 'new': return newPrice;
      case 'digital': return digitalPrice;
      default: return product.price;
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product, 
      selectedSize || undefined, 
      selectedColor || undefined
    );
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Gostaria de mais informações sobre:\n\n${product.name}\nPreço: R$ ${getCurrentPrice().toFixed(2)}\nCondição: ${selectedCondition === 'new' ? 'Novo' : selectedCondition === 'digital' ? 'Digital' : 'Usado'}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <h1 className="text-lg font-bold text-gray-900">UTI DOS GAMES</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Product Image Carousel */}
        <div className="relative mb-6">
          <img
            src={allImages[currentImageIndex]}
            alt={product.name}
            className="w-full h-80 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop';
            }}
          />
          
          {/* Image indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          {/* Brand and Rating */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {product.tags?.map((tag) => (
                <span key={tag.id} className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < 2 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">2.3 (6) Escrever avaliação</span>
            </div>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* Description - só aparece se existir */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Descrição</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Pricing */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              R$ {getCurrentPrice().toFixed(2)}
            </div>
            <div className="text-lg font-bold text-purple-600">
              R$ {(getCurrentPrice() * 0.95).toFixed(2)} for Pros
            </div>
          </div>

          {/* Pro Member Banner */}
          <div className="bg-gradient-to-r from-purple-100 to-orange-100 border border-purple-200 rounded-lg p-4">
            <div className="text-purple-700 font-semibold text-sm">
              Pros, Economize R$ {(getCurrentPrice() * 0.05).toFixed(2)} Quando Comprar R$ 250+ 
              na loja ou online - <span className="underline">Saiba mais</span>
            </div>
          </div>

          {/* Payment Option */}
          <div className="flex items-center gap-2">
            <div className="bg-purple-700 text-white px-2 py-1 rounded text-xs font-bold">ZIP</div>
            <span className="text-sm text-gray-600">
              pague em 4 parcelas de R$ {(getCurrentPrice() / 4).toFixed(2)}
            </span>
          </div>

          {/* Condition Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Condição: <span className="font-normal">{selectedCondition === 'new' ? 'Novo' : selectedCondition === 'digital' ? 'Digital' : 'Usado'}</span></label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedCondition === 'digital' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCondition('digital')}
                className="text-xs py-2"
              >
                <div className="text-center">
                  <div>Digital</div>
                  <div className="text-purple-600 font-bold">+R$ 6.65</div>
                </div>
              </Button>
              <Button
                variant={selectedCondition === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCondition('new')}
                className="text-xs py-2"
              >
                <div className="text-center">
                  <div>Novo</div>
                  <div className="text-purple-600 font-bold">+R$ 1.71</div>
                </div>
              </Button>
              <Button
                variant={selectedCondition === 'pre-owned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCondition('pre-owned')}
                className="text-xs py-2"
              >
                <div className="text-center">
                  <div>Usado</div>
                  <div className="text-purple-600 font-bold">R$ {memberPrice.toFixed(2)}</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Size Selection - só aparece se existir */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Tamanho: <span className="font-normal">{selectedSize}</span></label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className="text-sm"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection - só aparece se existir */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Cor: <span className="font-normal">{selectedColor}</span></label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className="text-sm"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Options */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Entrega: <span className="font-normal">Envio para Casa</span></label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedDelivery === 'pickup' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDelivery('pickup')}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Store className="w-4 h-4 mb-1" />
                <div className="text-xs text-center">
                  <div className="font-semibold">Retirar</div>
                  <div className="font-semibold">na loja</div>
                  <div className="text-gray-500">Encontrar loja</div>
                </div>
              </Button>
              <Button
                variant={selectedDelivery === 'same-day' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDelivery('same-day')}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Clock className="w-4 h-4 mb-1" />
                <div className="text-xs text-center">
                  <div className="font-semibold">Entrega</div>
                  <div className="font-semibold">no Mesmo Dia</div>
                  <div className="text-gray-500">Hoje</div>
                </div>
              </Button>
              <Button
                variant={selectedDelivery === 'ship' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDelivery('ship')}
                className="flex flex-col items-center py-3 h-auto"
              >
                <Truck className="w-4 h-4 mb-1" />
                <div className="text-xs text-center">
                  <div className="font-semibold">Envio para</div>
                  <div className="font-semibold">Casa</div>
                  <div className="text-gray-500">1-3 dias úteis</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Free Shipping Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="font-semibold text-sm">Frete GRÁTIS em Pedidos R$ 79+</div>
            <div className="text-sm text-gray-600">1-3 dias úteis</div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg rounded-lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adicionar ao Carrinho
          </Button>

          {/* WhatsApp Contact */}
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            className="w-full border-green-600 text-green-600 hover:bg-green-50 font-bold py-3"
          >
            💬 Entrar em Contato via WhatsApp
          </Button>

          {/* Stock Info - só aparece se existir */}
          {product.stock !== undefined && product.stock > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-semibold text-sm text-green-700">
                ✅ Em estoque: {product.stock} unidades disponíveis
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
