
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Xbox4FeaturedProductsManager from '@/components/Admin/Xbox4FeaturedProductsManager';
import { useAuth } from '@/hooks/useAuth';
import { LoginPage } from '@/components/Auth/LoginPage';
import { Package, Settings, BarChart3 } from 'lucide-react';

const Xbox4AdminPage: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Acesso Negado</h1>
          <p className="text-gray-400">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Administração Xbox4
          </h1>
          <p className="text-gray-300">
            Gerencie o conteúdo e configurações específicas da página Xbox4
          </p>
        </div>

        <Tabs defaultValue="featured-products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="featured-products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produtos em Destaque
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Layout da Página
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured-products">
            <Xbox4FeaturedProductsManager />
          </TabsContent>

          <TabsContent value="layout">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações de Layout</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure o layout geral da página Xbox4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <p>Configurações de layout em desenvolvimento...</p>
                  <p className="text-sm mt-1">
                    Use o painel principal de administração para gerenciar o layout das páginas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Relatórios Xbox4</CardTitle>
                <CardDescription className="text-gray-400">
                  Visualize métricas e performance da página Xbox4
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <p>Relatórios em desenvolvimento...</p>
                  <p className="text-sm mt-1">
                    Em breve você poderá visualizar métricas de acesso e conversão.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Xbox4AdminPage;
