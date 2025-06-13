
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePages, PageLayoutItem } from '@/hooks/usePages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Xbox4FeaturedProductsManager from '@/components/Admin/Xbox4Admin/Xbox4FeaturedProductsManager';
import { PageLayoutItemConfig } from '@/types/xbox4Admin';

const Xbox4AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('consoles');
  const { getPageBySlug, fetchPageLayout, updatePageLayout, addPageSection, loading, error } = usePages();
  const [xbox4PageId, setXbox4PageId] = useState<string | null>(null);
  const [pageLayoutItems, setPageLayoutItems] = useState<PageLayoutItem[]>([]);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  
  // Configurações para cada seção
  const [consolesConfig, setConsolesConfig] = useState<PageLayoutItemConfig | null>(null);
  const [gamesConfig, setGamesConfig] = useState<PageLayoutItemConfig | null>(null);
  const [accessoriesConfig, setAccessoriesConfig] = useState<PageLayoutItemConfig | null>(null);
  const [offersConfig, setOffersConfig] = useState<PageLayoutItemConfig | null>(null);
  const [newsConfig, setNewsConfig] = useState<PageLayoutItemConfig | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoadingPageData(true);
      const page = getPageBySlug('xbox4');
      if (page) {
        setXbox4PageId(page.id);
        const layout = await fetchPageLayout(page.id);
        setPageLayoutItems(layout);
        
        // Carregar configurações existentes para cada seção
        const consolesSection = layout.find(item => item.section_key === 'xbox4_consoles');
        if (consolesSection && consolesSection.sectionConfig) {
          setConsolesConfig(consolesSection.sectionConfig);
        }
        
        const gamesSection = layout.find(item => item.section_key === 'xbox4_games');
        if (gamesSection && gamesSection.sectionConfig) {
          setGamesConfig(gamesSection.sectionConfig);
        }
        
        const accessoriesSection = layout.find(item => item.section_key === 'xbox4_accessories');
        if (accessoriesSection && accessoriesSection.sectionConfig) {
          setAccessoriesConfig(accessoriesSection.sectionConfig);
        }
        
        const offersSection = layout.find(item => item.section_key === 'xbox4_offers');
        if (offersSection && offersSection.sectionConfig) {
          setOffersConfig(offersSection.sectionConfig);
        }
        
        const newsSection = layout.find(item => item.section_key === 'xbox4_news');
        if (newsSection && newsSection.sectionConfig) {
          setNewsConfig(newsSection.sectionConfig);
        }
      } else {
        console.error('Página /xbox4 não encontrada no Supabase.');
      }
      setIsLoadingPageData(false);
    };
    loadPageData();
  }, [getPageBySlug, fetchPageLayout]);

  const handleSaveSection = useCallback(async (sectionKey: string, config: PageLayoutItemConfig) => {
    if (!xbox4PageId) {
      console.error('xbox4PageId não disponível para salvar a configuração.');
      return;
    }

    try {
      const existingItem = pageLayoutItems.find(item => item.section_key === sectionKey);

      if (existingItem) {
        // Update existing section
        console.log('Updating existing section:', sectionKey);
        const updatedLayoutItems = pageLayoutItems.map(item =>
          item.section_key === sectionKey
            ? { ...item, sectionConfig: config as any }
            : item
        );

        await updatePageLayout(xbox4PageId, updatedLayoutItems);
        setPageLayoutItems(updatedLayoutItems);
      } else {
        // Create new section
        console.log('Creating new section:', sectionKey);
        const sectionTitles: Record<string, string> = {
          'xbox4_consoles': 'CONSOLES XBOX',
          'xbox4_games': 'JOGOS EM ALTA',
          'xbox4_accessories': 'ACESSÓRIOS XBOX',
          'xbox4_offers': 'OFERTAS IMPERDÍVEIS',
          'xbox4_news': 'NOTÍCIAS & TRAILERS'
        };
        
        const newSectionData: Omit<PageLayoutItem, 'id'> = {
          page_id: xbox4PageId,
          section_key: sectionKey,
          title: sectionTitles[sectionKey] || 'Nova Seção',
          display_order: pageLayoutItems.length + 1,
          is_visible: true,
          section_type: sectionKey === 'xbox4_news' ? 'news' : 'products',
          sectionConfig: config as any,
        };

        const newSection = await addPageSection(xbox4PageId, newSectionData);
        if (newSection) {
          setPageLayoutItems(prev => [...prev, newSection]);
        }
      }
      
      // Update local state for the specific section
      switch (sectionKey) {
        case 'xbox4_consoles':
          setConsolesConfig(config);
          break;
        case 'xbox4_games':
          setGamesConfig(config);
          break;
        case 'xbox4_accessories':
          setAccessoriesConfig(config);
          break;
        case 'xbox4_offers':
          setOffersConfig(config);
          break;
        case 'xbox4_news':
          setNewsConfig(config);
          break;
      }
      
      console.log('Configuração salva com sucesso:', config);
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
    }
  }, [xbox4PageId, pageLayoutItems, updatePageLayout, addPageSection]);

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
        <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
          <TabsTrigger value="consoles">CONSOLES XBOX</TabsTrigger>
          <TabsTrigger value="games">JOGOS EM ALTA</TabsTrigger>
          <TabsTrigger value="accessories">ACESSÓRIOS XBOX</TabsTrigger>
          <TabsTrigger value="offers">OFERTAS IMPERDÍVEIS</TabsTrigger>
          <TabsTrigger value="news">NOTÍCIAS & TRAILERS</TabsTrigger>
        </TabsList>

        <TabsContent value="consoles">
          <Xbox4FeaturedProductsManager
            initialConfig={consolesConfig}
            onSave={(config) => handleSaveSection('xbox4_consoles', config)}
            sectionTitle="CONSOLES XBOX"
            defaultTags={['xbox', 'console']}
          />
        </TabsContent>

        <TabsContent value="games">
          <Xbox4FeaturedProductsManager
            initialConfig={gamesConfig}
            onSave={(config) => handleSaveSection('xbox4_games', config)}
            sectionTitle="JOGOS EM ALTA"
            defaultTags={['xbox', 'game']}
          />
        </TabsContent>

        <TabsContent value="accessories">
          <Xbox4FeaturedProductsManager
            initialConfig={accessoriesConfig}
            onSave={(config) => handleSaveSection('xbox4_accessories', config)}
            sectionTitle="ACESSÓRIOS XBOX"
            defaultTags={['xbox', 'accessory']}
          />
        </TabsContent>

        <TabsContent value="offers">
          <Xbox4FeaturedProductsManager
            initialConfig={offersConfig}
            onSave={(config) => handleSaveSection('xbox4_offers', config)}
            sectionTitle="OFERTAS IMPERDÍVEIS"
            defaultTags={['xbox', 'offer']}
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
      </Tabs>
    </div>
  );
};

export default Xbox4AdminPage;
