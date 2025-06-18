import React, { useEffect, useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Loader2, 
  ShoppingCart, 
  Gamepad2, 
  Zap, 
  Play,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { cn } from '@/lib/utils';
import NewsCard from '@/components/Xbox4/NewsCard';
import ProductCard from '@/components/Xbox4/ProductCard';

// Componente de partículas hexagonais para o hero banner
const HexagonParticles = () => {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 opacity-20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0c-0.89 0-1.78.05-2.67.16L0.94 8.78c-1.21.61-1.94 1.85-1.94 3.2v17.24c0 1.35.73 2.59 1.94 3.2l11.39 6.62c1.21.61 2.67.61 3.88 0l11.39-6.62c1.21-.61 1.94-1.85 1.94-3.2V11.98c0-1.35-.73-2.59-1.94-3.2L17.67.16C16.78.05 15.89 0 15 0z' fill='%23FFFFFF' fill-opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          initial={{
            scale: 0,
            rotate: 0,
            y: 0,
          }}
          animate={{
            scale: [0, 1, 0.8],
            rotate: [0, 90, 180],
            y: [0, -100, -200],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
};

const XboxPage6 = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState({
    consoles: [],
    games: [],
    accessories: [],
    deals: []
  });
  
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
  
  // IDs das tags do banco de dados - usando useMemo para evitar recriação a cada renderização
  const tagIds = React.useMemo(() => ({
    xbox: '28047409-2ad5-4cea-bde3-803d42e49fc6',
    accessories: '43f59a81-8dd1-460b-be1e-a0187e743075',
    console: '9e5a8e5c-7932-4c18-9c39-93c3a73f9cd0',
    games: 'b7c9b5a8-4c87-4c1f-8e8a-3d12b7e42e9a'
  }), []);
  
  // Dados de notícias e trailers
  const newsAndTrailers = [
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

  useEffect(() => {
    document.title = 'Xbox | UTI dos Games - Consoles, Jogos e Acessórios';
    
    if (products.length > 0) {
      // Filtrar produtos Xbox
      const xboxProducts = products.filter(product => 
        product.tags?.some(tag => tag.id === tagIds.xbox)
      );

      // Separar por categorias
      const consoles = xboxProducts.filter(product => 
        product.tags?.some(tag => tag.id === tagIds.console) ||
        product.name.toLowerCase().includes('xbox series') ||
        product.name.toLowerCase().includes('console')
      ).slice(0, 4);

      const games = xboxProducts.filter(product => 
        product.tags?.some(tag => tag.id === tagIds.games) ||
        (!product.tags?.some(tag => tag.id === tagIds.accessories) && 
         !product.name.toLowerCase().includes('console'))
      ).slice(0, 10);

      const accessories = xboxProducts.filter(product => 
        product.tags?.some(tag => tag.id === tagIds.accessories)
      ).slice(0, 3);

      const deals = xboxProducts.filter(product => 
        product.is_featured
      ).map(product => ({
        ...product,
        discount: Math.floor(Math.random() * 30) + 10, // Simulando descontos entre 10% e 40%
        originalPrice: product.price * (1 + (Math.floor(Math.random() * 30) + 10) / 100)
      })).slice(0, 4);

      setFilteredProducts({
        consoles,
        games,
        accessories,
        deals
      });
    }
  }, [products, tagIds]);

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

  // Dados de exemplo para fallback caso não haja produtos
  const fallbackProducts = {
    consoles: [
      {
        id: 'fallback-1',
        name: 'Xbox Series X',
        price: 3999.90,
        imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
        is_featured: true
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
        is_featured: true
      }
    ]
  };
  
  // Usar produtos do banco ou fallback
  const displayProducts = {
    consoles: filteredProducts.consoles.length > 0 ? filteredProducts.consoles : fallbackProducts.consoles,
    games: filteredProducts.games.length > 0 ? filteredProducts.games : fallbackProducts.games,
    accessories: filteredProducts.accessories.length > 0 ? filteredProducts.accessories : fallbackProducts.accessories,
    deals: filteredProducts.deals.length > 0 ? filteredProducts.deals : fallbackProducts.deals
  };
  
  // Mostrar loader apenas por um curto período inicial
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#107C10]" />
      </div>
    );
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
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#107C10]/80 via-[#0D5A0D]/60 to-black/90"></div>
        
        {/* Partículas hexagonais animadas */}
        <HexagonParticles />
        
        {/* Conteúdo do Hero */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex justify-center"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" 
                alt="Xbox Logo" 
                className="h-24 filter drop-shadow-[0_0_8px_rgba(16,124,16,0.8)]" 
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-none text-white drop-shadow-lg"
            >
              POWER YOUR <span className="text-[#107C10]">DREAMS</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-2xl md:text-3xl text-gray-200 leading-relaxed font-light"
            >
              Entre na próxima geração de jogos com Xbox Series X|S
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
            >
              <Button 
                size="lg" 
                className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-10 py-6 text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
                onClick={() => navigate("/categoria/consoles")}
              >
                <Zap className="w-6 h-6 mr-3" />
                EXPLORAR CONSOLES
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black font-bold px-10 py-6 text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/categoria/jogos")}
              >
                <Play className="w-6 h-6 mr-3" />
                VER JOGOS
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Xbox Consoles Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23107C10' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              CONSOLES <span className="text-[#107C10]">XBOX</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Desempenho inigualável para a nova geração de jogos. 
              Escolha o console Xbox perfeito para sua experiência.
            </p>
          </motion.div>

          <div className="pt-4 md:pt-0 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {displayProducts.consoles.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Xbox Games Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23107C10' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              JOGOS <span className="text-[#107C10]">EM ALTA</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Os títulos mais populares para Xbox. De aventuras épicas a competições intensas, 
              encontre seu próximo jogo favorito.
            </p>
          </motion.div>

          <div className="pt-4 md:pt-0 grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6 justify-items-center">
            {displayProducts.games.slice(0, 10).map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="game"
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
              onClick={() => navigate("/categoria/jogos")}
            >
              VER TODOS OS JOGOS
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Xbox Accessories Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23107C10' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-[#107C10]">ACESSÓRIOS</span> XBOX
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Eleve sua experiência de jogo com acessórios oficiais Xbox. 
              Controles, headsets e muito mais para o seu setup.
            </p>
          </motion.div>

          <div className="pt-4 md:pt-0 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 justify-items-center">
            {filteredProducts.accessories.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="accessory"
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              variant="outline"
              className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/categoria/acessorios")}
            >
              VER TODOS OS ACESSÓRIOS
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Notícias e Trailers Section */}
      <section className="py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 0c-1.25 0-2.5.06-3.75.19L1.31 17.59c-1.7.85-2.71 2.6-2.71 4.48v30.03c0 1.89 1.02 3.63 2.71 4.48l29.94 17.4c1.7.85 3.75.85 5.44 0l29.94-17.4c1.7-.85 2.71-2.6 2.71-4.48V22.07c0-1.89-1.02-3.63-2.71-4.48L38.75.19C37.5.06 36.25 0 35 0z' fill='%23107C10' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '70px 70px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-[#107C10]">NOTÍCIAS</span> & TRAILERS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades, lançamentos e atualizações do universo Xbox.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsAndTrailers.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              VER TODAS AS NOTÍCIAS
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Ofertas Especiais Section */}
      <section className="py-24 bg-[#107C10] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#107C10]/80 via-[#0D5A0D]/60 to-[#107C10]/90"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4 text-white">
              OFERTAS <span className="text-yellow-400">IMPERDÍVEIS</span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Tempo limitado para aproveitar. Descontos especiais em produtos selecionados.
            </p>
          </motion.div>

          <div className="pt-4 md:pt-0 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {displayProducts.deals.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="deal"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23107C10' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-black mb-6">
              PRONTO PARA <span className="text-[#107C10]">JOGAR</span>?
            </h2>
            
            <p className="text-xl text-gray-300 mb-10">
              Explore nossa coleção completa de jogos, consoles e acessórios Xbox.
              Eleve sua experiência de jogo ao próximo nível.
            </p>
            
            <Button 
              size="lg" 
              className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-12 py-6 text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
              onClick={() => navigate("/categoria/xbox")}
            >
              <Gamepad2 className="w-6 h-6 mr-3" />
              EXPLORAR MAIS
            </Button>
            
            <div className="mt-16 flex flex-col items-center">
              <div className="flex items-center mb-6">
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

export default XboxPage6;
