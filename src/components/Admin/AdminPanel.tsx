import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
import ProductManager from './ProductManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import UserSubscriptionManagement from './UserSubscriptionManagement';
import HomepageLayoutManager from '@/pages/Admin/HomepageLayoutManager'; // Renamed component
import ProductSectionManager from './ProductSectionManager'; // New component for managing product sections
import { Package, Image, Briefcase, Tag, Users, LayoutList, ListChecks } from 'lucide-react'; // Added ListChecks icon

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('layout'); // Default to layout management
=======
import ProductManager from './ProductManager'; // Assuming this manages products
import { BannerManager } from './BannerManager'; // Assuming this manages banners
import { ServiceCardManager } from './ServiceCardManager'; // Assuming this manages service cards
import { TagManager } from './TagManager'; // Assuming this manages tags
import UserSubscriptionManagement from './UserSubscriptionManagement'; // Assuming this manages users/UTI Pro
import AdminSections from '@/pages/Admin/AdminSections'; // Import the new sections manager
import { Package, Image, Briefcase, Tag, Users, LayoutList } from 'lucide-react'; // Added LayoutList icon

export const AdminPanel = () => {
  // Default to users or another relevant tab if preferred
  const [activeTab, setActiveTab] = useState('users'); 
>>>>>>> db89b397e0937622868cfb2e37c5521addb851a2

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
<<<<<<< HEAD
          {/* Updated grid-cols-7 to accommodate the new tabs */}
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Layout Home
            </TabsTrigger>
            <TabsTrigger value="product_sections" className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Seções Produtos
=======
          {/* Updated grid-cols-6 to accommodate the new tab */}
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários/PRO
>>>>>>> db89b397e0937622868cfb2e37c5521addb851a2
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
<<<<<<< HEAD
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários/PRO
            </TabsTrigger>
          </TabsList>

          {/* Content for Homepage Layout Management */}
          <TabsContent value="layout">
            <HomepageLayoutManager />
          </TabsContent>

          {/* Content for Product Section Management */}
          <TabsContent value="product_sections">
            <ProductSectionManager />
=======
            {/* New Tab for Home Sections */}
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <LayoutList className="w-4 h-4" />
              Seções Home
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {/* Ensure this component handles both user and UTI Pro management */}
            <UserSubscriptionManagement /> 
>>>>>>> db89b397e0937622868cfb2e37c5521addb851a2
          </TabsContent>

          <TabsContent value="products">
            {/* Ensure this component handles product CRUD and tag association */}
            <ProductManager /> 
          </TabsContent>

          <TabsContent value="banners">
            {/* Ensure this handles banner CRUD, image upload/drag */}
            <BannerManager /> 
          </TabsContent>

          <TabsContent value="services">
            {/* Ensure this handles service card customization */}
            <ServiceCardManager /> 
          </TabsContent>

          <TabsContent value="tags">
             {/* Ensure this handles tag CRUD */}
            <TagManager />
          </TabsContent>
          
          {/* New Tab Content for Home Sections */}
          <TabsContent value="sections">
            <AdminSections />
          </TabsContent>

          <TabsContent value="users">
            <UserSubscriptionManagement />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

