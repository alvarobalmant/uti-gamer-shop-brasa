import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManager from './ProductManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import UserSubscriptionManagement from './UserSubscriptionManagement';
import HomepageLayoutManager from '@/pages/Admin/HomepageLayoutManager';
import ProductSectionManager from './ProductSectionManager';
import PageManager from './PageManager';
import QuickLinksManager from './QuickLinksManager';
import { Package, Image, Briefcase, Tag, Users, LayoutList, ListChecks, Globe, Link } from 'lucide-react';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('layout'); // Default to layout management

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
          {/* Updated grid-cols-9 to accommodate the new tab */}
          <TabsList className="grid w-full grid-cols-9 bg-gray-800 border-gray-700">
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Layout Home
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="quick_links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Links Rápidos
            </TabsTrigger>
            <TabsTrigger value="product_sections" className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Seções Produtos
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Banners
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

          {/* Content for Quick Links Management */}
          <TabsContent value="quick_links">
            <QuickLinksManager />
          </TabsContent>

          {/* Content for Product Section Management */}
          <TabsContent value="product_sections">
            <ProductSectionManager />
          </TabsContent>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="banners">
            <BannerManager />
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
