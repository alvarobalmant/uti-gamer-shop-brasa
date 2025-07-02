
import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
import { Star, User, Calendar, CheckCircle } from 'lucide-react';
=======
import { Star, User, Calendar, CheckCircle, Play, Shield, Clock, Heart } from 'lucide-react';
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductTabsProps {
  product: Product;
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

<<<<<<< HEAD
  // Usar especificações do produto ou dados mock como fallback
  console.log('ProductTabs: Product specifications:', product.specifications);
  
=======
  console.log('ProductTabs: Product specifications:', product.specifications);
  console.log('ProductTabs: Product videos:', product.product_videos);
  console.log('ProductTabs: Product FAQs:', product.product_faqs);
  
  // Usar especificações do produto ou dados mock como fallback
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
  const specifications = product.specifications && product.specifications.length > 0 
    ? product.specifications 
    : [
        { label: 'Plataforma', value: 'PlayStation 5' },
        { label: 'Gênero', value: 'Ação/Aventura' },
        { label: 'Classificação', value: '16 anos' },
        { label: 'Desenvolvedor', value: 'Sony Interactive' },
        { label: 'Data de Lançamento', value: '15/11/2024' },
        { label: 'Idiomas', value: 'Português, Inglês, Espanhol' },
        { label: 'Modos de Jogo', value: 'Single Player, Multiplayer' },
        { label: 'Espaço Necessário', value: '50 GB' },
      ];

<<<<<<< HEAD
=======
  // Usar configuração de reviews customizada se disponível
  const reviewsConfig = product.reviews_config || {
    enabled: true,
    show_rating: true,
    show_count: true,
    allow_reviews: true,
    custom_rating: {
      value: 4.8,
      count: 127,
      use_custom: false
    }
  };

  const rating = reviewsConfig.custom_rating?.use_custom 
    ? reviewsConfig.custom_rating.value 
    : 4.8;
  
  const reviewCount = reviewsConfig.custom_rating?.use_custom 
    ? reviewsConfig.custom_rating.count 
    : 127;

  // Reviews mock (em produção viriam do backend)
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
  const reviews = [
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
    },
    {
      id: 3,
      name: 'Pedro Costa',
      rating: 5,
      date: '2024-01-08',
      comment: 'Melhor compra do ano! Entrega rápida da UTI dos Games.',
      verified: false,
    },
  ];

<<<<<<< HEAD
  const videos = [
    {
      id: 1,
      title: 'Trailer Oficial',
      thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
      duration: '2:30',
    },
    {
      id: 2,
      title: 'Gameplay - Primeiros 15 minutos',
      thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400',
      duration: '15:22',
    },
  ];
=======
  // Usar vídeos configurados ou fallback
  const videos = product.product_videos && product.product_videos.length > 0
    ? product.product_videos.sort((a, b) => a.order - b.order)
    : [
        {
          id: '1',
          title: 'Trailer Oficial',
          url: 'https://youtube.com/watch?v=example',
          thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
          duration: '2:30',
          type: 'youtube' as const,
          order: 1,
          is_featured: true,
        },
        {
          id: '2',
          title: 'Gameplay - Primeiros 15 minutos',
          url: 'https://youtube.com/watch?v=example2',
          thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400',
          duration: '15:22',
          type: 'youtube' as const,
          order: 2,
          is_featured: false,
        },
      ];

  // Usar FAQs configurados se disponíveis
  const faqs = product.product_faqs && product.product_faqs.length > 0
    ? product.product_faqs
        .filter(faq => faq.is_visible)
        .sort((a, b) => a.order - b.order)
    : [];

  // Usar descrições configuradas se disponíveis
  const descriptions = product.product_descriptions || {};
  const mainDescription = descriptions.detailed || descriptions.marketing || product.description;

  // Usar highlights configurados se disponíveis
  const highlights = product.product_highlights && product.product_highlights.length > 0
    ? product.product_highlights
        .filter(highlight => highlight.is_featured)
        .sort((a, b) => a.order - b.order)
    : [
        { id: '1', text: 'Gráficos de última geração com tecnologia ray tracing', icon: 'star', order: 1, is_featured: true },
        { id: '2', text: 'Modo multiplayer online para até 16 jogadores', icon: 'users', order: 2, is_featured: true },
        { id: '3', text: 'Campanha single-player com mais de 40 horas', icon: 'clock', order: 3, is_featured: true },
        { id: '4', text: 'Sistema de progressão e customização profundo', icon: 'settings', order: 4, is_featured: true },
        { id: '5', text: 'Compatibilidade total com controles DualSense', icon: 'gamepad', order: 5, is_featured: true },
      ];
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="description" className="text-base font-medium">
              Descrição
            </TabsTrigger>
            <TabsTrigger value="specifications" className="text-base font-medium">
              Especificações
            </TabsTrigger>
