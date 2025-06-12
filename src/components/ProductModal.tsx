import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Product } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import { X, ShoppingCart, Minus, Plus, Zap, Shield, Truck, Award, Clock, CheckCircle, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  loading?: boolean;
  relatedProducts?: Product[];
  onRelatedProductClick?: (productId: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onOpenChange,
  product,
  loading = false,
  relatedProducts = [],
  onRelatedProductClick
}) => {
  const isMobile = useIsMobile();
  const { addToCart, loading: cartLoading } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [product?.id]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product);
      toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao carrinho.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product);
      toast({
        title: "Redirecionando para checkout...",
        description: "Finalizando sua compra.",
      });
      // Aqui seria o redirecionamento para checkout
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a compra.",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleImageHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMobile) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
      setIsZoomed(true);
    }
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const proPrice = product ? product.price * 0.9 : 0;
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0;

  // Especificações configuráveis - virão do banco de dados
  const specifications = product?.specifications || [
    { label: "Armazenamento", value: "1TB SSD" },
    { label: "Resolução", value: "4K Ultra HD" },
    { label: "Processador", value: "AMD Zen 2" },
    { label: "Memória RAM", value: "16GB GDDR6" },
    { label: "Conectividade", value: "Wi-Fi 6, Bluetooth 5.1" },
    { label: "Dimensões", value: "30.1 x 15.1 x 15.1 cm" },
    { label: "Peso", value: "4.45 kg" },
    { label: "Garantia", value: "12 meses" }
  ];

  // Múltiplas imagens do produto - virão do banco de dados
  const productImages = product?.images || [product?.image].filter(Boolean);

  // Produtos relacionados simulados se não houver dados
  const mockRelatedProducts = relatedProducts.length > 0 ? relatedProducts : [
    {
      id: '2',
      name: 'Xbox Wireless Controller',
      price: 299.99,
      image: '/placeholder.svg',
      badge: '',
      badgeColor: '',
      inStock: true,
      stock: 10
    },
    {
      id: '3',
      name: 'Xbox Game Pass Ultimate',
      price: 44.99,
      image: '/placeholder.svg',
      badge: '',
      badgeColor: '',
      inStock: true,
      stock: 10
    },
    {
      id: '4',
      name: 'Halo Infinite',
      price: 199.99,
      image: '/placeholder.svg',
      badge: '',
      badgeColor: '',
      inStock: true,
      stock: 10
    },
    {
      id: '5',
      name: 'Forza Horizon 5',
      price: 179.99,
      image: '/placeholder.svg',
      badge: '',
      badgeColor: '',
      inStock: true,
      stock: 10
    }
  ];

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl w-full max-h-[90vh] p-0 rounded-xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!product) {
    return null;
  }

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-xl">
          <div className="h-full flex flex-col bg-white rounded-t-xl">
            {/* Header fixo */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-xl">
              <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
                {product.name}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Imagem do produto */}
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={productImages[selectedImageIndex] || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Miniaturas de imagens */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-red-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} - Imagem ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Informações do produto */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    {product.badge && (
                      <Badge variant="secondary" className={`bg-${product.badgeColor || 'orange'}-500 text-white`}>
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatPrice(proPrice)} com UTI PRO
                    </div>
                    <div className="text-sm text-gray-600">
                      ou 4x de {formatPrice(product.price / 4)} sem juros
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                      {isOutOfStock ? 'Fora de Estoque' : 'Em Estoque'}
                    </span>
                  </div>

                  {/* Seletor de quantidade */}
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Quantidade:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(-1)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-1 text-center min-w-[3rem]">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuantityChange(1)}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Botões de ação */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleBuyNow}
                      disabled={isOutOfStock || cartLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Comprar com 1 Clique
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock || cartLoading}
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50 font-semibold py-3 rounded-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>

                  {/* Indicadores de confiança */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Por que comprar na UTI dos Games?</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Compra 100% segura e protegida</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Produto original com garantia</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span>Entrega rápida para todo o Brasil</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Award className="w-4 h-4 text-green-600" />
                        <span>Loja tradicional há mais de 10 anos</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>Suporte especializado 24/7</span>
                      </div>
                    </div>
                  </div>

                  {/* Descrição do produto */}
                  {product.description && product.description.trim().length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição do Produto</h3>
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  )}

                  {/* Especificações técnicas */}
                  {specifications && specifications.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificações Técnicas</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <span className="font-medium text-gray-700">{spec.label}:</span>
                            <span className="text-gray-900 text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Produtos relacionados */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Você também pode gostar</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mockRelatedProducts.slice(0, 4).map((relatedProduct) => (
                        <div
                          key={relatedProduct.id}
                          onClick={() => onRelatedProductClick?.(relatedProduct.id)}
                          className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-square bg-gray-50 rounded-md overflow-hidden mb-2">
                            <img
                              src={relatedProduct.image}
                              alt={relatedProduct.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <h4 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                            {relatedProduct.name}
                          </h4>
                          <p className="text-xs font-bold text-gray-900">
                            {formatPrice(relatedProduct.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] p-0 rounded-xl">
        <div className="h-full max-h-[90vh] flex flex-col bg-white rounded-xl">
          {/* Header fixo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
              {product.name}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="rounded-full h-10 w-10 p-0 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Conteúdo scrollável */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-8">
              {/* Seção principal do produto */}
              <div className="grid gap-8 lg:grid-cols-2">
                
                {/* Galeria de imagens */}
                <div className="space-y-4">
                  {/* Imagem principal com zoom */}
                  <div className="relative">
                    <div 
                      className="aspect-square bg-gray-50 rounded-lg overflow-hidden cursor-zoom-in relative"
                      onMouseMove={handleImageHover}
                      onMouseLeave={handleImageLeave}
                    >
                      <img
                        src={productImages[selectedImageIndex] || product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 transition-transform duration-200"
                      />
                      
                      {/* Zoom overlay */}
                      {isZoomed && (
                        <div 
                          className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center pointer-events-none"
                          style={{
                            backgroundImage: `url(${productImages[selectedImageIndex] || product.image})`,
                            backgroundSize: '200%',
                            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            backgroundRepeat: 'no-repeat'
                          }}
                        >
                          <ZoomIn className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Miniaturas de imagens */}
                  {productImages.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {productImages.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors hover:border-red-300 ${
                            selectedImageIndex === index ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${product.name} - Imagem ${index + 1}`}
                            className="w-full h-full object-contain p-1"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Informações do produto */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                      {product.badge && (
                        <Badge variant="secondary" className={`bg-${product.badgeColor || 'orange'}-500 text-white`}>
                          {product.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                      <div className="text-xl font-semibold text-blue-600">
                        {formatPrice(proPrice)} com UTI PRO
                      </div>
                      <div className="text-gray-600">
                        ou 4x de {formatPrice(product.price / 4)} sem juros
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <span className={`font-semibold ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                        {isOutOfStock ? 'Fora de Estoque' : 'Em Estoque'}
                      </span>
                    </div>

                    {/* Seletor de quantidade */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-700 font-medium">Quantidade:</span>
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(-1)}
                          className="h-10 w-10 p-0 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-6 py-2 text-center min-w-[4rem] font-medium">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(1)}
                          className="h-10 w-10 p-0 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock || cartLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg rounded-lg"
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Comprar com 1 Clique
                      </Button>
                      <Button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || cartLoading}
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-50 font-semibold py-4 text-lg rounded-lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </div>

                  {/* Indicadores de confiança */}
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Por que comprar na UTI dos Games?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-700">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>Compra 100% segura e protegida</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Produto original com garantia</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Truck className="w-5 h-5 text-green-600" />
                        <span>Entrega rápida para todo o Brasil</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Award className="w-5 h-5 text-green-600" />
                        <span>Loja tradicional há mais de 10 anos</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Clock className="w-5 h-5 text-green-600" />
                        <span>Suporte especializado 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descrição do produto */}
              {product.description && product.description.trim().length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Descrição do Produto</h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                </div>
              )}

              {/* Especificações técnicas */}
              {specifications && specifications.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Especificações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">{spec.label}:</span>
                        <span className="text-gray-900 font-medium text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Produtos relacionados */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Você também pode gostar</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mockRelatedProducts.slice(0, 4).map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      onClick={() => onRelatedProductClick?.(relatedProduct.id)}
                      className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square bg-gray-50 rounded-md overflow-hidden mb-3">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-900">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;

