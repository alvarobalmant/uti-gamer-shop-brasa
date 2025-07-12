import React, { useState, useEffect } from 'react';
import { Product } from '@/hooks/useProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, User, Calendar, CheckCircle, Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface ProductTabsEnhancedProps {
  product: any;
}

const ProductTabsEnhanced: React.FC<ProductTabsEnhancedProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [jsonbData, setJsonbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Buscar campos JSONB diretamente da tabela products
  useEffect(() => {
    const fetchJsonbData = async () => {
      if (!product?.id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('product_faqs, product_videos, product_descriptions, specifications')
          .eq('id', product.id)
          .single();

        if (error) {
          console.error('Erro ao buscar campos JSONB:', error);
        } else {
          setJsonbData(data);
        }
      } catch (err) {
        console.error('Exceção ao buscar campos JSONB:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJsonbData();
  }, [product?.id]);

  // Processar especificações estruturadas
  const getSpecifications = () => {
    console.log('[ProductTabsEnhanced] Processando especificações:', product.specifications);
    
    if (product.specifications) {
      // Se é um array de objetos simples [{name: "x", value: "y"}]
      if (Array.isArray(product.specifications)) {
        return [{
          name: 'Especificações Técnicas',
          specs: product.specifications.map(spec => ({
            label: spec.name,
            value: spec.value,
            highlight: false
          }))
        }];
      }
      
      // Se é um objeto estruturado com categorias
      if (product.specifications.categories && Array.isArray(product.specifications.categories)) {
        return product.specifications.categories;
      }

      // Se é um objeto plano (chave-valor direto)
      if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
        return [{
          name: 'Especificações Técnicas',
          specs: Object.entries(product.specifications).map(([key, value]) => ({
            label: key,
            value: String(value),
            highlight: false
          }))
        }];
      }
    }
    
    console.log('[ProductTabsEnhanced] Nenhuma especificação encontrada');
    return [];
  };

  // Processar descrições múltiplas
  const getDescriptions = () => {
    const descriptions = product.product_descriptions || {};
    return {
      short: descriptions.short || product.description || '',
      detailed: descriptions.detailed || '',
      technical: descriptions.technical || '',
      marketing: descriptions.marketing || ''
    };
  };

  // Processar vídeos do produto
  const getVideos = () => {
    // Retornar vídeos reais do banco de dados
    if (product.product_videos && Array.isArray(product.product_videos) && product.product_videos.length > 0) {
      return product.product_videos;
    }
    
    // Se não há vídeos, retornar array vazio
    return [];
  };

  // Processar FAQ do produto
  const getFAQs = () => {
    console.log('[ProductTabsEnhanced] Processando FAQs:', product.product_faqs);
    
    // Priorizar dados JSONB carregados diretamente
    const faqs = jsonbData?.product_faqs || product.product_faqs;
    
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      console.log('[ProductTabsEnhanced] FAQs encontrados:', faqs.length);
      return faqs.map((faq, index) => ({
        id: faq.id || index + 1,
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'Geral',
        is_visible: faq.is_visible !== false
      }));
    }
    
    console.log('[ProductTabsEnhanced] Nenhum FAQ encontrado');
    return [];
  };

  // Processar avaliações
  const getReviews = () => {
    const reviewsConfig = product.reviews_config || {};
    
    if (reviewsConfig.custom_rating?.use_custom) {
      return {
        enabled: reviewsConfig.enabled !== false,
        rating: reviewsConfig.custom_rating.value || 0,
        count: reviewsConfig.custom_rating.count || 0,
        reviews: []
      };
    }

    // Dados mock para demonstração
    return {
      enabled: reviewsConfig.enabled !== false,
      rating: 4.8,
      count: 127,
      reviews: [
        {
          id: 1,
          name: 'João Santos',
          rating: 5,
          date: '2024-01-15',
          comment: 'Jogo incrível! Gráficos espetaculares e gameplay viciante. Recomendo demais!',
          verified: true,
        },
        {
          id: 2,
          name: 'Maria Silva',
          rating: 4,
          date: '2024-01-10',
          comment: 'Muito bom, mas achei um pouco difícil no início. História envolvente.',
          verified: true,
        }
      ]
    };
  };

  const specifications = getSpecifications();
  const descriptions = getDescriptions();
  const videos = getVideos();
  const faqs = getFAQs();
  const reviewsData = getReviews();

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="description" className="text-base font-medium">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-base font-medium">
              Especificações
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-base font-medium">
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="media" className="text-base font-medium">
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-base font-medium">
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Aba Descrição */}
          <TabsContent value="description" className="space-y-6">
            <div className="prose max-w-none">
              {descriptions.marketing && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Destaque</h3>
                  <p className="text-gray-700 leading-relaxed">{descriptions.marketing}</p>
                </div>
              )}
              
              <div className="text-lg text-gray-700 leading-relaxed">
                {descriptions.detailed || descriptions.short || product.description || 
                  `Descubra ${product.name}, uma experiência única de gaming que vai revolucionar sua forma de jogar.`}
              </div>
              
              {descriptions.technical && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Informações Técnicas</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{descriptions.technical}</p>
                  </div>
                </div>
              )}

              {/* Características destacadas */}
              {product.product_highlights && product.product_highlights.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Características Principais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.product_highlights.map((highlight) => (
                      <div key={highlight.id} className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{highlight.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Aba Especificações */}
          <TabsContent value="specifications" className="space-y-6">
            {specifications.length > 0 ? (
              <div className="grid gap-6">
                {specifications.map((category, index) => (
                  <div key={index} className="card"
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      backgroundColor: 'white'
                    }}>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.specs && category.specs.map((spec, specIndex) => (
                          <div 
                            key={specIndex} 
                            className={`flex justify-between items-center p-3 rounded-lg ${
                              spec.highlight ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                            }`}
                          >
                            <span className="font-medium text-gray-700">{spec.label}:</span>
                            <span className={`font-semibold ${
                              spec.highlight ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma especificação disponível</h3>
                  <p className="text-gray-500">
                    Ainda não há especificações técnicas cadastradas para este produto.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Aba Avaliações */}
          <TabsContent value="reviews" className="space-y-6">
            {reviewsData.enabled ? (
              <>
                <div className="flex items-center space-x-6 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{reviewsData.rating}</div>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= reviewsData.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {reviewsData.count} avaliações
                    </div>
                  </div>
                </div>

                {reviewsData.reviews.length > 0 && (
                  <div className="space-y-4">
                    {reviewsData.reviews.map((review) => (
                      <div key={review.id} className="card"
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '1.5rem',
                          backgroundColor: 'white'
                        }}>
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{review.name}</span>
                                  {review.verified && (
                                    <Badge variant="secondary" className="text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verificado
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-4 h-4 ${
                                          star <= review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Avaliações não disponíveis para este produto.</p>
              </div>
            )}
          </TabsContent>

          {/* Aba Vídeos */}
          <TabsContent value="media" className="space-y-6">
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="card overflow-hidden"
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      backgroundColor: 'white'
                    }}>
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                          <Play className="w-6 h-6 mr-2" />
                          Assistir
                        </Button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {video.duration}
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-900">{video.title}</h4>
                      {video.is_featured && (
                        <Badge className="mt-2">Destaque</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum vídeo disponível</h3>
                  <p className="text-gray-500">
                    Ainda não há vídeos cadastrados para este produto.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Aba FAQ */}
          <TabsContent value="faq" className="space-y-4">
            {faqs.length > 0 ? (
              faqs.filter(faq => faq.is_visible !== false).map((faq) => (
                <div key={faq.id} className="card"
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    backgroundColor: 'white'
                  }}>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                    <p className="text-gray-700">{faq.answer}</p>
                    <Badge variant="outline" className="mt-3 text-xs">
                      {faq.category}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma pergunta frequente</h3>
                  <p className="text-gray-500">
                    Ainda não há perguntas frequentes cadastradas para este produto.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabsEnhanced;

