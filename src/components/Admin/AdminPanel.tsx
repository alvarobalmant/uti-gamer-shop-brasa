import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManager from './ProductManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import UserSubscriptionManagement from './UserSubscriptionManagement';
import HomepageStructureManager from './HomepageStructureManager'; // Import the new structure manager
import ProductSectionManager from './ProductSectionManager'; // Import the new product section manager
import { Package, Image, Briefcase, Tag, Users, LayoutList, Settings } from 'lucide-react'; // Added Settings icon for Product Sections

export const AdminPanel = () => {
  // Default to a relevant tab, maybe homepage structure now?
  const [activeTab, setActiveTab] = useState('homepage_structure');

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
          {/* Adjusted grid columns if needed, now 7 tabs */}
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="homepage_structure" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Estrutura Home
            </TabsTrigger>
             <TabsTrigger value="product_sections" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Seções Produtos
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários/PRO
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
          </TabsList>

          {/* Content for Homepage Structure */}
          <TabsContent value="homepage_structure">
            <HomepageStructureManager />
          </TabsContent>

          {/* Content for Product Sections Management */}
          <TabsContent value="product_sections">
            <ProductSectionManager />
          </TabsContent>

          <TabsContent value="users">
            <UserSubscriptionManagement />
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

        </Tabs>
      </div>
    </div>
  );
};

