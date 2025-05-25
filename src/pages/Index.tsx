import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import { CartItem, useCart } from '@/hooks/useCart';
import PremiumHeader from '@/components/Header/PremiumHeader';
import MobileHeader from '@/components/Header/MobileHeader';
import BottomNavigation from '@/components/Navigation/BottomNavigation';
import ResponsiveHeroBanner from '@/components/Hero/ResponsiveHeroBanner';
import ProductGrid from '@/components/Product/ProductGrid';
import ServiceCards from '@/components/ServiceCards';

const Index = () => {
  const { products, loading } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const updateCartQuantity = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.product.id, item.size, item.color, newQuantity);
  };

  const sendToWhatsApp = () => {
    const itemsList = cart.map(item => `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`).join('\n');
    const total = getCartTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPlatformColor = (product: Product) => {
    const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
    
    if (tags.some(tag => tag.includes('playstation'))) {
      return 'bg-blue-600';
    }
    if (tags.some(tag => tag.includes('xbox'))) {
      return 'bg-green-600';
    }
    if (tags.some(tag => tag.includes('nintendo'))) {
      return 'bg-red-500';
    }
    if (tags.some(tag => tag.includes('pc'))) {
      return 'bg-orange-600';
    }
    return 'bg-gray-600';
  };

  const handleSearchSubmit = (query: string) => {
    navigate(`/busca?q=${encodeURIComponent(query)}`);
  };

  const featuredProducts = products.slice(0, 10);
  const newProducts = products.filter(p => p.tags?.some(tag => tag.name.toLowerCase().includes('novo'))).slice(0, 8);
  const bestSellers = products.filter(p => p.tags?.some(tag => tag.name.toLowerCase().includes('bestseller'))).slice(0, 8);

  // Premium categories with enhanced visuals
  const premiumCategories = [
    {
      id: 'playstation',
      name: 'PlayStation',
      description: 'PS5, PS4 e acessórios',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=400&h=300&fit=crop',
      gradient: 'from-blue-600 to-blue-800',
      path: '/categoria/playstation'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      description: 'Series X|S, One e GamePass',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&h=300&fit=crop',
      gradient: 'from-green-600 to-green-800',
      path: '/categoria/xbox'
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      description: 'Switch, OLED e Lite',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      gradient: 'from-red-500 to-red-700',
      path: '/categoria/nintendo'
    },
    {
      id: 'pc',
      name: 'PC Gaming',
      description: 'Periféricos e acessórios',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop',
      gradient: 'from-orange-600 to-orange-800',
      path: '/categoria/pc'
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Controles, fones e mais',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      gradient: 'from-purple-600 to-purple-800',
      path: '/categoria/acessorios'
    },
    {
      id: 'colecionaveis',
      name: 'Colecionáveis',
      description: 'Figuras, Cards e Edições Especiais',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      gradient: 'from-yellow-600 to-yellow-800',
      path: '/categoria/colecionaveis'
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-16 lg:pb-0">
      {/* Headers */}
      <PremiumHeader />
      <MobileHeader onSearchSubmit={handleSearchSubmit} />

      {/* Hero Banner */}
      <ResponsiveHeroBanner />

      {/* Premium Benefits Section */}
      <section className="py-8 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {[
              { icon: '🏪', title: 'Loja Física', desc: 'Colatina - ES' },
              { icon: '⚡', title: '+10 Anos', desc: 'De Tradição' },
              { icon: '🔧', title: 'Assistência', desc: 'Especializada' },
              { icon: '💳', title: 'Parcelamento', desc: 'Em até 12x' }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-4 lg:p-6 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-3xl lg:text-4xl mb-2 lg:mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-1">{benefit.title}</h3>
                <p className="text-xs lg:text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-16 animate-fade-in-up">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 lg:mb-6">
              Explore Nossa Coleção
            </h2>
            <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra os melhores produtos gaming com a qualidade e tradição que você já conhece
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
            {premiumCategories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => navigate(category.path)}
                className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-80`}></div>
                  <div className="absolute inset-0 p-3 lg:p-6 flex flex-col justify-end text-white">
                    <h3 className="text-sm lg:text-xl font-bold mb-1 lg:mb-2">{category.name}</h3>
                    <p className="text-xs lg:text-sm opacity-90 hidden lg:block">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <ServiceCards />

      {/* Featured Products */}
      <section className="py-8 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 lg:mb-12 animate-fade-in-up">
            <div className="mb-4 lg:mb-0">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
                🔥 Produtos em Destaque
              </h2>
              <p className="text-base lg:text-xl text-gray-600">
                Os melhores produtos selecionados especialmente para você
              </p>
            </div>
            <button 
              onClick={() => navigate('/categoria/inicio')} 
              className="text-red-600 hover:text-red-700 font-semibold text-sm lg:text-base"
            >
              Ver Todos →
            </button>
          </div>

          <ProductGrid
            products={featuredProducts}
            onAddToCart={(product, size, color) => addToCart(product, size, color)}
            getPlatformColor={getPlatformColor}
            loading={loading}
          />
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-8 lg:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 lg:mb-12 animate-fade-in-up">
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
                ⚡ Novidades
              </h2>
              <p className="text-base lg:text-xl text-gray-600">
                Os lançamentos mais recentes chegaram na UTI dos Games
              </p>
            </div>

            <ProductGrid
              products={newProducts}
              onAddToCart={(product, size, color) => addToCart(product, size, color)}
              getPlatformColor={getPlatformColor}
            />
          </div>
        </section>
      )}

      {/* Omnichannel Section */}
      <section className="section-padding bg-uti-dark text-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-section-title mb-6">
                Loja Física em Colatina
              </h2>
              <p className="text-body-large mb-8 text-white/90">
                Visite nossa loja física e experimente os produtos antes de comprar. 
                Mais de 10 anos servindo a comunidade gamer de Colatina e região.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-uti-red rounded-full"></div>
                  <span>Retirada grátis na loja</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-uti-red rounded-full"></div>
                  <span>Assistência técnica especializada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-uti-red rounded-full"></div>
                  <span>Avaliação e trade-in de produtos</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-primary">
                  Como Chegar
                </Button>
                <Button 
                  onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                  className="btn-ghost border-2 border-white/30 hover:bg-white/10"
                >
                  WhatsApp: (27) 99688-2090
                </Button>
              </div>
            </div>

            <div className="animate-fade-in-right">
              <div className="card-premium overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                  alt="Loja UTI dos Games"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-uti-dark mb-2">UTI DOS GAMES</h3>
                  <p className="text-uti-gray">Colatina - Espírito Santo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-uti-dark text-white py-16">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" alt="UTI DOS GAMES" className="h-12 w-12" />
                <div>
                  <h3 className="text-xl font-bold text-uti-red">UTI DOS GAMES</h3>
                  <p className="text-white/70 text-sm">A vanguarda gamer de Colatina</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Mais de 10 anos oferecendo os melhores produtos em games para Colatina e região. 
                Tradição, qualidade e atendimento especializado.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-uti-red transition-colors duration-300">
                  📱
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-uti-red transition-colors duration-300">
                  📧
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4 text-white">Categorias</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><button onClick={() => navigate('/categoria/playstation')} className="hover:text-uti-red transition-colors">PlayStation</button></li>
                <li><button onClick={() => navigate('/categoria/xbox')} className="hover:text-uti-red transition-colors">Xbox</button></li>
                <li><button onClick={() => navigate('/categoria/nintendo')} className="hover:text-uti-red transition-colors">Nintendo</button></li>
                <li><button onClick={() => navigate('/categoria/pc')} className="hover:text-uti-red transition-colors">PC Gaming</button></li>
                <li><button onClick={() => navigate('/categoria/acessorios')} className="hover:text-uti-red transition-colors">Acessórios</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold mb-4 text-white">Serviços</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><button className="hover:text-uti-red transition-colors">Assistência Técnica</button></li>
                <li><button className="hover:text-uti-red transition-colors">Avaliação de Produtos</button></li>
                <li><button className="hover:text-uti-red transition-colors">Trade-in</button></li>
                <li><button className="hover:text-uti-red transition-colors">Instalação</button></li>
                <li><button className="hover:text-uti-red transition-colors">Suporte</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4 text-white">Contato</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>(27) 99688-2090</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>contato@utidosgames.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>🕒</span>
                  <span>Seg à Sex: 9h às 18h</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Colatina - ES</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2024 UTI DOS GAMES. Todos os direitos reservados. Desenvolvido com ❤️ em Colatina.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Cart Component */}
      <Cart
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateCartQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
