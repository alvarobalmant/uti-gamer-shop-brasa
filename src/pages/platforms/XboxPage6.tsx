import React, { useEffect, useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  ShoppingCart, 
  Star, 
  Gamepad2, 
  Zap, 
  Trophy, 
  Play,
  ChevronRight,
  Clock,
  Tag,
  Heart,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';

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

// Componente de card de produto otimizado para mobile
const ProductCard = ({ product, onAddToCart, onProductClick, variant = "default" }) => {
  const isGame = variant === "game";
  const isAccessory = variant === "accessory";
  const isDeal = variant === "deal";
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 8px 25px -8px rgba(16, 124, 16, 0.3)",
        borderColor: "#107C10"
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut"
      }}
      className={cn(
        "group relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-200 border border-transparent flex-shrink-0",
        "snap-start mr-3", // Para scroll horizontal
        // Mobile: tamanhos otimizados para carrossel
        "w-40 md:w-auto", // Mobile: largura fixa pequena, Desktop: auto
        isGame ? "aspect-[2/3] md:aspect-[2/3]" : "aspect-square",
        isDeal ? "bg-gradient-to-br from-[#107C10]/20 via-black to-black" : "",
        // Mobile: área de toque adequada
        "active:scale-95 md:active:scale-100"
      )}
    >
      <div className={cn(
        "overflow-hidden",
        isGame ? "h-full" : "aspect-square"
      )}>
        <motion.img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Badges - Mobile otimizado */}
      <div className="absolute top-1 left-1 md:top-2 md:left-2 flex flex-col gap-1">
        {product.is_featured && (
          <Badge className="bg-yellow-500 text-black font-bold text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow-lg">
            DESTAQUE
          </Badge>
        )}
        {product.isNew && (
          <Badge className="bg-red-500 text-white font-bold text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow-lg">
            NOVO
          </Badge>
        )}
        {isDeal && product.discount && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-yellow-500 text-black font-bold text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <Tag size={8} className="md:w-3 md:h-3" />
            {product.discount}% OFF
          </motion.div>
        )}
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent",
        // Mobile: padding reduzido e otimizado
        "p-2 md:p-3 pt-8 md:pt-12"
      )}>
        <h3 className={cn(
          "font-bold text-white group-hover:text-[#107C10] transition-colors line-clamp-2 leading-tight",
          // Mobile: texto muito menor e legível
          "text-xs md:text-sm mb-1"
        )}>
          {product.name}
        </h3>
        
        <div className={cn(
          "flex items-center justify-between mb-1 md:mb-2"
        )}>
          <div className={cn(
            "font-black text-[#107C10]",
            // Mobile: preço compacto mas legível
            "text-sm md:text-lg"
          )}>
            R$ {product.price?.toFixed(2)}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className={cn(
              "text-gray-400 line-through text-xs md:text-sm"
            )}>
              R$ {product.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex gap-1",
          isGame ? "justify-center" : "justify-between"
        )}>
          {isGame ? (
            <Button 
              size="sm"
              className={cn(
                "w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-200",
                "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
                // Mobile: botão muito compacto
                "h-8 md:h-9 text-xs px-2 md:px-4 rounded-md",
                "active:scale-95"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              ADD
            </Button>
          ) : (
            <>
              <Button 
                className={cn(
                  "flex-1 bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-200",
                  "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
                  // Mobile: botão compacto
                  "h-8 md:h-9 text-xs px-2 md:px-4 rounded-md",
                  "active:scale-95"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                COMPRAR
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className={cn(
                  "border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-200",
                  "transform hover:scale-110",
                  // Mobile: ícone compacto
                  "w-8 h-8 md:w-9 md:h-9 rounded-md",
                  "active:scale-95"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(product.id);
                }}
              >
                <Heart className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de card de notícia otimizado para mobile
const NewsCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 8px 25px -8px rgba(16, 124, 16, 0.3)",
        borderColor: "#107C10"
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={cn(
        "group relative bg-black rounded-lg overflow-hidden transition-all duration-200",
        "border border-transparent hover:border-[#107C10] flex-shrink-0",
        "snap-start mr-3", // Para scroll horizontal
        // Mobile: largura otimizada para carrossel
        "w-64 md:w-auto", // Mobile: largura fixa, Desktop: auto
        "active:scale-95 md:active:scale-100"
      )}
    >
      <div className="aspect-video overflow-hidden relative">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        
        {item.type === 'trailer' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={cn(
                "rounded-full bg-[#107C10]/80 flex items-center justify-center",
                "transform group-hover:scale-110 transition-transform duration-300",
                // Mobile: play button menor
                "w-10 h-10 md:w-12 md:h-12"
              )}
            >
              <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" />
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="p-3 md:p-4">
        <Badge className={cn(
          "mb-2 font-bold text-xs",
          item.type === 'trailer' ? "bg-[#107C10] text-white" : 
          item.type === 'news' ? "bg-yellow-500 text-black" : 
          "bg-blue-500 text-white"
        )}>
          {item.type === 'trailer' ? 'TRAILER' : item.type === 'news' ? 'NOVIDADE' : 'EVENTO'}
        </Badge>
        
        <h3 className={cn(
          "font-bold mb-2 group-hover:text-[#107C10] transition-colors line-clamp-2 leading-tight",
          // Mobile: título compacto
          "text-sm md:text-lg"
        )}>
          {item.title}
        </h3>
        
        <p className={cn(
          "text-gray-400 mb-3 line-clamp-2",
          // Mobile: descrição menor
          "text-xs md:text-sm"
        )}>
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-gray-500 flex items-center text-xs"
          )}>
            <Clock className="w-3 h-3 mr-1" />
            {item.date}
          </span>
          
          <Button 
            variant="ghost" 
            size="sm"
            className={cn(
              "text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors",
              // Mobile: botão compacto
              "h-8 px-3 text-xs rounded-md",
              "active:scale-95"
            )}
          >
            {item.type === 'trailer' ? 'Assistir' : 'Ler mais'}
          </Button>
        </div>
      </div>
    </motion.div>
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <ProfessionalHeader onCartOpen={handleCartOpen} onAuthOpen={handleAuthOpen} />
      
      {/* Hero Banner - Mobile otimizado */}
      <section 
        ref={heroRef}
        className={cn(
          "relative bg-black overflow-hidden flex items-center justify-center",
          // Mobile: altura muito reduzida, Desktop: mantém original
          "h-[50vh] md:h-screen md:max-h-[800px]"
        )}
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
        
        {/* Partículas hexagonais animadas - apenas desktop */}
        <div className="hidden md:block">
          <HexagonParticles />
        </div>
        
        {/* Conteúdo do Hero - Mobile muito compacto */}
        <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <motion.div
            style={{ opacity: heroOpacity }}
            className="max-w-4xl mx-auto space-y-3 md:space-y-8"
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
                className={cn(
                  "filter drop-shadow-[0_0_8px_rgba(16,124,16,0.8)]",
                  // Mobile: logo muito menor, Desktop: mantém original
                  "h-8 md:h-24"
                )} 
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={cn(
                "font-extrabold tracking-tighter leading-none text-white drop-shadow-lg",
                // Mobile: título muito compacto, Desktop: mantém original
                "text-xl md:text-7xl lg:text-8xl"
              )}
            >
              POWER YOUR <span className="text-[#107C10]">DREAMS</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className={cn(
                "text-gray-200 leading-relaxed font-light",
                // Mobile: texto muito menor, Desktop: mantém original
                "text-sm md:text-2xl lg:text-3xl"
              )}
            >
              Entre na próxima geração de jogos com Xbox Series X|S
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className={cn(
                "flex gap-2 md:gap-4 justify-center pt-2 md:pt-4",
                // Mobile: stack vertical, Desktop: horizontal
                "flex-col sm:flex-row"
              )}
            >
              <Button 
                size="sm" 
                className={cn(
                  "bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
                  "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
                  // Mobile: botão muito compacto, Desktop: mantém original
                  "h-10 px-4 text-sm md:px-10 md:py-6 md:text-xl md:h-auto",
                  "active:scale-95 md:active:scale-100"
                )}
                onClick={() => navigate("/categoria/consoles")}
              >
                <Zap className="w-4 h-4 mr-2 md:w-6 md:h-6 md:mr-3" />
                EXPLORAR CONSOLES
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className={cn(
                  "border-white text-white hover:bg-white hover:text-black font-bold transition-all duration-300 shadow-lg hover:shadow-xl",
                  // Mobile: botão compacto
                  "h-10 px-4 text-sm md:px-10 md:py-6 md:text-xl md:h-auto",
                  "active:scale-95 md:active:scale-100"
                )}
                onClick={() => navigate("/categoria/jogos")}
              >
                <Play className="w-4 h-4 mr-2 md:w-6 md:h-6 md:mr-3" />
                VER JOGOS
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator - apenas desktop */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
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

      {/* Xbox Consoles Section - Mobile otimizado */}
      <section className={cn(
        "bg-black relative overflow-hidden",
        // Mobile: padding muito reduzido, Desktop: mantém original
        "py-8 md:py-24"
      )}>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={cn(
              "text-center",
              // Mobile: margem muito reduzida, Desktop: mantém original
              "mb-4 md:mb-16"
            )}
          >
            <h2 className={cn(
              "font-black mb-2",
              // Mobile: título muito menor
              "text-lg md:text-5xl leading-tight"
            )}>
              CONSOLES <span className="text-[#107C10]">XBOX</span>
            </h2>
            <p className={cn(
              "text-gray-300 max-w-3xl mx-auto",
              // Mobile: texto menor
              "text-sm md:text-xl"
            )}>
              Desempenho inigualável para a nova geração de jogos
            </p>
          </motion.div>

          {/* Mobile: Carrossel horizontal, Desktop: Grid */}
          <div className={cn(
            // Mobile: scroll horizontal
            "md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-4",
            // Mobile: carrossel configurado
            "flex md:block overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 md:pb-0",
            "scrollbar-hide" // Esconder scrollbar no mobile
          )}>
            {displayProducts.consoles.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Xbox Games Section - Mobile otimizado */}
      <section className={cn(
        "bg-gray-900 relative overflow-hidden",
        "py-8 md:py-24"
      )}>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-16"
          >
            <h2 className="text-lg md:text-5xl font-black mb-2 leading-tight">
              JOGOS <span className="text-[#107C10]">EM ALTA</span>
            </h2>
            <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto">
              Os títulos mais populares para Xbox
            </p>
          </motion.div>

          {/* Mobile: Carrossel horizontal, Desktop: Grid */}
          <div className={cn(
            // Mobile: scroll horizontal
            "md:grid md:gap-6 md:grid-cols-3 lg:grid-cols-5",
            // Mobile: carrossel configurado
            "flex md:block overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 md:pb-0",
            "scrollbar-hide" // Esconder scrollbar no mobile
          )}>
            {displayProducts.games.slice(0, 10).map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="game"
                index={index}
              />
            ))}
          </div>
          
          <div className="mt-6 md:mt-12 text-center">
            <Button 
              size="sm" 
              className={cn(
                "bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
                "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
                // Mobile: botão compacto
                "h-10 px-4 text-sm md:px-8 md:py-4 md:text-lg md:h-auto",
                "active:scale-95 md:active:scale-100"
              )}
              onClick={() => navigate("/categoria/jogos")}
            >
              VER TODOS OS JOGOS
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Xbox Accessories Section - Mobile otimizado */}
      <section className={cn(
        "bg-black relative overflow-hidden",
        "py-8 md:py-24"
      )}>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-16"
          >
            <h2 className="text-lg md:text-5xl font-black mb-2 leading-tight">
              <span className="text-[#107C10]">ACESSÓRIOS</span> XBOX
            </h2>
            <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto">
              Eleve sua experiência de jogo com acessórios oficiais Xbox
            </p>
          </motion.div>

          {/* Mobile: Carrossel horizontal, Desktop: Grid */}
          <div className={cn(
            // Mobile: scroll horizontal
            "md:grid md:gap-8 md:grid-cols-3",
            // Mobile: carrossel configurado
            "flex md:block overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 md:pb-0",
            "scrollbar-hide" // Esconder scrollbar no mobile
          )}>
            {filteredProducts.accessories.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="accessory"
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Notícias e Trailers Section - Mobile otimizado */}
      <section className={cn(
        "bg-gray-900 relative overflow-hidden",
        "py-8 md:py-24"
      )}>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-4 md:mb-16"
          >
            <h2 className="text-lg md:text-5xl font-black mb-2 leading-tight">
              <span className="text-[#107C10]">NOTÍCIAS</span> & TRAILERS
            </h2>
            <p className="text-sm md:text-xl text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades do universo Xbox
            </p>
          </motion.div>

          {/* Mobile: Carrossel horizontal, Desktop: Grid */}
          <div className={cn(
            // Mobile: scroll horizontal
            "md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-3",
            // Mobile: carrossel configurado
            "flex md:block overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 md:pb-0",
            "scrollbar-hide" // Esconder scrollbar no mobile
          )}>
            {newsAndTrailers.map((item, index) => (
              <NewsCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas Especiais Section - Mobile otimizado */}
      <section className={cn(
        "bg-[#107C10] relative overflow-hidden",
        "py-8 md:py-24"
      )}>
        {/* Fundo com textura sutil */}
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
            className="text-center mb-4 md:mb-16"
          >
            <h2 className="text-lg md:text-5xl font-black mb-2 text-white leading-tight">
              OFERTAS <span className="text-yellow-400">IMPERDÍVEIS</span>
            </h2>
            <p className="text-sm md:text-xl text-white/90 max-w-3xl mx-auto">
              Tempo limitado para aproveitar. Descontos especiais em produtos selecionados.
            </p>
          </motion.div>

          {/* Mobile: Carrossel horizontal, Desktop: Grid */}
          <div className={cn(
            // Mobile: scroll horizontal
            "md:grid md:gap-8 md:grid-cols-2 lg:grid-cols-4",
            // Mobile: carrossel configurado
            "flex md:block overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 md:pb-0",
            "scrollbar-hide" // Esconder scrollbar no mobile
          )}>
            {displayProducts.deals.map((product, index) => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                variant="deal"
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA - Mobile otimizado */}
      <section className={cn(
        "bg-black relative overflow-hidden",
        "py-8 md:py-24"
      )}>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-lg md:text-5xl font-black mb-3 md:mb-6 leading-tight">
              PRONTO PARA <span className="text-[#107C10]">JOGAR</span>?
            </h2>
            
            <p className="text-sm md:text-xl text-gray-300 mb-4 md:mb-10">
              Explore nossa coleção completa de jogos, consoles e acessórios Xbox.
            </p>
            
            <Button 
              size="sm" 
              className={cn(
                "bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300",
                "transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30",
                "h-10 px-6 text-sm md:px-12 md:py-6 md:text-xl md:h-auto",
                "active:scale-95 md:active:scale-100"
              )}
              onClick={() => navigate("/categoria/xbox")}
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              EXPLORAR MAIS
            </Button>
            
            <div className="mt-8 md:mt-16 flex flex-col items-center">
              <div className="flex items-center mb-4 md:mb-6">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg" 
                  alt="Xbox Logo" 
                  className="h-8 md:h-10 mr-3 md:mr-4" 
                />
                <span className="text-xl md:text-2xl font-bold">×</span>
                <span className="text-xl md:text-2xl font-bold ml-3 md:ml-4">UTI DOS GAMES</span>
              </div>
              
              <p className="text-xs md:text-sm text-gray-400 text-center">
                © 2025 UTI dos Games. Todos os direitos reservados.
                Xbox é uma marca registrada da Microsoft Corporation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Refinado */}
      <Footer />
    </div>
  );
};

export default XboxPage6;
