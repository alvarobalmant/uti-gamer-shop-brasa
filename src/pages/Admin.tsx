import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomepageLayoutManager } from "./HomepageLayoutManager";
import { ProductSectionsManager } from "./ProductSectionsManager";
import TopDealsManager from "./TopDealsManager";

const Admin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      
      <Tabs defaultValue="layout" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Layout da Home</TabsTrigger>
          <TabsTrigger value="products">Seções de Produtos</TabsTrigger>
          <TabsTrigger value="deals">Ofertas Especiais</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout" className="space-y-6">
          <HomepageLayoutManager />
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <ProductSectionsManager />
        </TabsContent>
        
        <TabsContent value="deals" className="space-y-6">
          <TopDealsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
