
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductManager from './ProductManagerNew';
import { BannerManagerNew } from './BannerManagerNew';
import { ServiceCardManager } from './ServiceCardManager';
import { TagManager } from './TagManager';
import UserSubscriptionManagement from './UserSubscriptionManagement';
import HomepageLayoutManager from '@/pages/Admin/HomepageLayoutManager';
import ProductSectionManagerUltraSimple from './ProductSectionManagerUltraSimple';
import PageManager from './PageManager';
import { QuickLinkManager } from './QuickLinkManager';
import SpecialSectionManager from './SpecialSectionManager';
import Xbox4AdminPage from './Xbox4AdminPage';
import { NavigationManager } from './NavigationManager';
import MasterProductManager from './MasterProductManager';
import PlatformManager from './PlatformManager';
import BulkProductUpload from './BulkProductUpload';
import ProductImageManager from '@/pages/Admin/ProductImageManager';
import StorageManager from './StorageManager';
import { SettingsManager } from './SettingsManager';
import PrimePagesAdmin from './PrimePagesAdmin';
import UTICoinsManager from './UTICoinsManager';
import { EmailManager } from './EmailManager/EmailManager';
import { Package, Image, Briefcase, Tag, Users, LayoutList, ListChecks, Globe, Link, Star, Gamepad2, Menu, X, Home, ArrowLeft, Navigation, Layers, Settings, Upload, ImagePlus, HardDrive, Cog, FileText, Coins, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('layout');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'layout', label: 'Layout Home', icon: LayoutList },
    { id: 'navigation', label: 'Navegação', icon: Navigation },
    { id: 'pages', label: 'Páginas', icon: Globe },
    { id: 'prime_pages', label: 'PÁGINAS PRIME', icon: FileText },
    { id: 'product_sections', label: 'Seções Produtos', icon: ListChecks },
    { id: 'special_sections', label: 'Seções Especiais', icon: Star },
    { id: 'xbox4_customization', label: 'Xbox 4 - Personalização', icon: Gamepad2 },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'bulk_upload', label: 'Importação em Massa', icon: Upload },
    { id: 'image_upload', label: 'Upload Fácil', icon: ImagePlus },
    { id: 'storage', label: 'Gerenciar Storage', icon: HardDrive },
    { id: 'skus', label: 'Sistema de SKUs', icon: Layers },
    { id: 'platforms', label: 'Plataformas', icon: Settings },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'quick_links', label: 'Links Rápidos', icon: Link },
    { id: 'services', label: 'Serviços', icon: Briefcase },
    { id: 'tags', label: 'Tags', icon: Tag },
    { id: 'uti_coins', label: 'UTI Coins', icon: Coins },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'users', label: 'Usuários/PRO', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Cog },
  ];

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-[#2C2C44] border-r border-[#343A40] flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#343A40]">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-white">
                Painel Admin
              </h2>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white hover:bg-[#343A40]"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-[#007BFF] text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-[#343A40]'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to Home Button */}
        <div className="p-2 border-t border-[#343A40]">
          <Button
            onClick={handleBackToHome}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#28A745] hover:bg-[#218838] text-white rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-medium">Voltar ao Site</span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#2C2C44] border-b border-[#343A40] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {menuItems.find(item => item.id === activeTab)?.label || 'Painel Administrativo'}
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Gerencie o conteúdo e as configurações do site UTI dos Games
              </p>
            </div>
            
            {/* Header Back Button */}
            <Button
              onClick={handleBackToHome}
              variant="outline"
              className="flex items-center gap-2 border-[#28A745] text-[#28A745] hover:bg-[#28A745] hover:text-white"
            >
              <Home className="w-4 h-4" />
              Voltar ao Site
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-[#1A1A2E] overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="layout" className="mt-0">
                <HomepageLayoutManager />
              </TabsContent>

              <TabsContent value="navigation" className="mt-0">
                <NavigationManager />
              </TabsContent>

              <TabsContent value="pages" className="mt-0">
                <PageManager />
              </TabsContent>

              <TabsContent value="prime_pages" className="mt-0">
                <PrimePagesAdmin />
              </TabsContent>

              <TabsContent value="product_sections" className="mt-0">
                <ProductSectionManagerUltraSimple />
              </TabsContent>

              <TabsContent value="special_sections" className="mt-0">
                <SpecialSectionManager />
              </TabsContent>

              <TabsContent value="xbox4_customization" className="mt-0">
                <Xbox4AdminPage />
              </TabsContent>

              <TabsContent value="products" className="mt-0">
                <ProductManager />
              </TabsContent>

              <TabsContent value="bulk_upload" className="mt-0">
                <BulkProductUpload />
              </TabsContent>

              <TabsContent value="image_upload" className="mt-0">
                <ProductImageManager />
              </TabsContent>

              <TabsContent value="storage" className="mt-0">
                <StorageManager />
              </TabsContent>

              <TabsContent value="skus" className="mt-0">
                <MasterProductManager />
              </TabsContent>

              <TabsContent value="platforms" className="mt-0">
                <PlatformManager />
              </TabsContent>

              <TabsContent value="banners" className="mt-0">
                <BannerManagerNew />
              </TabsContent>

              <TabsContent value="quick_links" className="mt-0">
                <QuickLinkManager />
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <ServiceCardManager />
              </TabsContent>

              <TabsContent value="tags" className="mt-0">
                <TagManager />
              </TabsContent>

              <TabsContent value="uti_coins" className="mt-0">
                <UTICoinsManager />
              </TabsContent>

              <TabsContent value="emails" className="mt-0">
                <EmailManager />
              </TabsContent>

              <TabsContent value="users" className="mt-0">
                <UserSubscriptionManagement />
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <SettingsManager />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
