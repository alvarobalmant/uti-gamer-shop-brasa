
import React, { useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Loader2, Zap, Play, ChevronRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { useXbox4Data } from '@/hooks/useXbox4Data';
import HexagonParticles from '@/components/Xbox4/HexagonParticles';
import ProductCard from '@/components/Xbox4/ProductCard';
import NewsCard from '@/components/Xbox4/NewsCard';

const XboxPage4 = () => {
  const { consoles, games, accessories, deals, newsArticles, loading, error } = useXbox4Data();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Ref para o hero banner para efeito de parallax
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Transformações para efeito de parallax
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  
  // Dados de notícias e trailers (fallback)
  const defaultNewsAndTrailers = [
    {
      id: 1,
      type: 'trailer',
      title: 'Halo Infinite: Nova Temporada',
      description: 'Confira o trailer da nova temporada de Halo Infinite com novos mapas, armas e modos de jogo.',
      imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
      date: '3 dias atrás'
    },
    {
      id: 2,
      type: 'news',
      title: 'Xbox Game Pass: Novos Jogos de Junho',
      description: 'Microsoft anuncia a nova leva de jogos que chegam ao Xbox Game Pass em junho, incluindo títulos AAA e indies premiados.',
      imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop&crop=center',
      date: '1 semana atrás'
    },
    {
      id: 3,
      type: 'event',
      title: 'Xbox Showcase 2025: O que esperar',
      description: 'Confira nossa análise sobre o que esperar do próximo Xbox Showcase, com rumores de novos jogos e possíveis surpresas.',
      imageUrl: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=600&h=400&fit=crop&crop=center',
      date: '2 dias atrás'
    }
  ];

  // Dados de exemplo para fallback caso não haja produtos
  const fallbackProducts = {
    consoles: [
      {
        id: 'fallback-1',
        name: 'Xbox Series X',
        price: 3999.90,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
        isFeatured: true
      },
      {
        id: 'fallback-2',
        name: 'Xbox Series X - 1TB Digital Edition',
        price: 4599.90,
        originalPrice: 4899.90,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
        isNew: true
      }
    ],
    games: [
      {
        id: 'fallback-3',
        name: 'Halo Infinite',
        price: 299.90,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center'
      },
      {
        id: 'fallback-4',
        name: 'Forza Horizon 5',
        price: 249.90,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center'
      }
    ],
    accessories: [
      {
        id: 'fallback-5',
        name: 'Controle Xbox Series X Wireless',
        price: 499.90,
        imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop&crop=center'
      }
    ],
    deals: [
      {
        id: 'fallback-6',
        name: 'Xbox Game Pass Ultimate (3 meses)',
        price: 119.90,
        originalPrice: 149.90,
        discount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop&crop=center',
        isFeatured: true
      }
    ]
  };

  useEffect(() => {
    document.title = 'Xbox | UTI dos Games - Consoles, Jogos e Acessórios';
  }, []);
  
  // Usar produtos do banco ou fallback
  const displayProducts = {
    consoles: consoles.length > 0 ? consoles : fallbackProducts.consoles,
    games: games.length > 0 ? games : fallbackProducts.games,
    accessories: accessories.length > 0 ? accessories : fallbackProducts.accessories,
    deals: deals.length > 0 ? deals : fallbackProducts.deals
  };

  // Usar notícias do banco ou fallback
  const displayNews = newsArticles.length > 0 ? newsArticles : defaultNewsAndTrailers;

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/produto/${productId}`);
  };

  const handleCartOpen = () => {
    // Handle cart open logic
    console.log('Cart opened');
  };

  const handleAuthOpen = () => {
    // Handle auth open logic
    console.log('Auth opened');
  };

  // Mostrar loader apenas por um curto período inicial
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#107C10]" />
      </div>
    );
  }

  if (error) {
    console.warn('Erro ao carregar dados Xbox4:', error);
    // Continuar com dados fallback
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ProfessionalHeader onCartOpen={handleCartOpen} onAuthOpen={handleAuthOpen} />
      
      {/* Hero Banner */}
      <section 
        ref={heroRef}
        className="relative h-screen max-h-[800px] bg-black overflow-hidden flex items-center justify-center"
      >
        {/* Background com padrão de hexágonos e partículas */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1920&h=1080&fit=crop&crop=center')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            scale: heroScale,
            y: heroY
          }}
        />
        
        {/* Overlay com gradiente e padrão hexagonal */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        
        {/* Partículas hexagonais animadas */}
        <HexagonParticles />
        
        {/* Conteúdo do hero */}
        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" 
                alt="Xbox Logo" 
                className="h-24 mb-4"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-7xl font-black mb-6 leading-tight"
            >
              POWER YOUR <br />
              <span className="text-[#107C10] drop-shadow-[0_0_10px_rgba(16,124,16,0.5)]">DREAMS</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-xl"
            >
              Entre na próxima geração de jogos com Xbox Series X|S
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Button 
                size="lg" 
                className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
              >
                <Zap className="w-5 h-5 mr-2" />
                EXPLORAR CONSOLES
              </Button>
              <Button 
                size="lg" 
                className="bg-black/50 text-white border border-white hover:bg-[#107C10]/50 hover:text-white font-bold px-10 py-5 text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5 mr-2" />
                VER JOGOS
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Indicador de scroll */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-white/50 rotate-90" />
          </div>
        </motion.div>
      </section>

      {/* Seção de Consoles */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAwTDYwIDMwIDMwIDYwIDAgMzB6IiBmaWxsPSIjMTA3QzEwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4">
              CONSOLES <span className="text-[#107C10]">XBOX</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desempenho inigualável para a nova geração de jogos. 
              Escolha o console Xbox perfeito para sua experiência.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.consoles.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Xbox Games Section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAwTDYwIDMwIDMwIDYwIDAgMzB6IiBmaWxsPSIjMTA3QzEwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4">
              JOGOS <span className="text-[#107C10]">EM ALTA</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Os títulos mais populares para Xbox. De aventuras épicas a competições intensas, 
              encontre seu próximo jogo favorito.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayProducts.games.slice(0, 10).map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="game"
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
            >
              VER TODOS OS JOGOS <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Acessórios Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAwTDYwIDMwIDMwIDYwIDAgMzB6IiBmaWxsPSIjMTA3QzEwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4">
              <span className="text-[#107C10]">ACESSÓRIOS</span> XBOX
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Eleve sua experiência de jogo com acessórios oficiais Xbox. Controles, headsets e 
              muito mais para o seu setup.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayProducts.accessories.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="accessory"
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-transparent hover:bg-[#107C10] text-[#107C10] hover:text-white font-bold border-2 border-[#107C10] px-8 py-6 text-lg transition-all duration-300"
            >
              VER TODOS OS ACESSÓRIOS <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Notícias e Trailers Section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAwTDYwIDMwIDMwIDYwIDAgMzB6IiBmaWxsPSIjMTA3QzEwIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4">
              <span className="text-[#107C10]">NOTÍCIAS</span> & TRAILERS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades, lançamentos e atualizações do universo 
              Xbox.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayNews.map((item, index) => (
              <NewsCard 
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-transparent hover:bg-white text-white hover:text-black font-bold border-2 border-white px-8 py-6 text-lg transition-all duration-300"
            >
              VER TODAS AS NOTÍCIAS <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Ofertas Especiais Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#107C10]/20 via-black to-black"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-black mb-4">
              <span className="text-[#107C10]">OFERTAS</span> IMPERDÍVEIS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tempo limitado para aproveitar. Descontos especiais em produtos selecionados.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayProducts.deals.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                index={index}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="deal"
              />
            ))}
          </div>
        </div>
      </section>   

      {/* Footer CTA */}
      <section className="py-20 bg-black text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-5xl font-black mb-6">
              PRONTO PARA <span className="text-[#107C10]">JOGAR</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Explore nossa coleção completa de jogos, consoles e acessórios Xbox.
              Eleve sua experiência de jogo ao próximo nível.
            </p>
            
            <Button 
              size="lg" 
              className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
            >
              EXPLORAR MAIS
            </Button>
            
            <div className="mt-16 pt-16 border-t border-white/10 flex items-center justify-center">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" 
                  alt="Xbox Logo" 
                  className="h-10 mr-4" 
                />
                <span className="text-2xl font-bold">×</span>
                <span className="text-2xl font-bold ml-4">UTI DOS GAMES</span>
              </div>
              
              <p className="text-sm text-gray-400">
                © 2025 UTI dos Games. Todos os direitos reservados.
                Xbox é uma marca registrada da Microsoft Corporation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default XboxPage4;
