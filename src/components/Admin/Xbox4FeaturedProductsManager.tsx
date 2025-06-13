
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { usePages } from '@/hooks/usePages';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/hooks/useProducts';
import { PageLayoutItem } from '@/hooks/usePages';
import { Plus, X, Save, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Xbox4ProductConfig {
  productId: string;
  customTitle?: string;
  customImage?: string;
  customDescription?: string;
  displayOrder: number;
}

const Xbox4FeaturedProductsManager: React.FC = () => {
  const { products } = useProducts();
  const { getPageBySlug, updatePageLayout, pageLayouts, fetchPageLayout } = usePages();
  const { toast } = useToast();
  
  const [selectedProducts, setSelectedProducts] = useState<Xbox4ProductConfig[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const xbox4Page = getPageBySlug('xbox4');

  // Load current configuration
  useEffect(() => {
    const loadCurrentConfig = async () => {
      if (!xbox4Page?.id) return;

      try {
        await fetchPageLayout(xbox4Page.id);
        const layout = pageLayouts[xbox4Page.id];
        
        if (layout) {
          const featuredSection = layout.find(
            section => section.section_key === 'xbox4_featured_products'
          );
          
          if (featuredSection?.sectionConfig?.products) {
            setSelectedProducts(featuredSection.sectionConfig.products);
          }
        }
      } catch (error) {
        console.error('Error loading Xbox4 configuration:', error);
      }
    };

    loadCurrentConfig();
  }, [xbox4Page, fetchPageLayout, pageLayouts]);

  const handleAddProduct = (product: Product) => {
    if (selectedProducts.find(p => p.productId === product.id)) {
      toast({
        title: "Produto já adicionado",
        description: "Este produto já está na lista de produtos em destaque.",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Xbox4ProductConfig = {
      productId: product.id,
      customTitle: product.name,
      displayOrder: selectedProducts.length + 1,
    };

    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.filter(p => p.productId !== productId)
        .map((p, index) => ({ ...p, displayOrder: index + 1 }))
    );
  };

  const handleUpdateProduct = (productId: string, updates: Partial<Xbox4ProductConfig>) => {
    setSelectedProducts(prev => 
      prev.map(p => p.productId === productId ? { ...p, ...updates } : p)
    );
  };

  const handleSaveConfiguration = async () => {
    if (!xbox4Page?.id) {
      toast({
        title: "Erro",
        description: "Página Xbox4 não encontrada.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const layout = pageLayouts[xbox4Page.id] || [];
      const updatedLayout = layout.map(section => {
        if (section.section_key === 'xbox4_featured_products') {
          return {
            ...section,
            sectionConfig: {
              ...section.sectionConfig,
              products: selectedProducts,
              filter: {
                ...section.sectionConfig?.filter,
                limit: selectedProducts.length,
              },
            },
          };
        }
        return section;
      });

      await updatePageLayout(xbox4Page.id, updatedLayout);
      
      toast({
        title: "Configuração salva!",
        description: "Os produtos em destaque da página Xbox4 foram atualizados.",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a configuração.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const availableProducts = products.filter(product => 
    product.platform?.toLowerCase().includes('xbox') ||
    product.category?.toLowerCase().includes('xbox') ||
    product.name.toLowerCase().includes('xbox')
  );

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Gerenciador de Produtos Xbox4</CardTitle>
          <CardDescription className="text-gray-400">
            Configure os produtos em destaque na página Xbox4. Selecione produtos, personalize títulos e imagens.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Produtos Selecionados ({selectedProducts.length})
              </h3>
              <div className="flex gap-2">
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Preview dos Produtos Xbox4</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {selectedProducts.map(config => {
                        const product = getProductById(config.productId);
                        if (!product) return null;
                        
                        return (
                          <div key={config.productId} className="border rounded-lg p-4 bg-white">
                            <img
                              src={config.customImage || product.image}
                              alt={config.customTitle || product.name}
                              className="w-full h-48 object-cover rounded mb-3"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                            <h4 className="font-semibold text-sm mb-2">
                              {config.customTitle || product.name}
                            </h4>
                            <p className="text-green-600 font-bold">
                              R$ {product.price.toFixed(2)}
                            </p>
                            {config.customDescription && (
                              <p className="text-sm text-gray-600 mt-2">
                                {config.customDescription}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleSaveConfiguration}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar Configuração'}
                </Button>
              </div>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhum produto selecionado ainda.</p>
                <p className="text-sm mt-1">Use a seção abaixo para adicionar produtos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProducts
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((config, index) => {
                    const product = getProductById(config.productId);
                    if (!product) return null;

                    return (
                      <div key={config.productId} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={config.customImage || product.image}
                            alt={config.customTitle || product.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary">#{config.displayOrder}</Badge>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveProduct(config.productId)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <Label className="text-gray-300">Título Personalizado</Label>
                                <Input
                                  value={config.customTitle || ''}
                                  onChange={(e) => handleUpdateProduct(config.productId, { 
                                    customTitle: e.target.value 
                                  })}
                                  placeholder={product.name}
                                  className="bg-gray-600 text-white border-gray-500"
                                />
                              </div>

                              <div>
                                <Label className="text-gray-300">Imagem Personalizada (URL)</Label>
                                <Input
                                  value={config.customImage || ''}
                                  onChange={(e) => handleUpdateProduct(config.productId, { 
                                    customImage: e.target.value 
                                  })}
                                  placeholder="URL da imagem personalizada"
                                  className="bg-gray-600 text-white border-gray-500"
                                />
                              </div>
                            </div>

                            <div>
                              <Label className="text-gray-300">Descrição Personalizada</Label>
                              <Input
                                value={config.customDescription || ''}
                                onChange={(e) => handleUpdateProduct(config.productId, { 
                                  customDescription: e.target.value 
                                })}
                                placeholder="Descrição personalizada (opcional)"
                                className="bg-gray-600 text-white border-gray-500"
                              />
                            </div>

                            <div className="text-sm text-gray-400">
                              <p><strong>Produto Original:</strong> {product.name}</p>
                              <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Available Products */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">
              Produtos Xbox Disponíveis ({availableProducts.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {availableProducts.map(product => {
                const isSelected = selectedProducts.some(p => p.productId === product.id);
                
                return (
                  <div 
                    key={product.id} 
                    className={`border rounded-lg p-3 ${
                      isSelected 
                        ? 'bg-green-900 border-green-600' 
                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    
                    <h4 className="font-medium text-white text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h4>
                    
                    <p className="text-green-400 font-semibold mb-2">
                      R$ {product.price.toFixed(2)}
                    </p>

                    <Button
                      size="sm"
                      variant={isSelected ? "secondary" : "default"}
                      onClick={() => handleAddProduct(product)}
                      disabled={isSelected}
                      className="w-full"
                    >
                      {isSelected ? (
                        'Selecionado'
                      ) : (
                        <>
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Xbox4FeaturedProductsManager;
