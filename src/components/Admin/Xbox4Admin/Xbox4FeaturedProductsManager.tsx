
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLayoutItemConfig, ProductOverride } from '@/types/xbox4Admin';
import { useProducts } from '@/hooks/useProducts';

interface Xbox4FeaturedProductsManagerProps {
  initialConfig: PageLayoutItemConfig | null;
  onSave: (config: PageLayoutItemConfig) => void;
  sectionTitle?: string;
  defaultTags?: string[];
}

const Xbox4FeaturedProductsManager: React.FC<Xbox4FeaturedProductsManagerProps> = ({ 
  initialConfig, 
  onSave, 
  sectionTitle = "Produtos em Destaque",
  defaultTags = ['xbox', 'console'] 
}) => {
  const { products } = useProducts();
  
  // Simple state for the new structure
  const [selectedProducts, setSelectedProducts] = useState<ProductOverride[]>([]);
  const [tagIds, setTagIds] = useState<string[]>(defaultTags);
  const [limit, setLimit] = useState(4);
  
  // Form state for adding new products
  const [newProductId, setNewProductId] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Filter Xbox products for the dropdown
  const xboxProducts = products.filter(product => 
    product.name.toLowerCase().includes('xbox') || 
    product.tags?.some(tag => tag.name.toLowerCase().includes('xbox'))
  );

  // Load initial config if available
  useEffect(() => {
    if (initialConfig) {
      // Load products from the new simple structure
      if (initialConfig.products && Array.isArray(initialConfig.products)) {
        setSelectedProducts(initialConfig.products);
      }
      
      // Load filter settings
      if (initialConfig.filter) {
        if (initialConfig.filter.tagIds) {
          setTagIds(initialConfig.filter.tagIds);
        }
        if (initialConfig.filter.limit) {
          setLimit(initialConfig.filter.limit);
        }
      }
    }
  }, [initialConfig]);

  const addProduct = () => {
    if (!newProductId) return;
    
    const product = products.find(p => p.id === newProductId);
    if (!product) return;
    
    const newProduct: ProductOverride = {
      productId: newProductId,
      title: customTitle || undefined,
      imageUrl: customImageUrl || undefined
    };
    
    setSelectedProducts([...selectedProducts, newProduct]);
    setNewProductId('');
    setCustomTitle('');
    setCustomImageUrl('');
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof ProductOverride, value: string) => {
    const updatedProducts = selectedProducts.map((product, i) =>
      i === index ? { ...product, [field]: value || undefined } : product
    );
    setSelectedProducts(updatedProducts);
  };

  const handleSave = () => {
    // Create the configuration object with the new simple structure
    const config: PageLayoutItemConfig = {
      filter: {
        tagIds: tagIds,
        limit: limit
      },
      products: selectedProducts
    };

    // Call the parent's onSave function
    onSave(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar {sectionTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Configure quais produtos aparecem na seção {sectionTitle} da página /xbox4, incluindo títulos e imagens personalizadas.</p>

        <h3 className="text-xl font-semibold mb-4">Configurações Gerais</h3>
        <div className="grid gap-4 py-4 mb-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">Tags (fallback)</Label>
            <Input 
              id="tags" 
              value={tagIds.join(', ')} 
              onChange={(e) => setTagIds(e.target.value.split(',').map(t => t.trim()))}
              className="col-span-3" 
              placeholder="xbox, console"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="limit" className="text-right">Limite de produtos</Label>
            <Input 
              id="limit" 
              type="number" 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))}
              className="col-span-3" 
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Produtos Específicos</h3>
        <div className="space-y-4 mb-6">
          {selectedProducts.map((product, index) => {
            const productData = products.find(p => p.id === product.productId);
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
                <div className="grid gap-2">
                  <Label>Produto: {productData?.name || 'Produto não encontrado'}</Label>
                  
                  <Label htmlFor={`title-${index}`}>Título Personalizado</Label>
                  <Input
                    id={`title-${index}`}
                    value={product.title || ''}
                    onChange={(e) => handleProductChange(index, 'title', e.target.value)}
                    placeholder="Deixe vazio para usar o título original"
                  />

                  <Label htmlFor={`imageUrl-${index}`}>URL da Imagem Personalizada</Label>
                  <Input
                    id={`imageUrl-${index}`}
                    value={product.imageUrl || ''}
                    onChange={(e) => handleProductChange(index, 'imageUrl', e.target.value)}
                    placeholder="Deixe vazio para usar a imagem original"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="text-xl font-semibold mb-4">Adicionar Produto</h3>
        <div className="grid gap-4 py-4 border-t pt-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product-select" className="text-right">Selecionar Produto</Label>
            <Select value={newProductId} onValueChange={setNewProductId}>
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
            <Label htmlFor="custom-title" className="text-right">Título Personalizado</Label>
            <Input 
              id="custom-title" 
              className="col-span-3" 
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Opcional - deixe em branco para usar o título original"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="custom-image" className="text-right">URL da Imagem</Label>
            <Input 
              id="custom-image" 
              className="col-span-3" 
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              placeholder="Opcional - deixe em branco para usar a imagem original"
            />
          </div>
          
          <Button 
            onClick={addProduct} 
            className="ml-auto"
            disabled={!newProductId}
          >
            <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Produto
          </Button>
        </div>

        <Button onClick={handleSave} className="w-full mt-6">
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  );
};

export default Xbox4FeaturedProductsManager;
