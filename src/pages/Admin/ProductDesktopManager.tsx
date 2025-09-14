import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useProducts } from '@/hooks/useProducts';
import { useProductSpecifications } from '@/hooks/useProductSpecifications';
import { Search, Edit, Save, Plus, Monitor, Package, RotateCcw, Grid3X3, Grid2X2, Check, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import ProductDesktopEditor from '@/components/Admin/ProductDesktopManager/ProductDesktopEditor';
import { supabase } from '@/integrations/supabase/client';

const ProductDesktopManager: React.FC = () => {
  const { products, loading, updateProduct, refreshProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [gridMode, setGridMode] = useState<'2x2' | '3x3'>('3x3');
  const [showReviewed, setShowReviewed] = useState(true);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReviewFilter = showReviewed || !product.is_reviewed;
    
    return matchesSearch && matchesReviewFilter;
  });

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      await updateProduct(selectedProduct.id, productData);
      toast.success('Produto atualizado com sucesso!');
      setIsEditorOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Erro ao atualizar produto');
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleToggleReviewed = async (product: any) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const newReviewedState = !product.is_reviewed;
      
      const { error } = await supabase
        .from('products')
        .update({
          is_reviewed: newReviewedState,
          reviewed_at: newReviewedState ? new Date().toISOString() : null,
          reviewed_by: newReviewedState ? userData.user?.id : null
        })
        .eq('id', product.id);

      if (error) throw error;
      
      await refreshProducts();
      toast.success(newReviewedState ? 'Produto marcado como revisado!' : 'Marcação de revisão removida!');
    } catch (error) {
      toast.error('Erro ao atualizar status de revisão');
      console.error('Erro ao marcar produto:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-muted rounded mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revisão Fácil - Produtos</h1>
            <p className="text-muted-foreground">
              Revise e configure informações detalhadas dos produtos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            {filteredProducts.length} produtos
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant={gridMode === '2x2' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridMode('2x2')}
            >
              <Grid2X2 className="h-4 w-4 mr-2" />
              2x2
            </Button>
            <Button
              variant={gridMode === '3x3' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridMode('3x3')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              3x3
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar e Filtrar Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Buscar por nome, marca ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <div className="flex items-center gap-2">
              {showReviewed ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <label className="text-sm font-medium">
                Mostrar revisados
              </label>
              <Switch
                checked={showReviewed}
                onCheckedChange={setShowReviewed}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className={`grid gap-4 ${gridMode === '2x2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {filteredProducts.map((product) => (
          <ProductDesktopCard
            key={product.id}
            product={product}
            onEdit={handleEditProduct}
            onToggleReviewed={handleToggleReviewed}
            gridMode={gridMode}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar os termos da pesquisa
            </p>
          </CardContent>
        </Card>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 gap-0">
          <DialogHeader className="p-6 pb-2 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Editar Produto Desktop: {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedProduct && (
              <ProductDesktopEditor
                product={selectedProduct}
                onSave={handleSaveProduct}
                onCancel={() => setIsEditorOpen(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Product Card Component
const ProductDesktopCard: React.FC<{
  product: any;
  onEdit: (product: any) => void;
  onToggleReviewed: (product: any) => void;
  gridMode: '2x2' | '3x3';
}> = ({ product, onEdit, onToggleReviewed, gridMode }) => {
  const { categorizedSpecs } = useProductSpecifications(product.id, 'desktop', product);

  return (
    <Card className={`transition-all hover:shadow-md relative ${
      product.is_reviewed ? 'border-green-500 border-2' : ''
    }`}>
      {/* Reviewed Indicator */}
      {product.is_reviewed && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 z-10">
          <Check className="h-3 w-3" />
        </div>
      )}
      
      <CardContent className={gridMode === '2x2' ? 'p-4' : 'p-3'}>
        <div className={gridMode === '2x2' ? 'flex items-start gap-4' : 'space-y-3'}>
          {/* Product Image */}
          <div className={`bg-muted rounded-lg overflow-hidden flex-shrink-0 ${
            gridMode === '2x2' ? 'w-20 h-20' : 'w-full h-32'
          }`}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className={`text-muted-foreground ${
                  gridMode === '2x2' ? 'h-6 w-6' : 'h-8 w-8'
                }`} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className={gridMode === '2x2' ? 'flex-1 min-w-0' : 'w-full'}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-foreground truncate ${
                  gridMode === '2x2' ? 'text-base' : 'text-sm'
                }`}>
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {product.category || 'Sem categoria'}
                  </Badge>
                  {gridMode === '2x2' && (
                    <span className="text-xs text-muted-foreground truncate">
                      {product.brand || 'A definir'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(product)}
                className="flex-1"
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
              <Button
                variant={product.is_reviewed ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleReviewed(product)}
                className={product.is_reviewed ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>

            {/* Quick Stats - only in 2x2 mode */}
            {gridMode === '2x2' && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-center p-2 bg-muted/50 rounded text-xs">
                  <div className="font-medium">
                    R$ {Number(product.price || 0).toFixed(2)}
                  </div>
                  <div className="text-muted-foreground">Preço</div>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded text-xs">
                  <div className="font-medium">
                    {product.stock || 0}
                  </div>
                  <div className="text-muted-foreground">Estoque</div>
                </div>
              </div>
            )}

            {/* Compact stats for 3x3 mode */}
            {gridMode === '3x3' && (
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>R$ {Number(product.price || 0).toFixed(2)}</span>
                <span>Est: {product.stock || 0}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDesktopManager;