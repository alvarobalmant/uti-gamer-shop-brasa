
import { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { AuthModal } from '@/components/Auth/AuthModal';
import { Product } from '@/components/ProductCard';
import Cart from '@/components/Cart';
import { CartItem, useCart } from '@/hooks/useCart';
import UltraPremiumHeader from '@/components/Header/UltraPremiumHeader';
import PremiumHeroBanner from '@/components/Hero/PremiumHeroBanner';
import PremiumProductCard from '@/components/Product/PremiumProductCard';

const Index = () => {
  const { products, loading } = useProducts();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, getCartTotal, getCartItemsCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const updateCartQuantity = (item: CartItem, change: number) => {
    const newQuantity = item.quantity + change;
    updateQuantity(item.product.id, item.size, item.color, newQuantity);
  };

  const sendToWhatsApp = () => {
    const itemsList = cart.map(item => 
      `• ${item.product.name} (${item.size || 'Padrão'}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
    ).join('\n');
    const total = getCartTotal();
    const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*`;
    const whatsappUrl = `https://wa.me/5527996882090?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPlatformColor = (product: Product) => {
    const tags = product.tags?.map(tag => tag.name.toLowerCase()) || [];
    
    if (tags.some(tag => tag.includes('playstation'))) {
      return 'playstation';
    }
    if (tags.some(tag => tag.includes('xbox'))) {
      return 'xbox';
    }
    if (tags.some(tag => tag.includes('nintendo'))) {
      return 'nintendo';
    }
    if (tags.some(tag => tag.includes('pc'))) {
      return 'pc-gaming';
    }
    return 'uti-blue';
  };

  const handleAuthClick = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
  };

  const featuredProducts = products.slice(0, 10);
  const newProducts = products.filter(p => 
    p.tags?.some(tag => tag.name.toLowerCase().includes('novo'))
  ).slice(0, 8);
  const bestSellers = products.filter(p => 
    p.tags?.some(tag => tag.name.toLowerCase().includes('bestseller'))
  ).slice(0, 8);
  const onSaleProducts = products.filter(p => 
    p.tags?.some(tag => tag.name.toLowerCase().includes('promoção'))
  ).slice(0, 8);

  // Premium categories with enhanced visuals
  const premiumCategories = [
    {
      id: 'playstation',
      name: 'PlayStation',
      description: 'PS5, PS4 e Acessórios',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop',
      gradient: 'gradient-playstation',
      textColor: 'text-white',
      path: '/categoria/playstation'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      description: 'Series X|S, One e GamePass',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop',
      gradient: 'gradient-xbox',
      textColor: 'text-white',
      path: '/categoria/xbox'
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      description: 'Switch, OLED e Lite',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      gradient: 'gradient-nintendo',
      textColor: 'text-white',
      path: '/categoria/nintendo'
    },
    {
      id: 'pc',
      name: 'PC Gaming',
      description: 'Periféricos e Componentes',
      image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=600&h=400&fit=crop',
      gradient: 'bg-pc-gaming',
      textColor: 'text-white',
      path: '/categoria/pc'
    },
    {
      id: 'acessorios',
      name: 'Acessórios',
      description: 'Controles, Fones e Mais',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
      gradient: 'bg-accessories',
      textColor: 'text-white',
      path: '/categoria/acessorios'
    },
    {
      id: 'colecionaveis',
      name: 'Colecionáveis',
      description: 'Figuras, Cards e Edições',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
      gradient: 'bg-warning',
      textColor: 'text-white',
      path: '/categoria/colecionaveis'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra Premium Header */}
      <UltraPremiumHeader 
        onCartClick={() => setShowCart(true)}
        onAuthClick={handleAuthClick}
      />

      {/* Premium Hero Banner */}
      <PremiumHeroBanner />

      {/* Trust Indicators Section */}
      <section className="section-premium bg-gray-system-50">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { 
                icon: '🏪', 
                title: 'Loja Física', 
                desc: 'Colatina - ES',
                highlight: 'Visite nossa loja'
              },
              { 
                icon: '⚡', 
                title: '+10 Anos', 
                desc: 'De Tradição',
                highlight: 'Experiência comprovada'
              },
              { 
                icon: '🔧', 
                title: 'Assistência', 
                desc: 'Especializada',
                highlight: 'Suporte técnico'
              },
              { 
                icon: '💳', 
                title: 'Parcelamento', 
                desc: 'Em até 12x',
                highlight: 'Sem juros'
              }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="text-center p-6 bg-white rounded-card shadow-level-1 hover:shadow-level-2 transition-all duration-300 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-h4 font-semibold text-uti-black mb-2">{benefit.title}</h3>
                <p className="text-body-secondary mb-1">{benefit.desc}</p>
                <p className="text-xs text-uti-red font-medium">{benefit.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Categories */}
      <section className="section-premium bg-white">
        <div className="container-premium">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-section-title text-uti-black mb-4">
              Explore Nossa Coleção Premium
            </h2>
            <p className="text-body-primary text-gray-system-600 max-w-3xl mx-auto">
              Descubra os melhores produtos gaming com a qualidade e tradição que você já conhece
            </p>
          </div>

          <div className="grid-categories">
            {premiumCategories.map((category, index) => (
              <div
                key={category.id}
                onClick={() => navigate(category.path)}
                className="card-category animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-card">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image w-full h-full object-cover transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${category.gradient} opacity-80`}></div>
                  <div className={`absolute inset-0 p-6 flex flex-col justify-end ${category.textColor}`}>
                    <h3 className="text-h3 font-bold mb-2 text-shadow-strong">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-premium bg-gray-system-50">
        <div className="container-premium">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12 animate-fade-in-up">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-section-title text-uti-black mb-4">
                🔥 Produtos em Destaque
              </h2>
              <p className="text-body-primary text-gray-system-600">
                Os melhores produtos selecionados especialmente para você
              </p>
            </div>
            <button 
              onClick={() => navigate('/categoria/destaques')} 
              className="btn-secondary"
            >
              Ver Todos os Produtos
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-uti-red border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <div className="text-h3 text-gray-system-500 font-medium">Carregando produtos premium...</div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🎮</div>
              <div className="text-h2 text-gray-system-500 mb-4">
                Nenhum produto disponível
              </div>
              <p className="text-body-secondary">
                Produtos serão adicionados em breve
              </p>
            </div>
          ) : (
            <div className="grid-products">
              {featuredProducts.map((product, index) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                  priority={index < 6}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="section-premium bg-white">
          <div className="container-premium">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-section-title text-uti-black mb-4">
                ⚡ Novidades
              </h2>
              <p className="text-body-primary text-gray-system-600">
                Os lançamentos mais recentes chegaram na UTI dos Games
              </p>
            </div>

            <div className="grid-products">
              {newProducts.map((product) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section-premium bg-gray-system-50">
          <div className="container-premium">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-section-title text-uti-black mb-4">
                🏆 Mais Vendidos
              </h2>
              <p className="text-body-primary text-gray-system-600">
                Os produtos favoritos dos nossos clientes
              </p>
            </div>

            <div className="grid-products">
              {bestSellers.map((product) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sale Products */}
      {onSaleProducts.length > 0 && (
        <section className="section-premium bg-white">
          <div className="container-premium">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-section-title text-uti-black mb-4">
                💥 Promoções Imperdíveis
              </h2>
              <p className="text-body-primary text-gray-system-600">
                Ofertas especiais com descontos incríveis
              </p>
            </div>

            <div className="grid-products">
              {onSaleProducts.map((product) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(product, size, color) => addToCart(product, size, color)}
                  getPlatformColor={() => getPlatformColor(product)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Omnichannel Section */}
      <section className="section-premium bg-uti-blue text-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-section-title mb-6 text-white">
                Loja Física em Colatina
              </h2>
              <p className="text-body-primary mb-8 text-white/90">
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
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-uti-red rounded-full"></div>
                  <span>Atendimento personalizado</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary bg-uti-red hover:bg-uti-red-600">
                  Como Chegar
                </button>
                <button 
                  onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                  className="btn-secondary border-white text-white hover:bg-white hover:text-uti-blue"
                >
                  WhatsApp: (27) 99688-2090
                </button>
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
                  <h3 className="text-h3 font-bold text-uti-black mb-2">UTI DOS GAMES</h3>
                  <p className="text-body-secondary">Colatina - Espírito Santo</p>
                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-warning text-lg">★</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-system-500">4.9/5 (127 avaliações)</span>
                  </div>
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
                <img 
                  src="/lovable-uploads/a514a032-d79a-4bc4-a10e-3c9f0f9cde73.png" 
                  alt="UTI DOS GAMES" 
                  className="h-12 w-12 rounded-lg"
                />
                <div>
                  <h3 className="text-h3 font-bold text-uti-red">UTI DOS GAMES</h3>
                  <p className="text-white/70 text-sm">A vanguarda gamer de Colatina</p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Mais de 10 anos oferecendo os melhores produtos em games para Colatina e região. 
                Tradição, qualidade e atendimento especializado.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-uti-red transition-colors duration-300 cursor-pointer">
                  📱
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-uti-red transition-colors duration-300 cursor-pointer">
                  📧
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-uti-red transition-colors duration-300 cursor-pointer">
                  📍
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold mb-4 text-white text-h4">Categorias</h4>
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
              <h4 className="font-bold mb-4 text-white text-h4">Serviços</h4>
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
              <h4 className="font-bold mb-4 text-white text-h4">Contato</h4>
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

      {/* Cart Component */}
      <Cart
        cart={cart}
        showCart={showCart}
        setShowCart={setShowCart}
        updateQuantity={updateCartQuantity}
        sendToWhatsApp={sendToWhatsApp}
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
