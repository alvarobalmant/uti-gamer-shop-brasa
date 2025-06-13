import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLayoutItemConfig, Xbox4FeaturedProductsConfig, ProductOverride, CardSettings, GridSettings } from '@/types/xbox4Admin';

interface Xbox4FeaturedProductsManagerProps {
  initialConfig: PageLayoutItemConfig | null;
  onSave: (config: PageLayoutItemConfig) => void;
}

const Xbox4FeaturedProductsManager: React.FC<Xbox4FeaturedProductsManagerProps> = ({ initialConfig, onSave }) => {
  // Products state
  const [products, setProducts] = useState<ProductOverride[]>([]);
  const [newProductId, setNewProductId] = useState('');

  // Card Settings state
  const [imageAspectRatio, setImageAspectRatio] = useState<string>('1:1');
  const [imageObjectFit, setImageObjectFit] = useState<string>('cover');
  const [cardLayout, setCardLayout] = useState<string>('compact');
  const [showBadges, setShowBadges] = useState(true);
  const [showPrices, setShowPrices] = useState(true);
  const [hoverEffects, setHoverEffects] = useState<string>('scale');

  // Grid Settings state
  const [columns, setColumns] = useState(3);
  const [gap, setGap] = useState('1rem');
  const [mobileBreakpoint, setMobileBreakpoint] = useState(1);
  const [tabletBreakpoint, setTabletBreakpoint] = useState(2);
  const [desktopBreakpoint, setDesktopBreakpoint] = useState(4);

  // Load initial config if available
  useEffect(() => {
    if (initialConfig && initialConfig.products) {
      const { products: productsConfig } = initialConfig.products;
      
      // Load products
      if (productsConfig.products && Array.isArray(productsConfig.products)) {
        setProducts(productsConfig.products);
      }
      
      // Load card settings
      if (productsConfig.cardSettings) {
        const { cardSettings } = productsConfig;
        setImageAspectRatio(cardSettings.imageAspectRatio || '1:1');
        setImageObjectFit(cardSettings.imageObjectFit || 'cover');
        setCardLayout(cardSettings.cardLayout || 'compact');
        setShowBadges(cardSettings.showBadges !== undefined ? cardSettings.showBadges : true);
        setShowPrices(cardSettings.showPrices !== undefined ? cardSettings.showPrices : true);
        setHoverEffects(cardSettings.hoverEffects || 'scale');
      }
      
      // Load grid settings
      if (productsConfig.gridSettings) {
        const { gridSettings } = productsConfig;
        setColumns(gridSettings.columns || 3);
        setGap(gridSettings.gap || '1rem');
        
        if (gridSettings.responsiveBreakpoints) {
          setMobileBreakpoint(gridSettings.responsiveBreakpoints.mobile || 1);
          setTabletBreakpoint(gridSettings.responsiveBreakpoints.tablet || 2);
          setDesktopBreakpoint(gridSettings.responsiveBreakpoints.desktop || 4);
        }
      }
    }
  }, [initialConfig]);

  const addProduct = () => {
    if (newProductId) {
      setProducts([...products, { productId: newProductId }]);
      setNewProductId('');
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: keyof ProductOverride, value: string) => {
    const updatedProducts = products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  const handleBadgeChange = (index: number, field: keyof ProductOverride['badge'], value: string) => {
    const updatedProducts = products.map((product, i) =>
      i === index
        ? { ...product, badge: { ...(product.badge || {}), [field]: value } }
        : product
    );
    setProducts(updatedProducts);
  };

  const handleSave = () => {
    // Prepare the configuration object according to the expected structure
    const productsConfig: Xbox4FeaturedProductsConfig = {
      products: products,
      cardSettings: {
        imageAspectRatio,
        imageObjectFit,
        cardLayout,
        showBadges,
        showPrices,
        hoverEffects
      },
      gridSettings: {
        columns,
        gap,
        responsiveBreakpoints: {
          mobile: mobileBreakpoint,
          tablet: tabletBreakpoint,
          desktop: desktopBreakpoint
        }
      }
    };

    // Create the full config object to be saved
    const config: PageLayoutItemConfig = {
      products: productsConfig
    };

    // Call the parent's onSave function
    onSave(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Produtos em Destaque</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Configure quais produtos aparecem nos cards principais da página /xbox4, incluindo overrides e opções de layout.</p>

        <h3 className="text-xl font-semibold mb-4">Produtos</h3>
        <div className="space-y-4 mb-6">
          {products.map((product, index) => (
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
                <Label htmlFor={`productId-${index}`}>ID do Produto</Label>
                <Input
                  id={`productId-${index}`}
                  value={product.productId}
                  onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                />

                <Label htmlFor={`imageUrl-${index}`}>URL da Imagem (Override)</Label>
                <Input
                  id={`imageUrl-${index}`}
                  value={product.imageUrl || ''}
                  onChange={(e) => handleProductChange(index, 'imageUrl', e.target.value)}
                />

                <Label htmlFor={`title-${index}`}>Título (Override)</Label>
                <Input
                  id={`title-${index}`}
                  value={product.title || ''}
                  onChange={(e) => handleProductChange(index, 'title', e.target.value)}
                />

                <Label htmlFor={`badgeText-${index}`}>Texto do Badge (Override)</Label>
                <Input
                  id={`badgeText-${index}`}
                  value={product.badge?.text || ''}
                  onChange={(e) => handleBadgeChange(index, 'text', e.target.value)}
                />

                <Label htmlFor={`badgeColor-${index}`}>Cor do Badge (Override)</Label>
                <Input
                  id={`badgeColor-${index}`}
                  value={product.badge?.color || ''}
                  onChange={(e) => handleBadgeChange(index, 'color', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Novo ID do Produto"
            value={newProductId}
            onChange={(e) => setNewProductId(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={addProduct}>
            <PlusCircle className="h-4 w-4 mr-2" /> Adicionar Produto
          </Button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Configurações de Layout do Card</h3>
        <div className="grid gap-4 py-4 mb-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageAspectRatio" className="text-right">Proporção da Imagem</Label>
            <Select value={imageAspectRatio} onValueChange={(value) => setImageAspectRatio(value)}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="16:9">16:9</SelectItem>
                <SelectItem value="1:1">1:1</SelectItem>
                <SelectItem value="3:4">3:4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageObjectFit" className="text-right">Ajuste da Imagem</Label>
            <Select value={imageObjectFit} onValueChange={(value) => setImageObjectFit(value)}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cover">Cover</SelectItem>
                <SelectItem value="contain">Contain</SelectItem>
                <SelectItem value="fill">Fill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cardLayout" className="text-right">Layout do Card</Label>
            <Select value={cardLayout} onValueChange={(value) => setCardLayout(value)}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compacto</SelectItem>
                <SelectItem value="detailed">Detalhado</SelectItem>
                <SelectItem value="minimal">Minimalista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showBadges" className="text-right">Mostrar Badges</Label>
            <Select value={showBadges.toString()} onValueChange={(value) => setShowBadges(value === 'true')}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="showPrices" className="text-right">Mostrar Preços</Label>
            <Select value={showPrices.toString()} onValueChange={(value) => setShowPrices(value === 'true')}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Sim</SelectItem>
                <SelectItem value="false">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hoverEffects" className="text-right">Efeitos Hover</Label>
            <Select value={hoverEffects} onValueChange={(value) => setHoverEffects(value)}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scale">Escala</SelectItem>
                <SelectItem value="lift">Levantar</SelectItem>
                <SelectItem value="glow">Brilho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Configurações de Grid</h3>
        <div className="grid gap-4 py-4 mb-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="columns" className="text-right">Colunas (Desktop)</Label>
            <Input id="columns" type="number" value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gap" className="text-right">Espaçamento (gap)</Label>
            <Input id="gap" value={gap} onChange={(e) => setGap(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mobileBreakpoint" className="text-right">Colunas (Mobile)</Label>
            <Input id="mobileBreakpoint" type="number" value={mobileBreakpoint} onChange={(e) => setMobileBreakpoint(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tabletBreakpoint" className="text-right">Colunas (Tablet)</Label>
            <Input id="tabletBreakpoint" type="number" value={tabletBreakpoint} onChange={(e) => setTabletBreakpoint(Number(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="desktopBreakpoint" className="text-right">Colunas (Desktop)</Label>
            <Input id="desktopBreakpoint" type="number" value={desktopBreakpoint} onChange={(e) => setDesktopBreakpoint(Number(e.target.value))} className="col-span-3" />
          </div>
        </div>

        <Button onClick={handleSave}>Salvar Todas as Configurações</Button>
      </CardContent>
    </Card>
  );
};

export default Xbox4FeaturedProductsManager;
