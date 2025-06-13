import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePages, PageLayoutItem } from '@/hooks/usePages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { PlusCircle, XCircle, ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Xbox4AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { getPageBySlug, fetchPageLayout, updatePageLayout, loading, error } = usePages();
  const { products } = useProducts();
  const [xbox4PageId, setXbox4PageId] = useState<string | null>(null);
  const [pageLayoutItems, setPageLayoutItems] = useState<PageLayoutItem[]>([]);
  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  
  // Estado para gerenciar produtos em destaque
  const [selectedProducts, setSelectedProducts] = useState<Array<{
    productId: string;
    title?: string;
    imageUrl?: string;
  }>>([]);
  const [maxProducts, setMaxProducts] = useState(4);
  const [productTags, setProductTags] = useState('xbox, console');
  
  // Estado para novo produto a ser adicionado
  const [selectedProductId, setSelectedProductId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Filtrar produtos Xbox
  const xboxProducts = products.filter(product => 
    product.name.toLowerCase().includes('xbox') || 
    product.tags?.some(tag => tag.name.toLowerCase().includes('xbox'))
  );

  useEffect(() => {
    const loadPageData = async () => {
      setIsLoadingPageData(true);
      const page = getPageBySlug('xbox4');
      if (page) {
        setXbox4PageId(page.id);
        const layout = await fetchPageLayout(page.id);
        setPageLayoutItems(layout);
        
        // Carregar configurações existentes
        const featuredProductsSection = layout.find(item => item.section_key === 'xbox4_featured_products');
        if (featuredProductsSection && featuredProductsSection.section_config) {
          const config = featuredProductsSection.section_config;
          
          // Carregar produtos selecionados
          if (config.products && Array.isArray(config.products)) {
            setSelectedProducts(config.products);
          }
          
          // Carregar tags
          if (config.filter && config.filter.tagIds) {
            setProductTags(config.filter.tagIds.join(', '));
          }
          
          // Carregar máximo de produtos
          if (config.filter && config.filter.limit) {
            setMaxProducts(config.filter.limit);
          }
        }
      } else {
        console.error('Página /xbox4 não encontrada no Supabase.');
      }
      setIsLoadingPageData(false);
    };
    loadPageData();
  }, [getPageBySlug, fetchPageLayout]);

  const handleSaveConfiguration = async () => {
    if (!xbox4PageId) {
      console.error('xbox4PageId não disponível para salvar a configuração.');
      return;
    }

    const existingItem = pageLayoutItems.find(item => item.section_key === 'xbox4_featured_products');
    let updatedLayoutItems: Partial<PageLayoutItem>[];

    // Preparar configuração para salvar
    const config = {
      filter: {
        tagIds: productTags.split(',').map(tag => tag.trim()),
        limit: maxProducts
      },
      products: selectedProducts
    };

    if (existingItem) {
      // Atualizar item existente
      updatedLayoutItems = pageLayoutItems.map(item =>
        item.section_key === 'xbox4_featured_products'
          ? { ...item, section_config: config as any }
          : item
      );
    } else {
      // Adicionar novo item
      const newSection: PageLayoutItem = {
        id: `temp-${Date.now()}`,
        page_id: xbox4PageId,
        section_key: 'xbox4_featured_products',
        title: 'Produtos em Destaque',
        display_order: pageLayoutItems.length + 1,
        is_visible: true,
        section_type: 'products',
        section_config: config as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updatedLayoutItems = [...pageLayoutItems, newSection];
    }

    // IMPORTANTE: Solicitar autorização para atualizar o Supabase
    console.log(`Solicitando autorização para atualizar o Supabase para a seção xbox4_featured_products com a configuração:`, config);
    alert('Solicitação de atualização do Supabase para a Lovable criada no console. Por favor, encaminhe-a!');
    
    // Comentado para evitar alterações no banco sem autorização
    // await updatePageLayout(xbox4PageId, updatedLayoutItems);
    // setPageLayoutItems(updatedLayoutItems as PageLayoutItem[]); // Atualização otimista
  };

  const addProduct = () => {
    if (!selectedProductId) return;
    
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;
    
    const newProduct = {
      productId: selectedProductId,
      title: customTitle || product.name,
      imageUrl: customImageUrl || product.imageUrl
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    setSelectedProductId('');
    setCustomTitle('');
    setCustomImageUrl('');
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  if (isLoadingPageData) {
    return (
      <div className="p-6 text-center text-gray-400">
        Carregando configurações da página Xbox 4...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Erro ao carregar configurações: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Xbox 4 - Personalização</h1>
      <p className="text-lg text-gray-300 mb-8">Gerencie o conteúdo exclusivo da página /xbox4.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="products">Produtos em Destaque</TabsTrigger>
          <TabsTrigger value="news">Notícias e Trailers</TabsTrigger>
          <TabsTrigger value="offers">Ofertas Especiais</TabsTrigger>
          <TabsTrigger value="banners">Banners Secundários</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Produtos em Destaque</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure os produtos que aparecem nos cards principais da página /xbox4.</p>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product-tags" className="text-right">
                    Tags de Produtos
                  </Label>
                  <Input 
                    id="product-tags" 
                    className="col-span-3" 
                    value={productTags}
                    onChange={(e) => setProductTags(e.target.value)}
                    placeholder="xbox, console, etc."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="max-products" className="text-right">
                    Máximo de Produtos
                  </Label>
                  <Input 
                    id="max-products" 
                    className="col-span-3" 
                    type="number"
                    value={maxProducts}
                    onChange={(e) => setMaxProducts(parseInt(e.target.value))}
                    min={1}
                    max={12}
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mt-6 mb-4">Produtos Selecionados</h3>
              
              <div className="space-y-4 mb-6">
                {selectedProducts.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={index} className="border p-4 rounded-md relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        onClick={() => removeProduct(index)}
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <div className="aspect-square bg-gray-800 rounded-md overflow-hidden">
                            <img 
                              src={item.imageUrl || product?.imageUrl || '/placeholder.png'} 
                              alt={item.title || product?.name || 'Produto'} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="col-span-3">
                          <p><strong>Produto:</strong> {product?.name || 'Produto não encontrado'}</p>
                          <p><strong>Título Personalizado:</strong> {item.title || 'Nenhum'}</p>
                          <p><strong>Imagem Personalizada:</strong> {item.imageUrl ? 'Sim' : 'Não'}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {selectedProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhum produto selecionado. Adicione produtos abaixo.
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mt-6 mb-4">Adicionar Produto</h3>
              
              <div className="grid gap-4 py-4 border-t pt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product-select" className="text-right">
                    Selecionar Produto
                  </Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {xboxProducts.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="custom-title" className="text-right">
                    Título Personalizado
                  </Label>
                  <Input 
                    id="custom-title" 
                    className="col-span-3" 
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Opcional - deixe em branco para usar o título original"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="custom-image" className="text-right">
                    URL da Imagem
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="custom-image" 
                      className="flex-1" 
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      placeholder="Opcional - deixe em branco para usar a imagem original"
                    />
                    <Button variant="outline" size="icon" disabled>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Button 
                  onClick={addProduct} 
                  className="ml-auto"
                  disabled={!selectedProductId}
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Produto
                </Button>
              </div>
              
              <Button 
                onClick={handleSaveConfiguration} 
                className="w-full mt-6"
              >
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Notícias e Trailers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Aqui você poderá escolher ou cadastrar as notícias e trailers que aparecem na seção de notícias da página /xbox4.</p>
              {/* Implementar lógica de gerenciamento de notícias/trailers aqui */}
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="news-title" className="text-right">
                    Título da Notícia/Trailer
                  </Label>
                  <Input id="news-title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="news-description" className="text-right">
                    Descrição
                  </Label>
                  <Input id="news-description" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="news-image" className="text-right">
                    URL da Imagem
                  </Label>
                  <Input id="news-image" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="news-type" className="text-right">
                    Tipo
                  </Label>
                  <Input id="news-type" placeholder="news|trailer|event" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="news-link" className="text-right">
                    Link
                  </Label>
                  <Input id="news-link" className="col-span-3" />
                </div>
              </div>
              <Button type="submit">Adicionar Notícia/Trailer</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Ofertas Especiais</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure as ofertas especiais que aparecem na página /xbox4.</p>
              {/* Implementar lógica de gerenciamento de ofertas aqui */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Banners Secundários</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Configure os banners secundários que aparecem na página /xbox4.</p>
              {/* Implementar lógica de gerenciamento de banners aqui */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Xbox4AdminPage;
