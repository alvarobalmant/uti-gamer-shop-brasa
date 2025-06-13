import React, { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, Star, Gamepad2, Zap, Trophy, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const XboxPage5 = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState({
    consoles: [],
    games: [],
    accessories: [],
    deals: []
  });

  // IDs das tags do banco de dados
  const tagIds = {
    xbox: '28047409-2ad5-4cea-bde3-803d42e49fc6',
    accessories: '43f59a81-8dd1-460b-be1e-a0187e743075',
    console: '9e5a8e5c-7932-4c18-9c39-93c3a73f9cd0', // ID real para consoles
    games: 'b7c9b5a8-4c87-4c1f-8e8a-3d12b7e42e9a' // ID real para jogos
  };

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
      ).slice(0, 8);

      const accessories = xboxProducts.filter(product => 
        product.tags?.some(tag => tag.id === tagIds.accessories)
      ).slice(0, 6);

      const deals = xboxProducts.filter(product => 
        product.isOnSale || product.isFeatured
      ).slice(0, 6);

      setFilteredProducts({
        consoles,
        games,
        accessories,
        deals
      });
    }
  }, [products]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleProductClick = (productId) => {
    navigate(`/produto/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#107C10]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative h-[70vh] bg-black overflow-hidden flex items-center justify-center">
        {/* Background com padrão de hexágonos e partículas sutis */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M49.93 0c-1.78 0-3.56.09-5.34.27L1.87 25.13c-2.42 1.21-3.87 3.7-3.87 6.4v42.94c0 2.7 1.45 5.19 3.87 6.4l42.72 24.86c2.42 1.21 5.34 1.21 7.76 0l42.72-24.86c2.42-1.21 3.87-3.7 3.87-6.4V31.53c0-2.7-1.45-5.19-3.87-6.4L55.27.27C53.49.09 51.71 0 49.93 0z" fill="%23107C10" fill-opacity="0.1"/%3E%3C/svg%3E')`, backgroundSize: '200px 200px' }}></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#107C10]/80 via-[#0D5A0D]/80 to-black/80"></div>
        
        {/* Imagem do Xbox com efeito de profundidade */}
        <motion.img 
          src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=800&fit=crop&crop=center" 
          alt="Xbox Series X|S" 
          className="absolute inset-0 w-full h-full object-cover z-20 opacity-30"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <div className="relative z-30 container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-none text-white drop-shadow-lg"
            >
              <span className="text-[#107C10]">XBOX</span> EXPERIENCE
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-gray-200 leading-relaxed font-light"
            >
              Mergulhe na próxima geração de jogos. Velocidade, performance e imersão sem precedentes.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center pt-4"
            >
              <Button 
                size="lg" 
                className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/categoria/consoles")}
              >
                <Zap className="w-6 h-6 mr-3" />
                EXPLORAR CONSOLES
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black font-bold px-10 py-5 text-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/categoria/jogos")}
              >
                <Play className="w-6 h-6 mr-3" />
                VER JOGOS
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Xbox Consoles Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M49.93 0c-1.78 0-3.56.09-5.34.27L1.87 25.13c-2.42 1.21-3.87 3.7-3.87 6.4v42.94c0 2.7 1.45 5.19 3.87 6.4l42.72 24.86c2.42 1.21 5.34 1.21 7.76 0l42.72-24.86c2.42-1.21 3.87-3.7 3.87-6.4V31.53c0-2.7-1.45-5.19-3.87-6.4L55.27.27C53.49.09 51.71 0 49.93 0z\" fill=\"%23107C10\" fill-opacity=\"0.05\"/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-[#107C10]">XBOX</span> CONSOLES
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Escolha o console Xbox perfeito para sua experiência de jogo. 
              Potência, velocidade e compatibilidade com milhares de jogos.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.consoles.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop&crop=center'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {product.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-400 text-black font-bold text-sm px-3 py-1 rounded-full shadow-md">
                    DESTAQUE
                  </Badge>
                )}
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#107C10] transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-black text-[#107C10]">
                      R$ {product.price?.toFixed(2)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-400 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      COMPRAR
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-300 transform hover:scale-110"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Xbox Games Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M49.93 0c-1.78 0-3.56.09-5.34.27L1.87 25.13c-2.42 1.21-3.87 3.7-3.87 6.4v42.94c0 2.7 1.45 5.19 3.87 6.4l42.72 24.86c2.42 1.21 5.34 1.21 7.76 0l42.72-24.86c2.42-1.21 3.87-3.7 3.87-6.4V31.53c0-2.7-1.45-5.19-3.87-6.4L55.27.27C53.49.09 51.71 0 49.93 0z\" fill=\"%23107C10\" fill-opacity=\"0.05\"/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              JOGOS <span className="text-[#107C10]">EM ALTA</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubra os melhores jogos Xbox. De aventuras épicas a competições intensas, 
              encontre seu próximo jogo favorito.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.games.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=300&h=400&fit=crop&crop=center'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {product.isNew && (
                  <Badge className="absolute top-3 left-3 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full shadow-md">
                    NOVO
                  </Badge>
                )}
                
                <div className="p-4">
                  <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-[#107C10] transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="text-lg font-black text-[#107C10] mb-3">
                    R$ {product.price?.toFixed(2)}
                  </div>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleAddToCart(product)}
                  >
                    ADICIONAR
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Xbox Accessories Section */}
      <section className="py-20 bg-black relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M49.93 0c-1.78 0-3.56.09-5.34.27L1.87 25.13c-2.42 1.21-3.87 3.7-3.87 6.4v42.94c0 2.7 1.45 5.19 3.87 6.4l42.72 24.86c2.42 1.21 5.34 1.21 7.76 0l42.72-24.86c2.42-1.21 3.87-3.7 3.87-6.4V31.53c0-2.7-1.45-5.19-3.87-6.4L55.27.27C53.49.09 51.71 0 49.93 0z\" fill=\"%23107C10\" fill-opacity=\"0.05\"/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-[#107C10]">ACESSÓRIOS</span> XBOX
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aprimore sua experiência de jogo com acessórios oficiais Xbox. 
              Controles, headsets e muito mais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.accessories.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop&crop=center'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-[#107C10] transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="text-2xl font-black text-[#107C10] mb-4">
                    R$ {product.price?.toFixed(2)}
                  </div>
                  
                  <Button 
                    className="w-full bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    COMPRAR AGORA
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Ofertas Especiais Section */}
      <section className="py-20 bg-[#107C10] relative overflow-hidden">
        {/* Fundo com textura sutil ou gradiente */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0c-1.07 0-2.14.05-3.2.16L1.13 15.07c-1.45.73-2.33 2.22-2.33 3.84v25.74c0 1.62.87 3.11 2.33 3.84l25.67 14.91c1.45.73 3.2.73 4.66 0l25.67-14.91c1.45-.73 2.33-2.22 2.33-3.84V18.91c0-1.62-.87-3.11-2.33-3.84L33.2.16C32.14.05 31.07 0 30 0z' fill='%23FFFFFF' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#107C10]/80 via-[#0D5A0D]/60 to-[#107C10]/90"></div>
        <div className="absolute inset-0 z-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M49.93 0c-1.78 0-3.56.09-5.34.27L1.87 25.13c-2.42 1.21-3.87 3.7-3.87 6.4v42.94c0 2.7 1.45 5.19 3.87 6.4l42.72 24.86c2.42 1.21 5.34 1.21 7.76 0l42.72-24.86c2.42-1.21 3.87-3.7 3.87-6.4V31.53c0-2.7-1.45-5.19-3.87-6.4L55.27.27C53.49.09 51.71 0 49.93 0z\" fill=\"%23107C10\" fill-opacity=\"0.05\"/%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4 text-white">
              <Trophy className="inline-block w-12 h-12 mr-4 text-[#107C10]" />
              OFERTAS <span className="text-[#107C10]">IMPERDÍVEIS</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Aproveite as melhores ofertas Xbox. Preços especiais por tempo limitado!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.deals.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop&crop=center'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {product.isFeatured && (
                  <Badge className="absolute top-4 left-4 bg-yellow-400 text-black font-bold text-sm px-3 py-1 rounded-full shadow-md">
                    OFERTA
                  </Badge>
                )}
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-black text-[#107C10]">
                      R$ {product.price?.toFixed(2)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-400 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold transition-all duration-300 transform hover:scale-105"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      COMPRAR
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white transition-all duration-300 transform hover:scale-110"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Notícias e Trailers */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Fundo com textura sutil */}
        <div className="absolute inset-0 z-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M35 0c-1.25 0-2.5.06-3.75.19L1.31 17.59c-1.7.85-2.71 2.6-2.71 4.48v30.03c0 1.89 1.02 3.63 2.71 4.48l29.94 17.4c1.7.85 3.75.85 5.44 0l29.94-17.4c1.7-.85 2.71-2.6 2.71-4.48V22.07c0-1.89-1.02-3.63-2.71-4.48L38.75.19C37.5.06 36.25 0 35 0z' fill='%23107C10' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          backgroundSize: '70px 70px'
        }}></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black mb-4">
              <span className="text-[#107C10]">XBOX</span> NOTÍCIAS & TRAILERS
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fique por dentro das últimas novidades, lançamentos e atualizações do universo Xbox.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Trailer Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative bg-black rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center" 
                  alt="Halo Infinite"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#107C10]/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <Badge className="mb-3 bg-[#107C10] text-white font-bold">TRAILER</Badge>
                <h3 className="font-bold text-xl mb-2 group-hover:text-[#107C10] transition-colors">
                  Halo Infinite: Nova Temporada
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  Confira o trailer da nova temporada de Halo Infinite com novos mapas, armas e modos de jogo.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">3 dias atrás</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors"
                  >
                    Assistir
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Notícia Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-black rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600&h=400&fit=crop&crop=center" 
                  alt="Xbox Game Pass"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              </div>
              
              <div className="p-6">
                <Badge className="mb-3 bg-yellow-500 text-black font-bold">NOVIDADE</Badge>
                <h3 className="font-bold text-xl mb-2 group-hover:text-[#107C10] transition-colors">
                  Xbox Game Pass: Novos Jogos de Junho
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  Microsoft anuncia a nova leva de jogos que chegam ao Xbox Game Pass em junho, incluindo títulos AAA e indies premiados.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">1 semana atrás</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors"
                  >
                    Ler mais
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Notícia Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group relative bg-black rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-transparent hover:border-[#107C10]"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop&crop=center" 
                  alt="Xbox Series X"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              </div>
              
              <div className="p-6">
                <Badge className="mb-3 bg-[#107C10] text-white font-bold">EVENTO</Badge>
                <h3 className="font-bold text-xl mb-2 group-hover:text-[#107C10] transition-colors">
                  Xbox Showcase 2025: O que esperar
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  Confira nossa análise sobre o que esperar do próximo Xbox Showcase, com rumores de novos jogos e possíveis surpresas.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">2 dias atrás</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#107C10] hover:text-white hover:bg-[#107C10] transition-colors"
                  >
                    Ler mais
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#107C10] text-[#107C10] hover:bg-[#107C10] hover:text-white font-bold px-10 py-5 text-xl transition-all duration-300 transform hover:scale-105"
            >
              VER TODAS AS NOTÍCIAS
            </Button>
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
          >
            <h2 className="text-5xl font-black mb-8">
              PRONTO PARA <span className="text-[#107C10]">JOGAR</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Explore todo o universo Xbox na UTI dos Games. Os melhores preços e produtos originais te esperam.
            </p>
            <Button 
              size="lg" 
              className="bg-[#107C10] hover:bg-[#0D5A0D] text-white font-bold px-12 py-6 text-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/categoria/xbox')}
            >
              VER TODOS OS PRODUTOS XBOX
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default XboxPage5;


