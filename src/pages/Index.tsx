
import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import { Product } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import Cart from '@/components/Cart';
import { CartItem, useCart } from '@/hooks/useCart';
import PremiumHeader from '@/components/Header/PremiumHeader';
import MobileHeader from '@/components/Header/MobileHeader';
import BottomNavigation from '@/components/Navigation/BottomNavigation';
import ResponsiveHeroBanner from '@/components/Hero/ResponsiveHeroBanner';
import ProductGrid from '@/components/Product/ProductGrid';
import ServiceCards from '@/components/ServiceCards';
import PremiumCategoryCard from '@/components/Category/PremiumCategoryCard';

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

  // Premium categories with clean, high-quality images
  const premiumCategories = [
    {
      id: 'playstation',
      name: 'PlayStation',
      description: 'PS5, PS4 e acessórios oficiais',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=600&fit=crop&auto=format&q=80',
      path: '/categoria/playstation'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      description: 'Series X|S, One e Game Pass',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=600&fit=crop&auto=format&q=80',
      path: '/categoria/xbox'
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      description: 'Switch, OLED e exclusivos',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=80',
      path: '/categoria/nintendo'
    },
    {
      id: 'pc',
      name: 'PC Gaming',
      description: 'Periféricos e componentes',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=600&fit=crop&auto=format&q=80',
      path: '/categoria/pc'
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Controles, headsets e mais',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=600&fit=crop&auto=format&q=80',
      path: '/categoria/acessorios'
    },
    {
      id: 'colecionaveis',
      name: 'Colecionáveis',
      description: 'Figuras, cards e edições especiais',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&auto=format&q=80',
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
      <section className="section-premium bg-uti-gray-50">
        <div className="container-premium">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: '🏪', title: 'Loja Física', desc: 'Colatina - ES', subtitle: 'Visite nossa loja' },
              { icon: '⚡', title: '+10 Anos', desc: 'De Tradição', subtitle: 'Experiência comprovada' },
              { icon: '🔧', title: 'Assistência', desc: 'Especializada', subtitle: 'Técnicos qualificados' },
              { icon: '💳', title: 'Parcelamento', desc: 'Em até 12x', subtitle: 'Sem juros no cartão' }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-6 animate-fade-in-premium" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-card-title mb-2">{benefit.title}</h3>
                <p className="text-body-secondary mb-1">{benefit.desc}</p>
                <p className="text-xs text-uti-gray-600">{benefit.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center mb-12 lg:mb-16 animate-fade-in-premium">
            <h2 className="text-section-title mb-6">
              Explore Nossa Coleção Premium
            </h2>
            <p className="text-body text-uti-gray-600 max-w-3xl mx-auto">
              Descubra os melhores produtos gaming com a qualidade e tradição que você já conhece
            </p>
          </div>

          <div className="grid-categories-premium">
            {premiumCategories.map((category, index) => (
              <PremiumCategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <ServiceCards />

      {/* Featured Products */}
      <section className="section-premium bg-uti-gray-50">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 lg:mb-16 animate-fade-in-premium">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-section-title mb-4">
                🔥 Produtos em Destaque
              </h2>
              <p className="text-body text-uti-gray-600">
                Os melhores produtos selecionados especialmente para você
              </p>
            </div>
            <button 
              onClick={() => navigate('/categoria/inicio')} 
              className="btn-secondary-premium"
            >
              Ver Todos os Produtos
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
        <section className="section-premium bg-white">
          <div className="container-premium">
            <div className="text-center mb-12 lg:mb-16 animate-fade-in-premium">
              <h2 className="text-section-title mb-6">
                ⚡ Novidades
              </h2>
              <p className="text-body text-uti-gray-600">
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
      <section className="section-premium bg-uti-gray-900 text-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-premium">
              <h2 className="text-section-title text-white mb-6">
                Loja Física em Colatina
              </h2>
              <p className="text-body text-white opacity-90 mb-8">
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
                <button className="btn-primary-premium">
                  Como Chegar
                </button>
                <button 
                  onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                  className="btn-secondary-premium border-white text-white hover:bg-white hover:text-uti-gray-900"
                >
                  WhatsApp: (27) 99688-2090
                </button>
              </div>
            </div>

            <div className="animate-fade-in-premium">
              <div className="card-premium overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&auto=format&q=80"
                  alt="Loja UTI dos Games"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-uti-black mb-2">UTI DOS GAMES</h3>
                  <p className="text-uti-gray-600">Colatina - Espírito Santo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="footer-premium py-16">
        <div className="container-premium">
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" alt="UTI DOS GAMES" className="h-12 w-12" />
                <div>
                  <h3 className="text-xl font-bold text-uti-red">UTI DOS GAMES</h3>
                  <p className="text-gray-300 text-sm">A vanguarda gamer de Colatina</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Mais de 10 anos oferecendo os melhores produtos em games para Colatina e região. 
                Tradição, qualidade e atendimento especializado.
              </p>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Categorias</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button onClick={() => navigate('/categoria/playstation')} className="hover:text-uti-red transition-colors">PlayStation</button></li>
                <li><button onClick={() => navigate('/categoria/xbox')} className="hover:text-uti-red transition-colors">Xbox</button></li>
                <li><button onClick={() => navigate('/categoria/nintendo')} className="hover:text-uti-red transition-colors">Nintendo</button></li>
                <li><button onClick={() => navigate('/categoria/pc')} className="hover:text-uti-red transition-colors">PC Gaming</button></li>
                <li><button onClick={() => navigate('/categoria/acessorios')} className="hover:text-uti-red transition-colors">Acessórios</button></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Serviços</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button className="hover:text-uti-red transition-colors">Assistência Técnica</button></li>
                <li><button className="hover:text-uti-red transition-colors">Avaliação de Produtos</button></li>
                <li><button className="hover:text-uti-red transition-colors">Trade-in</button></li>
                <li><button className="hover:text-uti-red transition-colors">Instalação</button></li>
                <li><button className="hover:text-uti-red transition-colors">Suporte</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Contato</h4>
              <ul className="space-y-2 text-sm text-gray-300">
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
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
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
