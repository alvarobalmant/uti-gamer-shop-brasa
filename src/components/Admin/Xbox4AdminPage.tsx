
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePages, PageLayoutItem } from '@/hooks/usePages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Xbox4FeaturedProductsManager from '@/components/Admin/Xbox4Admin/Xbox4FeaturedProductsManager';
import { PageLayoutItemConfig } from '@/types/xbox4Admin';

const Xbox4AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { getPageBySlug, fetchPageLayout, updatePageLayout, loading, error } = usePages();
  const [xbox4PageId, setXbox4PageId] = useState<string | null>(null);
  const [pageLayoutItems, setPageLayoutItems] = useState<PageLayoutItem[]>([]);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  const [featuredProductsConfig, setFeaturedProductsConfig] = useState<PageLayoutItemConfig | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoadingPageData(true);
      const page = getPageBySlug('xbox4');
      if (page) {
        setXbox4PageId(page.id);
        const layout = await fetchPageLayout(page.id);
        setPageLayoutItems(layout);
        
        // Carregar configurações existentes para produtos em destaque
        const featuredProductsSection = layout.find(item => item.section_key === 'xbox4_featured_products');
        if (featuredProductsSection && featuredProductsSection.section_config) {
          setFeaturedProductsConfig(featuredProductsSection.section_config);
        }
      } else {
        console.error('Página /xbox4 não encontrada no Supabase.');
      }
      setIsLoadingPageData(false);
    };
    loadPageData();
  }, [getPageBySlug, fetchPageLayout]);

  const handleSaveFeaturedProducts = useCallback(async (config: PageLayoutItemConfig) => {
    if (!xbox4PageId) {
      console.error('xbox4PageId não disponível para salvar a configuração.');
      return;
    }

    try {
      const existingItem = pageLayoutItems.find(item => item.section_key === 'xbox4_featured_products');
      let updatedLayoutItems: PageLayoutItem[];

      if (existingItem) {
        // Atualizar item existente
        updatedLayoutItems = pageLayoutItems.map(item =>
          item.section_key === 'xbox4_featured_products'
            ? { ...item, section_config: config as any }
            : item
        );
      } else {
        // Adicionar novo item
        const newSection: PageLayoutItem = {
          id: `temp-${Date.now()}`,
          page_id: xbox4PageId,
          section_key: 'xbox4_featured_products',
          title: 'Produtos em Destaque',
          display_order: pageLayoutItems.length + 1,
          is_visible: true,
          section_type: 'products',
          section_config: config as any,
        };
        updatedLayoutItems = [...pageLayoutItems, newSection];
      }

      await updatePageLayout(xbox4PageId, updatedLayoutItems);
      setPageLayoutItems(updatedLayoutItems);
      setFeaturedProductsConfig(config);
      
      console.log('Configuração salva com sucesso:', config);
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
    }
  }, [xbox4PageId, pageLayoutItems, updatePageLayout]);

  if (isLoadingPageData) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando configurações da página Xbox 4...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Erro ao carregar configurações: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Xbox 4 - Personalização</h1>
      <p className="text-lg text-gray-300 mb-8">Gerencie o conteúdo exclusivo da página /xbox4.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="products">Produtos em Destaque</TabsTrigger>
          <TabsTrigger value="news">Notícias e Trailers</TabsTrigger>
          <TabsTrigger value="offers">Ofertas Especiais</TabsTrigger>
          <TabsTrigger value="banners">Banners Secundários</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Xbox4FeaturedProductsManager
            initialConfig={featuredProductsConfig}
            onSave={handleSaveFeaturedProducts}
          />
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Notícias e Trailers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Aqui você poderá escolher ou cadastrar as notícias e trailers que aparecem na seção de notícias da página /xbox4.</p>
              <p className="text-gray-400 mt-4">Esta funcionalidade será implementada em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Ofertas Especiais</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure as ofertas especiais que aparecem na página /xbox4.</p>
              <p className="text-gray-400 mt-4">Esta funcionalidade será implementada em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Banners Secundários</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure os banners secundários que aparecem na página /xbox4.</p>
              <p className="text-gray-400 mt-4">Esta funcionalidade será implementada em breve.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Xbox4AdminPage;
