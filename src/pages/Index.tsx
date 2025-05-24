
import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  sizes: string[];
  colors: string[];
  platform: string;
}

interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: "God of War Ragnarök",
    description: "Embarque na jornada épica de Kratos e Atreus em Midgard!",
    price: 149.90,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "PS5"
  },
  {
    id: 2,
    name: "Controle DualSense",
    description: "Controle wireless oficial PlayStation 5 com feedback háptico",
    price: 399.90,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Branco", "Preto", "Azul", "Rosa"],
    platform: "PS5"
  },
  {
    id: 3,
    name: "Mario Kart 8 Deluxe",
    description: "O melhor jogo de corrida com os personagens da Nintendo!",
    price: 299.90,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "Nintendo Switch"
  },
  {
    id: 4,
    name: "Halo Infinite",
    description: "A maior aventura do Master Chief em mundo aberto!",
    price: 199.90,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "Xbox Series X"
  },
  {
    id: 5,
    name: "Headset Gamer RGB",
    description: "Som surround 7.1 com iluminação RGB customizável",
    price: 249.90,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Preto", "Branco", "Verde"],
    platform: "Multi"
  },
  {
    id: 6,
    name: "The Last of Us Part II",
    description: "Continue a jornada emocional de Ellie neste exclusivo PS4/PS5",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "PS4/PS5"
  }
];

const Index = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItem = cart.find(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item === existingItem
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, size, color, quantity: 1 }]);
    }
  };

  const updateQuantity = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      setCart(cart.filter(cartItem => cartItem !== item));
    } else {
      setCart(cart.map(cartItem =>
        cartItem === item
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const sendToWhatsApp = () => {
    const itemsList = cart.map(item => 
      `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = getTotalPrice();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ps5':
      case 'ps4/ps5':
        return 'bg-blue-600';
      case 'xbox series x':
        return 'bg-green-600';
      case 'nintendo switch':
        return 'bg-red-600';
      default:
        return 'bg-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-green-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">U</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                UTI DOS GAMES
              </h1>
              <p className="text-xs text-gray-400">Sua loja gamer de confiança</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowCart(!showCart)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Meu Pedido ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </Button>
        </div>
      </header>

      {/* Banner Promocional */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-3 animate-pulse">
        <p className="font-semibold">🔥 FRETE GRÁTIS para compras acima de R$ 200,00! 🔥</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            CATÁLOGO GAMER
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Os melhores jogos e acessórios para sua setup!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {mockProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              getPlatformColor={getPlatformColor}
            />
          ))}
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowCart(false)}>
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-green-500/20 p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Meu Pedido</h3>
                <Button variant="ghost" onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white">
                  ✕
                </Button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Seu carrinho está vazio
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item, index) => (
                      <div key={index} className="bg-gray-800 p-4 rounded-lg">
                        <h4 className="text-white font-semibold">{item.product.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {item.size}{item.color ? `, ${item.color}` : ''}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, -1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-white font-semibold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item, 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-green-400 font-semibold">
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-white">Total:</span>
                      <span className="text-2xl font-bold text-green-400">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={sendToWhatsApp}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Finalizar no WhatsApp 📱
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, getPlatformColor }: {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string) => void;
  getPlatformColor: (platform: string) => string;
}) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/10 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="relative mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className={`absolute top-2 right-2 ${getPlatformColor(product.platform)} text-white font-semibold`}>
            {product.platform}
          </Badge>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{product.description}</p>

        <div className="space-y-4">
          {/* Sizes */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              {product.sizes[0] === 'Físico' ? 'Formato:' : 'Tamanho:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                  className={`${
                    selectedSize === size 
                      ? 'bg-green-500 text-white' 
                      : 'border-gray-600 text-gray-300 hover:border-green-500'
                  }`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Cor:</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`${
                      selectedColor === color 
                        ? 'bg-purple-500 text-white' 
                        : 'border-gray-600 text-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <span className="text-2xl font-bold text-green-400">
              R$ {product.price.toFixed(2)}
            </span>
            <Button
              onClick={() => onAddToCart(product, selectedSize, selectedColor)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
            >
              Adicionar ao Pedido
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Index;
