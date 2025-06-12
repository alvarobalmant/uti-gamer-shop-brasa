import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Package,
  Newspaper,
  Gamepad2,
  Settings,
  Monitor
} from 'lucide-react';

interface Xbox4Section {
  id?: string;
  section_key: string;
  section_type: string;
  display_order: number;
  is_visible: boolean;
  section_config: any;
}

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

export const Xbox4Manager = () => {
  const [config, setConfig] = useState<Xbox4Config>({
    hero_banner: {
      title: 'POWER YOUR DREAMS',
      subtitle: 'Entre na próxima geração de jogos com Xbox Series X|S',
      background_image: '',
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
      news_items: [
        {
          title: 'Halo Infinite: Nova Temporada',
          description: 'Descubra as novidades da nova temporada de Halo Infinite',
          image: '',
          type: 'trailer'
        },
        {
          title: 'Xbox Game Pass: Novos Jogos',
          description: 'Confira os novos títulos que chegaram ao Game Pass',
          image: '',
          type: 'news'
        },
        {
          title: 'Xbox Showcase 2025: O que esperar',
          description: 'Prepare-se para os grandes anúncios do Xbox Showcase',
          image: '',
          type: 'event'
        }
      ]
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadXbox4Config();
  }, []);

  const loadXbox4Config = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_layout_items')
        .select('*')
        .eq('page_id', 'xbox4')
        .order('display_order');

      if (error) throw error;

      if (data && data.length > 0) {
        // Reconstruct config from database sections
        const newConfig = { ...config };
        
        data.forEach((section: Xbox4Section) => {
          if (section.section_key === 'xbox4_hero_banner') {
            newConfig.hero_banner = section.section_config;
          } else if (section.section_key === 'xbox4_featured_products') {
            newConfig.featured_products = section.section_config;
          } else if (section.section_key === 'xbox4_games_section') {
            newConfig.games_section = section.section_config;
          } else if (section.section_key === 'xbox4_accessories_section') {
            newConfig.accessories_section = section.section_config;
          } else if (section.section_key === 'xbox4_news_section') {
            newConfig.news_section = section.section_config;
          }
        });
        
        setConfig(newConfig);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração Xbox4:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar configurações da página Xbox4",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveXbox4Config = async () => {
    setSaving(true);
    try {
      // Define sections to save
      const sections = [
        {
          page_id: 'xbox4',
          section_key: 'xbox4_hero_banner',
          section_type: 'hero_banner',
          display_order: 1,
          is_visible: true,
          section_config: config.hero_banner
        },
        {
          page_id: 'xbox4',
          section_key: 'xbox4_featured_products',
          section_type: 'product_section',
          display_order: 2,
          is_visible: true,
          section_config: config.featured_products
        },
        {
          page_id: 'xbox4',
          section_key: 'xbox4_games_section',
          section_type: 'product_section',
          display_order: 3,
          is_visible: true,
          section_config: config.games_section
        },
        {
          page_id: 'xbox4',
          section_key: 'xbox4_accessories_section',
          section_type: 'product_section',
          display_order: 4,
          is_visible: true,
          section_config: config.accessories_section
        },
        {
          page_id: 'xbox4',
          section_key: 'xbox4_news_section',
          section_type: 'news_section',
          display_order: 5,
          is_visible: true,
          section_config: config.news_section
        }
      ];

      // Delete existing sections for xbox4
      await supabase
        .from('page_layout_items')
        .delete()
        .eq('page_id', 'xbox4');

      // Insert new sections
      const { error } = await supabase
        .from('page_layout_items')
        .insert(sections);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Configurações da página Xbox4 salvas com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar configuração Xbox4:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações da página Xbox4",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (section: keyof Xbox4Config, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addNewsItem = () => {
    setConfig(prev => ({
      ...prev,
      news_section: {
        ...prev.news_section,
        news_items: [
          ...prev.news_section.news_items,
          {
            title: '',
            description: '',
            image: '',
            type: 'news' as const
          }
        ]
      }
    }));
  };

  const removeNewsItem = (index: number) => {
    setConfig(prev => ({
      ...prev,
      news_section: {
        ...prev.news_section,
        news_items: prev.news_section.news_items.filter((_, i) => i !== index)
      }
    }));
  };

  const updateNewsItem = (index: number, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      news_section: {
        ...prev.news_section,
        news_items: prev.news_section.news_items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Carregando configurações Xbox4...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Xbox 4 - Personalização
          </h2>
          <p className="text-gray-400">
            Configure todos os elementos da página Xbox4 de forma independente
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => window.open('/xbox4', '_blank')}
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={saveXbox4Config}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Hero Banner
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            Jogos
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Acessórios
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Notícias
          </TabsTrigger>
        </TabsList>

        {/* Hero Banner Configuration */}
        <TabsContent value="hero">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Configuração do Hero Banner
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hero-title" className="text-white">Título Principal</Label>
                  <Input
                    id="hero-title"
                    value={config.hero_banner.title}
                    onChange={(e) => updateConfig('hero_banner', 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle" className="text-white">Subtítulo</Label>
                  <Input
                    id="hero-subtitle"
                    value={config.hero_banner.subtitle}
                    onChange={(e) => updateConfig('hero_banner', 'subtitle', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="hero-bg" className="text-white">URL da Imagem de Fundo</Label>
                <Input
                  id="hero-bg"
                  value={config.hero_banner.background_image}
                  onChange={(e) => updateConfig('hero_banner', 'background_image', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-btn" className="text-white">Texto Botão Primário</Label>
                  <Input
                    id="primary-btn"
                    value={config.hero_banner.primary_button_text}
                    onChange={(e) => updateConfig('hero_banner', 'primary_button_text', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-btn" className="text-white">Texto Botão Secundário</Label>
                  <Input
                    id="secondary-btn"
                    value={config.hero_banner.secondary_button_text}
                    onChange={(e) => updateConfig('hero_banner', 'secondary_button_text', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Configuration */}
        <TabsContent value="products">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="w-5 h-5" />
                Seção de Consoles Xbox
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="products-title" className="text-white">Título da Seção</Label>
                  <Input
                    id="products-title"
                    value={config.featured_products.title}
                    onChange={(e) => updateConfig('featured_products', 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="products-max" className="text-white">Máximo de Produtos</Label>
                  <Input
                    id="products-max"
                    type="number"
                    value={config.featured_products.max_products}
                    onChange={(e) => updateConfig('featured_products', 'max_products', parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="products-subtitle" className="text-white">Subtítulo</Label>
                <Textarea
                  id="products-subtitle"
                  value={config.featured_products.subtitle}
                  onChange={(e) => updateConfig('featured_products', 'subtitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Tags de Produtos (separadas por vírgula)</Label>
                <Input
                  value={config.featured_products.product_tags.join(', ')}
                  onChange={(e) => updateConfig('featured_products', 'product_tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="xbox, console, series-x"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Games Configuration */}
        <TabsContent value="games">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                Seção de Jogos em Alta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="games-title" className="text-white">Título da Seção</Label>
                  <Input
                    id="games-title"
                    value={config.games_section.title}
                    onChange={(e) => updateConfig('games_section', 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="games-max" className="text-white">Máximo de Produtos</Label>
                  <Input
                    id="games-max"
                    type="number"
                    value={config.games_section.max_products}
                    onChange={(e) => updateConfig('games_section', 'max_products', parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="games-subtitle" className="text-white">Subtítulo</Label>
                <Textarea
                  id="games-subtitle"
                  value={config.games_section.subtitle}
                  onChange={(e) => updateConfig('games_section', 'subtitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Tags de Produtos (separadas por vírgula)</Label>
                <Input
                  value={config.games_section.product_tags.join(', ')}
                  onChange={(e) => updateConfig('games_section', 'product_tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="xbox, jogo, game"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessories Configuration */}
        <TabsContent value="accessories">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Seção de Acessórios Xbox
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accessories-title" className="text-white">Título da Seção</Label>
                  <Input
                    id="accessories-title"
                    value={config.accessories_section.title}
                    onChange={(e) => updateConfig('accessories_section', 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="accessories-max" className="text-white">Máximo de Produtos</Label>
                  <Input
                    id="accessories-max"
                    type="number"
                    value={config.accessories_section.max_products}
                    onChange={(e) => updateConfig('accessories_section', 'max_products', parseInt(e.target.value))}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accessories-subtitle" className="text-white">Subtítulo</Label>
                <Textarea
                  id="accessories-subtitle"
                  value={config.accessories_section.subtitle}
                  onChange={(e) => updateConfig('accessories_section', 'subtitle', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Tags de Produtos (separadas por vírgula)</Label>
                <Input
                  value={config.accessories_section.product_tags.join(', ')}
                  onChange={(e) => updateConfig('accessories_section', 'product_tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="xbox, acessorio, controle"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Configuration */}
        <TabsContent value="news">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5" />
                Seção de Notícias & Trailers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="news-title" className="text-white">Título da Seção</Label>
                  <Input
                    id="news-title"
                    value={config.news_section.title}
                    onChange={(e) => updateConfig('news_section', 'title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="news-subtitle" className="text-white">Subtítulo</Label>
                  <Input
                    id="news-subtitle"
                    value={config.news_section.subtitle}
                    onChange={(e) => updateConfig('news_section', 'subtitle', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-white text-lg">Itens de Notícias</Label>
                  <Button
                    onClick={addNewsItem}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {config.news_section.news_items.map((item, index) => (
                  <Card key={index} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-white border-gray-500">
                          Item {index + 1}
                        </Badge>
                        <Button
                          onClick={() => removeNewsItem(index)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white">Título</Label>
                          <Input
                            value={item.title}
                            onChange={(e) => updateNewsItem(index, 'title', e.target.value)}
                            className="bg-gray-600 border-gray-500 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Tipo</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) => updateNewsItem(index, 'type', value)}
                          >
                            <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="trailer">Trailer</SelectItem>
                              <SelectItem value="news">Notícia</SelectItem>
                              <SelectItem value="event">Evento</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white">Descrição</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateNewsItem(index, 'description', e.target.value)}
                          className="bg-gray-600 border-gray-500 text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white">URL da Imagem</Label>
                          <Input
                            value={item.image}
                            onChange={(e) => updateNewsItem(index, 'image', e.target.value)}
                            className="bg-gray-600 border-gray-500 text-white"
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>
                        <div>
                          <Label className="text-white">URL de Destino (opcional)</Label>
                          <Input
                            value={item.url || ''}
                            onChange={(e) => updateNewsItem(index, 'url', e.target.value)}
                            className="bg-gray-600 border-gray-500 text-white"
                            placeholder="https://exemplo.com/noticia"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

