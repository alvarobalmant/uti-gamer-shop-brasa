import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProductsEnhanced } from '@/hooks/useProductsEnhanced';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Settings2, Save, RotateCcw } from 'lucide-react';
import { UTIProSettings } from './UTIProSettings';
import { SiteAppearanceSettings } from './SiteAppearanceSettings';
import { ProductManagementSettings } from './ProductManagementSettings';

export const SettingsManagerNew = () => {
  const { toast } = useToast();
  const { products, refreshProducts } = useProductsEnhanced();
  const { siteInfo, utiProSettings, updateSiteInfo, updateUTIProSettings, loading } = useSiteSettings();
  
  // Estados locais para o formulário
  const [utiProEnabled, setUtiProEnabled] = useState(utiProSettings.enabled);
  const [siteName, setSiteName] = useState(siteInfo.siteName);
  const [siteSubtitle, setSiteSubtitle] = useState(siteInfo.siteSubtitle);
  const [browserTitle, setBrowserTitle] = useState(siteInfo.browserTitle);
  const [selectedFont, setSelectedFont] = useState(siteInfo.selectedFont);
  const [logoUrl, setLogoUrl] = useState(siteInfo.logoUrl);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Loading states
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setSaving] = useState(false);

  // Atualizar estados locais quando as configurações mudarem
  React.useEffect(() => {
    setUtiProEnabled(utiProSettings.enabled);
    setSiteName(siteInfo.siteName);
    setSiteSubtitle(siteInfo.siteSubtitle);
    setBrowserTitle(siteInfo.browserTitle);
    setSelectedFont(siteInfo.selectedFont);
    setLogoUrl(siteInfo.logoUrl);
  }, [siteInfo, utiProSettings]);

  // Deletar todos os produtos
  const handleDeleteAllProducts = useCallback(async () => {
    if (products.length === 0) {
      toast({
        title: "Nenhum produto encontrado",
        description: "Não há produtos para deletar.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      await supabase
        .from('product_tags')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      await refreshProducts();
      
      toast({
        title: "Produtos deletados",
        description: `Todos os ${products.length} produtos foram deletados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao deletar produtos:', error);
      toast({
        title: "Erro ao deletar produtos",
        description: "Ocorreu um erro ao deletar os produtos. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  }, [products, refreshProducts, toast]);

  // Deletar produtos selecionados
  const handleDeleteSelectedProducts = useCallback(async () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Nenhum produto selecionado",
        description: "Selecione os produtos que deseja deletar.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (error) throw error;

      await supabase
        .from('product_tags')
        .delete()
        .in('product_id', selectedProducts);

      await refreshProducts();
      setSelectedProducts([]);
      
      toast({
        title: "Produtos deletados",
        description: `${selectedProducts.length} produtos foram deletados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao deletar produtos selecionados:', error);
      toast({
        title: "Erro ao deletar produtos",
        description: "Ocorreu um erro ao deletar os produtos selecionados. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  }, [selectedProducts, refreshProducts, toast]);

  // Salvar configurações
  const handleSaveSettings = useCallback(async () => {
    setSaving(true);
    try {
      const siteInfoSuccess = await updateSiteInfo({
        siteName,
        siteSubtitle,
        browserTitle,
        selectedFont,
        logoUrl
      });

      const utiProSuccess = await updateUTIProSettings({
        enabled: utiProEnabled
      });

      if (siteInfoSuccess && utiProSuccess) {
        toast({
          title: "Configurações salvas",
          description: "As configurações foram salvas com sucesso no banco de dados.",
        });
      } else {
        throw new Error('Falha ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações no banco de dados.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, [siteName, siteSubtitle, browserTitle, selectedFont, logoUrl, utiProEnabled, updateSiteInfo, updateUTIProSettings, toast]);

  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p.id));
  };

  const deselectAllProducts = () => {
    setSelectedProducts([]);
  };

  if (loading) {
    return <div className="text-center p-8">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-6 h-6 text-primary" />
        <h2 className="text-3xl font-bold text-foreground">Configurações Gerais</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UTIProSettings
          utiProEnabled={utiProEnabled}
          setUtiProEnabled={setUtiProEnabled}
        />

        <SiteAppearanceSettings
          siteName={siteName}
          setSiteName={setSiteName}
          siteSubtitle={siteSubtitle}
          setSiteSubtitle={setSiteSubtitle}
          browserTitle={browserTitle}
          setBrowserTitle={setBrowserTitle}
          selectedFont={selectedFont}
          setSelectedFont={setSelectedFont}
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
        />
      </div>

      <ProductManagementSettings
        products={products}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        isDeleting={isDeleting}
        handleDeleteAllProducts={handleDeleteAllProducts}
        handleDeleteSelectedProducts={handleDeleteSelectedProducts}
        handleProductSelection={handleProductSelection}
        selectAllProducts={selectAllProducts}
        deselectAllProducts={deselectAllProducts}
      />

      {/* Salvar configurações */}
      <div className="flex gap-4">
        <Button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Recarregar Página
        </Button>
      </div>
    </div>
  );
};