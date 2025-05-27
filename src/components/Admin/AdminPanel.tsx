
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Package, Tags, Image, Users, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TagManager } from './TagManager';
import { BannerManager } from './BannerManager';
import { ServiceCardManager } from './ServiceCardManager';
import UserSubscriptionManager from './UserSubscriptionManager';

export const AdminPanel = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à Loja
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
              <p className="text-gray-400">UTI DOS GAMES</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="destructive">
            Sair
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800 border-gray-700">
            <TabsTrigger value="products" className="text-white data-[state=active]:bg-red-600">
              <Package className="w-4 h-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="tags" className="text-white data-[state=active]:bg-red-600">
              <Tags className="w-4 h-4 mr-2" />
              Tags
            </TabsTrigger>
            <TabsTrigger value="banners" className="text-white data-[state=active]:bg-red-600">
              <Image className="w-4 h-4 mr-2" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-red-600">
              <Image className="w-4 h-4 mr-2" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-red-600">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gerenciamento de Produtos</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie o catálogo de produtos da loja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Funcionalidade em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <TagManager />
          </TabsContent>

          <TabsContent value="banners">
            <BannerManager />
          </TabsContent>

          <TabsContent value="services">
            <ServiceCardManager />
          </TabsContent>

          <TabsContent value="users">
            <UserSubscriptionManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
