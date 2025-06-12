import React, { useEffect, useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client'; // Importar o cliente Supabase
import {
  Loader2,
  ShoppingCart,
  Star,
  Gamepad2,
  Zap,
  Trophy,
  Play,
  Tag,
  Clock,
  ChevronRight,
  Heart,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProfessionalHeader from '@/components/Header/ProfessionalHeader';
import { cn } from '@/lib/utils';

// Tipagem para a configuração da página Xbox4
interface Xbox4Config {
  hero_banner: {
    title: string;
    subtitle: string;
    background_image: string;
    primary_button_text: string;
    secondary_button_text: string;
  };
  featured_products: {
    title: string;
    subtitle: string;
    product_tags: string[];
    max_products: number;
  };
  games_section: {
    title: string;
    subtitle: string;
    product_tags: string[];
    max_products: number;
  };
  accessories_section: {
    title: string;
    subtitle: string;
    product_tags: string[];
    max_products: number;
  };
  news_section: {
    title: string;
    subtitle: string;
    news_items: Array<{
      title: string;
      description: string;
      image: string;
      type: 'trailer' | 'news' | 'event';
      url?: string;
    }>;
  };
}

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
            backgroundImage: `url("data:image/svg+xml,%3Csvg width=\'30\' height=\'30\' viewBox=\'0 0 30 30\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M15 0c-0.89 0-1.78.05-2.67.16L0.94 8.78c-1.21.61-1.94 1.85-1.94 3.2v17.24c0 1.35.73 2.59 1.94 3.2l11.39 6.62c1.21.61 2.67.61 3.88 0l11.39-6.62c1.21-.61 1.94-1.85 1.94-3.2V11.98c0-1.35-.73-2.59-1.94-3.2L17.67.16C16.78.05 15.89 0 15 0z\' fill=\'%23FFFFFF\' fill-opacity=\'1\'%3E%3C/path%3E%3C/svg%3E")`,
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

// Componente de card de produto com microinterações avançadas
const ProductCard = ({ product, onAddToCart, onProductClick, variant = "default", index = 0 }) => {
  const isGame = variant === "game";
  const isAccessory = variant === "accessory";
  const isDeal = variant === "deal";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.03, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.03,
        rotateY: 2,
        rotateX: 1,
        boxShadow: "0 0 30px -5px rgba(16, 124, 16, 0.8), 0 0 15px -8px rgba(16, 124, 16, 0.6)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      className={cn(
        "group relative bg-gray-900 rounded-xl overflow-hidden border border-transparent cursor-pointer",
        "transform-gpu will-change-transform", // GPU optimization
        isGame ? "aspect-[2/3]" : "aspect-square",
        isDeal ? "bg-gradient-to-br from-[#107C10]/20 via-black to-black" : ""
      )}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <div className={cn(
        "overflow-hidden",
        isGame ? "h-full" : "aspect-square"
      )}>
        <motion.img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&h=600&fit=crop&crop=center'} 
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.08,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>
      
      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {product.isFeatured && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg">
              DESTAQUE
            </Badge>
          </motion.div>
        )}
        {product.isNew && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className="bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg">
              NOVO
            </Badge>
          </motion.div>
        )}
        {isDeal && product.discount && (
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1 }}
            className="bg-yellow-500 text-black font-bold text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1"
          >
            <Tag size={12} />
            {product.discount}% OFF
          </motion.div>
        )}
      </div>
      
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent",
        isGame ? "pb-3 pt-16" : "p-6"
      )}>
        <motion.h3 
          className={cn(
            "font-bold mb-2 text-white line-clamp-2 transition-colors duration-150",
            isGame ? "text-sm" : "text-lg"
          )}
          whileHover={{ 
            color: "#107C10",
            transition: { duration: 0.15 }
          }}
        >
          {product.name}
        </motion.h3>
        
        <div className={cn(
          "flex items-center justify-between mb-3",
          isGame ? "mb-2" : "mb-4"
        )}>
          <motion.div 
            className="text-xl font-black text-[#107C10]"
            whileHover={{ 
              scale: 1.05,
              textShadow: "0 0 8px rgba(16, 124, 16, 0.8)",
              transition: { duration: 0.15 }
            }}
          >
            R$ {product.price?.toFixed(2)}
          </motion.div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-sm text-gray-400 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </div>
          )}
        </div>
        
        <div className={cn(
          "flex gap-2",
          isGame ? "justify-center" : "justify-between"
        )}>
          {isGame ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <Button 
                size="sm"
                className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-150 shadow-lg hover:shadow-[0_0_20px_rgba(16,124,16,0.6)]"
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ADICIONAR
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="flex-1"
              >
                <Button 
                  className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-150 shadow-lg hover:shadow-[0_0_20px_rgba(16,124,16,0.6)]"
                  onClick={() => onAddToCart(product)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  COMPRAR
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Button 
                  variant="outline" 
                  size="icon"
                  className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-150 hover:shadow-[0_0_15px_rgba(16,124,16,0.5)]"
                  onClick={() => onProductClick(product.id)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Componente de card de notícia/trailer
const NewsCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -15, scale: 0.98 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.02,
        rotateY: 1,
        boxShadow: "0 0 25px -5px rgba(16, 124, 16, 0.7), 0 0 12px -8px rgba(16, 124, 16, 0.5)",
        borderColor: "#107C10",
        transition: { 
          duration: 0.15, 
          ease: "easeOut" 
        }
      }}
      className="group relative bg-black rounded-xl overflow-hidden border border-transparent cursor-pointer transform-gpu will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        perspective: "800px"
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <motion.img 
          src={item.image} // Alterado de item.imageUrl para item.image para corresponder à config do banco
          alt={item.title}
          className="w-full h-full object-cover"
          whileHover={{ 
            scale: 1.06,
            transition: { duration: 0.2, ease: "easeOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        
        {item.type === 'trailer' && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            whileHover={{ 
              scale: 1.15,
              transition: { duration: 0.15, ease: "easeOut" }
            }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-[#107C10]/80 flex items-center justify-center"
              whileHover={{
                backgroundColor: "rgba(16, 124, 16, 1)",
                boxShadow: "0 0 20px rgba(16, 124, 16, 0.8)",
                transition: { duration: 0.15 }
              }}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.div>
          </motion.div>
        )}
        
        <div className="absolute top-3 left-3 z-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.15 }}
          >
            <Badge className={cn(
              "text-xs font-bold px-3 py-1 rounded-full shadow-md",
              item.type === 'trailer' ? "bg-[#107C10] text-white" : 
              item.type === 'news' ? "bg-yellow-500 text-black" : 
              "bg-blue-500 text-white"
            )}>
              {item.type === 'trailer' ? 'TRAILER' : 
               item.type === 'news' ? 'NOVIDADE' : 'EVENTO'}
            </Badge>
          </motion.div>
        </div>
      </div>
      
      <div className="p-5">
        <motion.h3 
          className="font-bold text-lg mb-2 transition-colors duration-150"
          whileHover={{ 
            color: "#107C10",
            transition: { duration: 0.15 }
          }}
        >
          {item.title}
        </motion.h3>
        
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {/* A data pode ser adicionada ao section_config se necessário */}
            {/* {item.date} */}
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Button 
              variant="ghost" 
              size="sm"
              className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors duration-150 hover:shadow-[0_0_15px_rgba(16,124,16,0.5)]"
              onClick={() => item.url && window.open(item.url, '_blank')}
            >
              {item.type === 'trailer' ? 'Assistir' : 'Ler mais'}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const XboxPage4 = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [pageConfig, setPageConfig] = useState<Xbox4Config | null>(null); // Estado para a configuração da página
  const [pageLoading, setPageLoading] = useState(true); // Estado de carregamento da página

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
    xbox: 'xbox',
    accessories: 'acessorio',
    console: 'console',
    games: 'jogo' // Ajustado para corresponder às tags usadas no painel admin
  }), []);
  
  // Dados de notícias e trailers - serão substituídos pelos dados do banco
  const defaultNewsAndTrailers = [
    {
      id: 1,
      type: 'trailer',
      title: 'Halo Infinite: Nova Temporada',
      description: 'Confira o trailer da nova temporada de Halo Infinite com novos mapas, armas e modos de jogo.',
      image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center',
      // date: '3 dias atrás'
    },
    {
      id: 2,
      type: 'news',
      title: 'Xbox Game Pass: Novos Jogos de Junho',
      description: 'Microsoft anuncia a nova leva de jogos que chegam ao Xbox Game Pass em junho, incluindo títulos AAA e indies premiados.',
      image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop&crop=center',
      // date: '1 semana atrás'
    },
    {
      id: 3,
      type: 'event',
      title: 'Xbox Showcase 2025: O que esperar',
      description: 'Confira nossa análise sobre o que esperar do próximo Xbox Showcase, com rumores de novos jogos e possíveis surpresas.',
      image: 'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=600&h=400&fit=crop&crop=center',
      // date: '2 dias atrás'
    }
  ];

  useEffect(() => {
    document.title = 'Xbox | UTI dos Games - Consoles, Jogos e Acessórios';
    
    const fetchPageConfig = async () => {
      setPageLoading(true);
      try {
        // Primeiro, obter o page_id (UUID) da página 'xbox4' da tabela 'pages'
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'xbox4')
          .single();

        if (pageError) throw pageError;

        if (pageData) {
          const xbox4PageId = pageData.id;

          // Em seguida, buscar todas as seções para este page_id na tabela 'page_layout_items'
          const { data: sectionsData, error: sectionsError } = await supabase
            .from('page_layout_items')
            .select('*')
            .eq('page_id', xbox4PageId)
            .order('display_order');

          if (sectionsError) throw sectionsError;

          if (sectionsData && sectionsData.length > 0) {
            const newConfig: Partial<Xbox4Config> = {}; // Usar Partial para construir gradualmente

            sectionsData.forEach(section => {
              if (section.is_visible) { // Considerar apenas seções visíveis
                switch (section.section_key) {
                  case 'xbox4_hero_banner':
                    newConfig.hero_banner = section.section_config;
                    break;
                  case 'xbox4_featured_products':
                    newConfig.featured_products = section.section_config;
                    break;
                  case 'xbox4_games_section':
                    newConfig.games_section = section.section_config;
                    break;
                  case 'xbox4_accessories_section':
                    newConfig.accessories_section = section.section_config;
                    break;
                  case 'xbox4_news_section':
                    newConfig.news_section = section.section_config;
                    break;
                  default:
                    break;
                }
              }
            });
            setPageConfig(newConfig as Xbox4Config); // Converter para Xbox4Config após construção
          } else {
            // Se não houver dados no banco, usar a configuração padrão (hardcoded)
            setPageConfig({
              hero_banner: {
                title: 'POWER YOUR DREAMS',
                subtitle: 'Entre na próxima geração de jogos com Xbox Series X|S',
                background_image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1920&h=1080&fit=crop&crop=center',
                primary_button_text: 'EXPLORAR CONSOLES',
                secondary_button_text: 'VER JOGOS'
              },
              featured_products: {
                title: 'CONSOLES XBOX',
                subtitle: 'Desempenho inigualável para a nova geração de jogos. Escolha o console Xbox perfeito para sua experiência.',
                product_tags: ['xbox', 'console'],
                max_products: 2
              },
              games_section: {
                title: 'JOGOS EM ALTA',
                subtitle: 'Os títulos mais populares para Xbox. De aventuras épicas a competições intensas, encontre seu próximo jogo favorito.',
                product_tags: ['xbox', 'jogo'],
                max_products: 3
              },
              accessories_section: {
                title: 'ACESSÓRIOS XBOX',
                subtitle: 'Eleve sua experiência de jogo com acessórios oficiais Xbox. Controles, headsets e muito mais para o seu setup.',
                product_tags: ['xbox', 'acessorio'],
                max_products: 1
              },
              news_section: {
                title: 'NOTÍCIAS & TRAILERS',
                subtitle: 'Fique por dentro das últimas novidades, lançamentos e atualizações do universo Xbox.',
                news_items: defaultNewsAndTrailers // Usar defaultNewsAndTrailers como fallback
              }
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações da página Xbox4:', error);
        // Em caso de erro, usar a configuração padrão (hardcoded)
        setPageConfig({
          hero_banner: {
            title: 'POWER YOUR DREAMS',
            subtitle: 'Entre na próxima geração de jogos com Xbox Series X|S',
            background_image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1920&h=1080&fit=crop&crop=center',
            primary_button_text: 'EXPLORAR CONSOLES',
            secondary_button_text: 'VER JOGOS'
          },
          featured_products: {
            title: 'CONSOLES XBOX',
            subtitle: 'Desempenho inigualável para a nova geração de jogos. Escolha o console Xbox perfeito para sua experiência.',
            product_tags: ['xbox', 'console'],
            max_products: 2
          },
          games_section: {
            title: 'JOGOS EM ALTA',
            subtitle: 'Os títulos mais populares para Xbox. De aventuras épicas a competições intensas, encontre seu próximo jogo favorito.',
            product_tags: ['xbox', 'jogo'],
            max_products: 3
          },
          accessories_section: {
            title: 'ACESSÓRIOS XBOX',
            subtitle: 'Eleve sua experiência de jogo com acessórios oficiais Xbox. Controles, headsets e muito mais para o seu setup.',
            product_tags: ['xbox', 'acessorio'],
            max_products: 1
          },
          news_section: {
            title: 'NOTÍCIAS & TRAILERS',
            subtitle: 'Fique por dentro das últimas novidades, lançamentos e atualizações do universo Xbox.',
            news_items: defaultNewsAndTrailers // Usar defaultNewsAndTrailers como fallback
          }
        });
      } finally {
        setPageLoading(false);
      }
    };

    fetchPageConfig();
  }, []);

  // Se a página ainda estiver carregando a configuração, exiba um loader
  if (pageLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-[#107C10]" />
      </div>
    );
  }

  // Usar pageConfig para renderizar o conteúdo
  const heroBanner = pageConfig?.hero_banner;
  const featuredProductsSection = pageConfig?.featured_products;
  const gamesSection = pageConfig?.games_section;
  const accessoriesSection = pageConfig?.accessories_section;
  const newsSection = pageConfig?.news_section;

  // Filtrar produtos com base nas tags e limites definidos na configuração
  useEffect(() => {
    if (products.length > 0 && pageConfig) {
      const filterAndSliceProducts = (productTags: string[], maxProducts: number) => {
        if (!productTags || productTags.length === 0) return [];
        return products.filter(product => 
          product.tags?.some(tag => productTags.includes(tag.name.toLowerCase()))
        ).slice(0, maxProducts);
      };

      setFilteredProducts({
        consoles: filterAndSliceProducts(featuredProductsSection?.product_tags || [], featuredProductsSection?.max_products || 0),
        games: filterAndSliceProducts(gamesSection?.product_tags || [], gamesSection?.max_products || 0),
        accessories: filterAndSliceProducts(accessoriesSection?.product_tags || [], accessoriesSection?.max_products || 0),
        deals: products.filter(product => product.isOnSale || product.isFeatured).map(product => ({ ...product, discount: Math.floor(Math.random() * 20) + 10 })).slice(0, 4) // Manter deals como antes
      });
    }
  }, [products, pageConfig]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Adicionar toast ou feedback visual
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <ProfessionalHeader />

      {/* Hero Banner Section */}
      {heroBanner && (
        <section 
          ref={heroRef} 
          className="relative h-[70vh] flex items-center justify-center text-center overflow-hidden"
          style={{
            backgroundImage: `url(${heroBanner.background_image || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1920&h=1080&fit=crop&crop=center'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <HexagonParticles />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"
            style={{ opacity: heroOpacity }}
          ></motion.div>
          <motion.div 
            className="relative z-20 p-4"
            style={{ scale: heroScale, y: heroY }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
              {heroBanner.title}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#107C10] mb-8 drop-shadow-md">
              {heroBanner.subtitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#107C10]/30"
              >
                <Zap className="w-5 h-5 mr-2" />
                {heroBanner.primary_button_text}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/50 bg-black/30 text-white hover:bg-[#107C10] hover:text-white hover:border-[#107C10] font-bold px-8 py-6 text-lg transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                {heroBanner.secondary_button_text}
              </Button>
            </div>
          </motion.div>
          
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
      )}

      {/* Featured Products Section (Consoles) */}
      {featuredProductsSection && filteredProducts.consoles.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-black">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {featuredProductsSection.title}
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            {featuredProductsSection.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.consoles.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                onProductClick={handleProductClick}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {/* Games Section */}
      {gamesSection && filteredProducts.games.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gray-950">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {gamesSection.title}
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            {gamesSection.subtitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredProducts.games.map((product, index) => (
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
        </section>
      )}

      {/* Accessories Section */}
      {accessoriesSection && filteredProducts.accessories.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-black">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {accessoriesSection.title}
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            {accessoriesSection.subtitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </section>
      )}

      {/* News & Trailers Section */}
      {newsSection && newsSection.news_items && newsSection.news_items.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gray-950">
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            {newsSection.title}
          </h2>
          <p className="text-xl text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            {newsSection.subtitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsSection.news_items.map((item, index) => (
              <NewsCard key={index} item={item} index={index} />
            ))}
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2025 UTI dos Games. Todos os direitos reservados. Xbox é uma marca registrada da Microsoft Corporation.</p>
      </footer>
    </div>
  );
};

export default XboxPage4;
Microsoft Corporation.</p>
      </footer>
    </div>
  );
};

export default XboxPage4;