<<<<<<< HEAD
            <TabsTrigger value="reviews" className="text-base font-medium">
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="media" className="text-base font-medium">
              Vídeos
            </TabsTrigger>
=======
            {reviewsConfig.enabled && (
              <TabsTrigger value="reviews" className="text-base font-medium">
                Avaliações
              </TabsTrigger>
            )}
            {videos.length > 0 && (
              <TabsTrigger value="media" className="text-base font-medium">
                Vídeos
              </TabsTrigger>
            )}
            {faqs.length > 0 && (
              <TabsTrigger value="faq" className="text-base font-medium">
                FAQ
              </TabsTrigger>
            )}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
          </TabsList>

          <TabsContent value="description" className="space-y-6">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
<<<<<<< HEAD
                {product.description || `Descubra ${product.name}, uma experiência única de gaming que vai revolucionar sua forma de jogar. Com gráficos impressionantes e jogabilidade envolvente, este título promete horas de diversão e entretenimento.`}
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Características Principais
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Gráficos de última geração com tecnologia ray tracing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Modo multiplayer online para até 16 jogadores</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Campanha single-player com mais de 40 horas</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Sistema de progressão e customização profundo</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Compatibilidade total com controles DualSense</span>
                </li>
              </ul>
=======
                {mainDescription || `Descubra ${product.name}, uma experiência única de gaming que vai revolucionar sua forma de jogar. Com gráficos impressionantes e jogabilidade envolvente, este título promete horas de diversão e entretenimento.`}
              </p>
              
              {highlights.length > 0 && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Características Principais
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    {highlights.map((highlight) => (
                      <li key={highlight.id} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <span>{highlight.text}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {descriptions.technical && (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    Informações Técnicas
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {descriptions.technical}
                  </p>
                </>
              )}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specifications.map((spec, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{spec.label}:</span>
                  <span className="text-gray-700">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

<<<<<<< HEAD
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-2xl font-bold text-gray-900">4.8</span>
                </div>
                <span className="text-gray-600">baseado em {reviews.length} avaliações</span>
              </div>
              <Button variant="outline">Escrever Avaliação</Button>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Compra Verificada
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(review.date).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
=======
          {reviewsConfig.enabled && (
            <TabsContent value="reviews" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  {reviewsConfig.show_rating && (
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
<<<<<<< HEAD
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="relative group cursor-pointer">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 mt-2">{video.title}</h3>
                </div>
              ))}
            </div>
          </TabsContent>
=======
                          className={`w-6 h-6 ${
                            i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-2xl font-bold text-gray-900">{rating}</span>
                    </div>
                  )}
                  {reviewsConfig.show_count && (
                    <span className="text-gray-600">baseado em {reviewCount} avaliações</span>
                  )}
                </div>
                {reviewsConfig.allow_reviews && (
                  <Button variant="outline">Escrever Avaliação</Button>
                )}
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{review.name}</span>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Compra Verificada
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(review.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {videos.length > 0 && (
            <TabsContent value="media" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video) => (
                  <div key={video.id} className="relative group cursor-pointer">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mt-2">{video.title}</h3>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {faqs.length > 0 && (
            <TabsContent value="faq" className="space-y-6">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                    {faq.category && (
                      <div className="mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {faq.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
>>>>>>> 8e6f564f9d9afa431eb06b47a1304d04673d0897
        </Tabs>
      </div>
    </div>
  );
};

export default ProductTabs;
