
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useScrollPosition } from '@/hooks/useScrollPosition';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { saveCurrentPosition } = useScrollPosition();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('pre-owned');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
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
    for (let i = 0; i < quantity; i++) {
      addToCart(
        product, 
        selectedSize || undefined, 
        selectedColor || undefined
      );
    }
  };

  const handleBackClick = () => {
    saveCurrentPosition();
    navigate('/');
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Gostaria de mais informações sobre:\n\n${product.name}\nPreço: R$ ${getCurrentPrice().toFixed(2)}\nCondição: ${selectedCondition === 'new' ? 'Novo' : selectedCondition === 'digital' ? 'Digital' : 'Usado'}`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-md group">
              <img
                src={allImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=600&fit=crop';
                }}
              />
            </div>
            
            {/* Image Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-red-600 ring-2 ring-red-600/20' 
                        : 'border-gray-200 hover:border-gray-300'
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

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag) => (
                    <span key={tag.id} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-5 h-5 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
                <span className="text-gray-600">4.8 (124 avaliações)</span>
              </div>
            </div>

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
                    onClick={() => setSelectedCondition(key as any)}
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

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Formato: <span className="font-normal text-gray-700">{selectedSize}</span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      onClick={() => setSelectedSize(size)}
                      className={`${
                        selectedSize === size 
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                      }`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-lg font-semibold text-gray-900">
                  Cor: <span className="font-normal text-gray-700">{selectedColor}</span>
                </label>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      onClick={() => setSelectedColor(color)}
                      className={`${
                        selectedColor === color 
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' 
                          : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                      }`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-lg font-semibold text-gray-900">Quantidade</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.stock > 0 ? `${product.stock} unidades em estoque` : 'Produto esgotado'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
              </Button>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 font-semibold py-4 rounded-lg transition-all"
              >
                <Heart className="w-5 h-5 mr-2" />
                Adicionar aos Favoritos
              </Button>

              <Button
                onClick={handleWhatsAppContact}
                variant="outline"
                className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg"
              >
                💬 Entrar em Contato via WhatsApp
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Entrega rápida</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Suporte WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Garantia oficial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Frete grátis R$79+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
