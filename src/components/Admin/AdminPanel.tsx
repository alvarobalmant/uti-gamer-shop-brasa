
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManager from './ProductManager';
import { BannerManager } from './BannerManager';
import { QuickLinkManager } from './QuickLinkManager';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import ProductSectionManager from './ProductSectionManager';
import UserSubscriptionManager from './UserSubscriptionManager';
import PageManager from './PageManager';
import { SpecialSectionManager } from './SpecialSectionManager';
import PageLayoutManager from './PageLayoutManager';
import AdminLayout from './AdminLayout';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie produtos, banners, links rápidos e outros elementos do site.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="quick-links">Links</TabsTrigger>
            <TabsTrigger value="service-cards">Serviços</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="product-sections">Seções</TabsTrigger>
            <TabsTrigger value="special-sections">Especiais</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="pages">Páginas</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <ProductManager />
          </TabsContent>

          <TabsContent value="banners" className="mt-6">
            <BannerManager />
          </TabsContent>

          <TabsContent value="quick-links" className="mt-6">
            <QuickLinkManager />
          </TabsContent>

          <TabsContent value="service-cards" className="mt-6">
            <ServiceCardManager />
          </TabsContent>

          <TabsContent value="tags" className="mt-6">
            <TagManager />
          </TabsContent>

          <TabsContent value="product-sections" className="mt-6">
            <ProductSectionManager />
          </TabsContent>

          <TabsContent value="special-sections" className="mt-6">
            <SpecialSectionManager />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            <UserSubscriptionManager />
          </TabsContent>

          <TabsContent value="pages" className="mt-6">
            <PageManager />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
