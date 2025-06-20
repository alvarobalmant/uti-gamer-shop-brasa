import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2, Zap, Play, Star, ShoppingCart, Gamepad2, Headphones, Camera, Trophy, Users, Download, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import Cart from '@/components/Cart';
import { AuthModal } from '@/components/Auth/AuthModal';

// Componente de cartão de produto otimizado para PlayStation V5
const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/produto/${productId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-full border border-gray-100 w-full min-w-0"
      onClick={() => handleProductClick(product.id)}
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 aspect-[4/5]">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.discount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            -{product.discount}%
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#00CC66] to-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            NOVO
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            DESTAQUE
          </div>
        )}
        {product.isExclusive && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#8B5CF6] to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            EXCLUSIVO
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-6 flex flex-col justify-between flex-grow">
        <div className="min-h-[80px] mb-4">
          <h3 className="font-medium text-gray-900 text-sm md:text-base leading-tight tracking-tight line-clamp-2 mb-3">{product.name}</h3>
          {product.rating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg md:text-2xl font-bold text-[#003791]">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && (
                <div className="text-xs md:text-sm text-gray-500 line-through font-medium">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full font-medium">
              {product.category}
            </span>
          </div>
          
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className="w-full bg-gradient-to-r from-[#003791] to-[#0070CC] hover:from-[#0070CC] hover:to-[#003791] text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm md:text-base"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const PlayStationPageProfessionalV5 = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Ref para o hero banner para efeito de parallax
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Transformações para efeito de parallax
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Dados dos produtos PlayStation com maior variedade
  const playstationProducts = {
    consoles: [
      {
        id: 'ps5-console',
        name: 'PlayStation 5',
        price: 4199.99,
        originalPrice: 4699.99,
        discount: 11,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=750&fit=crop&crop=center',
        isFeatured: true,
        category: 'Console'
      },
      {
        id: 'ps5-digital',
        name: 'PlayStation 5 Digital Edition',
        price: 3599.99,
        originalPrice: 3999.99,
        discount: 10,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?w=600&h=750&fit=crop&crop=center',
        category: 'Console'
      },
      {
        id: 'ps4-pro',
        name: 'PlayStation 4 Pro',
        price: 2499.99,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=750&fit=crop&crop=center',
        category: 'Console'
      }
    ],
    exclusives: [
      {
        id: 'spiderman-2',
        name: 'Marvel\'s Spider-Man 2',
        price: 349.99,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=750&fit=crop&crop=center',
        category: 'Jogo',
        isNew: true,
        isExclusive: true
      },
      {
        id: 'god-of-war',
        name: 'God of War Ragnarök',
        price: 299.99,
        originalPrice: 349.99,
        discount: 14,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600&h=750&fit=crop&crop=center',
        category: 'Jogo',
        isExclusive: true
      },
      {
        id: 'horizon',
        name: 'Horizon Forbidden West',
        price: 249.99,
        originalPrice: 299.99,
        discount: 17,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=750&fit=crop&crop=center',
        category: 'Jogo',
        isExclusive: true
      },
      {
        id: 'tlou',
        name: 'The Last of Us Part II',
        price: 199.99,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=750&fit=crop&crop=center',
        category: 'Jogo',
        isExclusive: true
      }
    ],
    accessories: [
      {
        id: 'dualsense',
        name: 'Controle DualSense',
        price: 449.99,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=750&fit=crop&crop=center',
        category: 'Acessório',
        isNew: true
      },
      {
        id: 'pulse-3d',
        name: 'Headset PULSE 3D',
        price: 599.99,
        originalPrice: 699.99,
        discount: 14,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop&crop=center',
        category: 'Acessório'
      },
      {
        id: 'hd-camera',
        name: 'HD Camera',
        price: 299.99,
        rating: 4.5,
        imageUrl: 'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=600&h=750&fit=crop&crop=center',
        category: 'Acessório'
      }
    ]
  };

  useEffect(() => {
    document.title = 'PlayStation | UTI dos Games - Consoles, Jogos e Acessórios';
    // Simular carregamento mais realista
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCartOpen = () => {
    setShowCart(true);
  };

  const handleAuthOpen = () => {
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#003791] via-[#0070CC] to-[#003791] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-lg font-light tracking-tight">Carregando experiência PlayStation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProfessionalHeader onCartOpen={handleCartOpen} onAuthOpen={handleAuthOpen} />
      
      {/* Hero Banner - Inspirado na PlayStation Store */}
      <section 
        ref={heroRef}
        className="relative min-h-screen bg-gradient-to-br from-[#003791] via-[#0070CC] to-[#003791] overflow-hidden flex items-center justify-center"
      >
        {/* Elementos visuais de fundo com símbolos PlayStation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            style={{ y: heroY }}
            className="absolute top-20 left-10 text-white/5 text-8xl animate-pulse font-bold"
          >
            ○
          </motion.div>
          <motion.div 
            style={{ y: heroY }}
            className="absolute top-40 right-20 text-white/5 text-12xl animate-bounce font-bold"
          >
            □
          </motion.div>
          <motion.div 
            style={{ y: heroY }}
            className="absolute bottom-32 left-20 text-white/5 text-10xl animate-pulse font-bold"
          >
            △
          </motion.div>
          <motion.div 
            style={{ y: heroY }}
            className="absolute bottom-20 right-10 text-white/5 text-8xl animate-bounce font-bold"
          >
            ✕
          </motion.div>
          
          {/* Gradientes adicionais para profundidade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
        </div>
        
        {/* Conteúdo do hero */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-6 relative z-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-6xl text-center text-white"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-8xl font-light mb-6 md:mb-8 leading-tight tracking-tight"
            >
              PLAY HAS NO <br />
              <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent font-medium">
                LIMITS
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 md:mb-12 max-w-4xl mx-auto font-light tracking-tight leading-relaxed px-4"
            >
              Experimente o carregamento ultrarrápido, imersão mais profunda e uma nova 
              geração de jogos incríveis no PlayStation 5. O futuro dos games está aqui.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black hover:from-yellow-500 hover:to-[#FFD700] font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Zap className="w-6 h-6 mr-3" />
                EXPLORAR PS5
              </Button>
              <Button 
                size="lg" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#003791] font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-2xl transition-all duration-300 shadow-xl"
              >
                <Play className="w-6 h-6 mr-3" />
                VER JOGOS
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* PlayStation 5 Consoles */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight">
              PlayStation<span className="text-[#003791] font-medium">®5</span> Consoles
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto font-light tracking-tight leading-relaxed px-4">
              O console PS5™ libera novas possibilidades de jogo que você nunca imaginou. 
              Experimente carregamento ultrarrápido, imersão mais profunda e uma nova geração de jogos incríveis.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {playstationProducts.consoles.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Exclusivos PlayStation */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-[#003791] to-gray-900 text-white relative overflow-hidden">
        {/* Efeitos de fundo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/3 text-9xl font-bold">
            PlayStation
          </div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 tracking-tight">
              Exclusivos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">PlayStation</span>
            </h2>
            <p className="text-lg md:text-xl text-blue-200 max-w-4xl mx-auto font-light tracking-tight leading-relaxed px-4">
              Descubra os jogos que definem uma geração, disponíveis apenas no ecossistema PlayStation. 
              Experiências únicas que só você pode viver aqui.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {playstationProducts.exclusives.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Acessórios PlayStation */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight">
              Acessórios <span className="text-[#003791] font-medium">Oficiais</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto font-light tracking-tight leading-relaxed px-4">
              Construa sua configuração de jogo perfeita com controles, headsets e outros acessórios 
              oficiais para seu console PS5™. Qualidade e performance garantidas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {playstationProducts.accessories.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PlayStation Plus */}
      <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-br from-[#003791] to-[#0070CC] text-white relative overflow-hidden">
        {/* Efeitos visuais */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8 tracking-tight">
                PlayStation <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent font-medium">Plus</span>
              </h2>
              <p className="text-lg md:text-xl mb-6 md:mb-8 font-light tracking-tight leading-relaxed">
                Aproveite centenas de jogos de PS5, PS4 e clássicos, modo multijogador online, 
                descontos exclusivos e benefícios imperdíveis com três planos de grande valor.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black hover:from-yellow-500 hover:to-[#FFD700] font-bold px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <Trophy className="w-6 h-6 mr-3" />
                ASSINAR AGORA
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">
                    <Gamepad2 className="w-16 h-16 mx-auto text-yellow-300" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6">Benefícios Exclusivos</h3>
                </div>
                <ul className="space-y-4 text-lg">
                  <li className="flex items-center">
                    <Download className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    Jogos mensais gratuitos
                  </li>
                  <li className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    Multijogador online
                  </li>
                  <li className="flex items-center">
                    <Trophy className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    Descontos exclusivos
                  </li>
                  <li className="flex items-center">
                    <Cloud className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0" />
                    Armazenamento na nuvem
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-gray-400 text-sm md:text-base">© 2025 UTI dos Games. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Modais */}
      <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default PlayStationPageProfessionalV5;

