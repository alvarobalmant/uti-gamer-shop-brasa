// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Truck, 
  Store, 
  Clock, 
  Shield, 
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  AlertCircle
} from 'lucide-react';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ProductPageProfessional = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { addToCart, loading: cartLoading } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedCondition, setSelectedCondition] = useState<'new' | 'pre-owned' | 'digital'>('new');
  const [selectedEdition, setSelectedEdition] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (products.length > 0 && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        // Set default condition based on product tags
        const isNew = foundProduct.tags?.some(t => t.name.toLowerCase().includes('novo'));
        setSelectedCondition(isNew ? 'new' : 'pre-owned');
      }
    }
  }, [products, id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | UTI dos Games`;
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product);
      toast({
        title: "Produto adicionado ao carrinho!",
        description: `${product.name} foi adicionado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleBack = async () => {
    console.log('[ProductPageProfessional] Botão voltar clicado');
    // NÃO salvar a posição atual da página de produto - queremos manter a posição da página anterior
    navigate(-1);
  };

  const handleImageNavigation = (direction: 'prev' | 'next') => {
    if (!product?.images) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(prev => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setSelectedImageIndex(prev => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const getConditionPrice = () => {
    if (!product) return 0;
    
    switch (selectedCondition) {
      case 'new':
        return product.price;
      case 'pre-owned':
        return product.price * 0.85; // 15% discount for pre-owned
      case 'digital':
        return product.price * 0.9; // 10% discount for digital
      default:
        return product.price;
    }
  };

  const getEditionPrice = () => {
    const basePrice = getConditionPrice();
    
    switch (selectedEdition) {
      case 'deluxe':
        return basePrice * 1.3; // 30% more for deluxe
      case 'collector':
        return basePrice * 1.5; // 50% more for collector
      default:
        return basePrice;
    }
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader onCartOpen={() => setShowCart(true)} onAuthOpen={() => setShowAuthModal(true)} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ProfessionalHeader onCartOpen={() => setShowCart(true)} onAuthOpen={() => setShowAuthModal(true)} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h1>
            <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = getEditionPrice();
  const originalPrice = product.originalPrice || product.price;
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader onCartOpen={() => setShowCart(true)} onAuthOpen={() => setShowAuthModal(true)} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={handleBack} className="hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span>/</span>
            <span>Video Games</span>
            <span>/</span>
            <span>PlayStation 5</span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border">
              <div className="aspect-square relative">
                <img
                  src={product.images?.[selectedImageIndex] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
                
                {/* Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 bg-white rounded border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Publisher/Brand */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Por</span>
              <span className="text-sm font-medium text-blue-600">UTI dos Games</span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {product.isFeatured && (
                  <Badge variant="destructive" className="bg-red-500">
                    Bestseller
                  </Badge>
                )}
                {product.isNew && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Novo
                  </Badge>
                )}
                {discount > 0 && (
                  <Badge variant="destructive">
                    -{discount}%
                  </Badge>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(127 avaliações)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  R$ {currentPrice.toFixed(2).replace('.', ',')}
                </span>
                {discount > 0 && (
                  <span className="text-lg text-gray-500 line-through">
                    R$ {originalPrice.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">Data de Lançamento: 31/10/2025</p>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Plataforma
              </label>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-red-500 text-red-500">
                  PlayStation 5
                  <span className="ml-2 text-xs">+2 mais</span>
                </Button>
              </div>
            </div>

            {/* Condition Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Condição
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['new', 'pre-owned', 'digital'].map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setSelectedCondition(condition as any)}
                    className={`p-3 text-center border rounded-lg transition-all ${
                      selectedCondition === condition
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">
                      {condition === 'new' ? 'Novo' : condition === 'pre-owned' ? 'Usado' : 'Digital'}
                    </div>
                    <div className="text-sm text-gray-600">
                      R$ {getConditionPrice().toFixed(2).replace('.', ',')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Edition Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Edição
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['standard', 'deluxe', 'collector'].map((edition) => (
                  <button
                    key={edition}
                    onClick={() => setSelectedEdition(edition)}
                    className={`p-3 text-center border rounded-lg transition-all ${
                      selectedEdition === edition
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">
                      {edition === 'standard' ? 'Padrão' : edition === 'deluxe' ? 'Deluxe' : 'Colecionador'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-900">
                Entrega
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 border border-gray-200 rounded-lg text-center">
                  <Store className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <div className="text-xs font-medium">Retirar na loja</div>
                  <div className="text-xs text-gray-500">Não disponível</div>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <div className="text-xs font-medium">Entrega no mesmo dia</div>
                  <div className="text-xs text-gray-500">Não disponível</div>
                </div>
                <div className="p-3 border border-red-500 bg-red-50 rounded-lg text-center">
                  <Truck className="w-5 h-5 mx-auto mb-1 text-red-500" />
                  <div className="text-xs font-medium text-red-700">Envio para casa</div>
                  <div className="text-xs text-red-600">1-3 dias úteis</div>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                Frete GRÁTIS em pré-pedidos acima de R$ 150
              </p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                disabled={cartLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
              >
                {cartLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adicionando...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </>
                )}
              </Button>

              {/* Additional Actions */}
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritar
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="w-5 h-5 text-green-500" />
                <span>Garantia de 30 dias</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Check className="w-5 h-5 text-green-500" />
                <span>Produto original e lacrado</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="w-5 h-5 text-blue-500" />
                <span>Frete grátis acima de R$ 150</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Descrição do Produto</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.description || `Descubra ${product.name}, uma experiência única de gaming que vai revolucionar sua forma de jogar. Com gráficos impressionantes e jogabilidade envolvente, este título promete horas de diversão.`}
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Características principais:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Gráficos de última geração com tecnologia avançada</li>
              <li>Modo multiplayer online para até 8 jogadores</li>
              <li>Campanha single-player com mais de 40 horas de conteúdo</li>
              <li>Sistema de progressão e customização profundo</li>
              <li>Compatível com controles DualSense (PlayStation 5)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageProfessional;

