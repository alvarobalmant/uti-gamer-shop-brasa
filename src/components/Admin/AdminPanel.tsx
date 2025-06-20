import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManager from './ProductManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import UserSubscriptionManagement from './UserSubscriptionManagement'; // Corrected import name based on file listing
import HomepageLayoutManager from '@/pages/Admin/HomepageLayoutManager';
import ProductSectionManager from './ProductSectionManager';
import PageManager from './PageManager';
import { QuickLinkManager } from './QuickLinkManager';
import SpecialSectionManager from './SpecialSectionManager'; // Import SpecialSectionManager
import Xbox4AdminPage from './Xbox4AdminPage'; // Import the new Xbox4AdminPage
import { Package, Image, Briefcase, Tag, Users, LayoutList, ListChecks, Globe, Link, Star, Gamepad2 } from 'lucide-react'; // Added Star icon

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('xbox4_customization'); // Default to Xbox4 customization for testing

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">
            Gerencie o conteúdo e as configurações do site UTI dos Games
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Updated grid-cols-10 to accommodate the new tab */}
          <TabsList className="grid w-full grid-cols-12 bg-gray-800 border-gray-700">
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Layout Home
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="product_sections" className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Seções Produtos
            </TabsTrigger>
            {/* Added Special Sections Tab */}
            <TabsTrigger value="special_sections" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Seções Especiais
            </TabsTrigger>
            <TabsTrigger value="xbox4_customization" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Xbox 4 - Personalização
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="quick_links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Links Rápidos
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários/PRO
            </TabsTrigger>
          </TabsList>

          {/* Content for Homepage Layout Management */}
          <TabsContent value="layout">
            <HomepageLayoutManager />
          </TabsContent>

          {/* Content for Pages Management */}
          <TabsContent value="pages">
            <PageManager />
          </TabsContent>

          {/* Content for Product Section Management */}
          <TabsContent value="product_sections">
            <ProductSectionManager />
          </TabsContent>

          {/* Added Special Sections Content */}
          <TabsContent value="special_sections">
            <SpecialSectionManager />
          </TabsContent>

          <TabsContent value="xbox4_customization">
            <Xbox4AdminPage />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="banners">
            <BannerManager />
          </TabsContent>

          <TabsContent value="quick_links">
            <QuickLinkManager />
          </TabsContent>

          <TabsContent value="services">
            <ServiceCardManager />
          </TabsContent>

          <TabsContent value="tags">
            <TagManager />
          </TabsContent>

          <TabsContent value="users">
            <UserSubscriptionManagement />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};
