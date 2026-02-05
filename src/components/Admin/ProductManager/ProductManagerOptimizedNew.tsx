import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Package, TrendingUp, AlertCircle, Zap } from 'lucide-react';
import { useProductsPaginated } from '@/hooks/useProductsPaginated';
import { useTags } from '@/hooks/useTags';
import ProductListVirtualized from './ProductListVirtualized';
import ProductEditor from '../ProductEditor/ProductEditor';
import { Product } from '@/hooks/useProducts';
import { useDebouncedCallback } from '@/hooks/useDebounce';

const ProductManagerOptimized = () => {
  const {
    products, totalProducts, displayedProducts, loading, showLoadAll, isShowingAll,
    filters, hasActiveFilters, setSearch, setTagFilter, loadAllProducts, clearFilters,
    addProduct, updateProduct, deleteProduct
  } = useProductsPaginated();

  const { tags } = useTags();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const debouncedSetSearch = useDebouncedCallback((value: string) => setSearch(value), 300);

  const statistics = useMemo(() => ({
    total: totalProducts,
    active: products.filter(p => p.stock && p.stock > 0).length,
    lowStock: products.filter(p => p.stock && p.stock <= 5 && p.stock > 0).length,
    outOfStock: products.filter(p => !p.stock || p.stock === 0).length
  }), [products, totalProducts]);

  const handleFormSubmit = useCallback(async (productData: any) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  }, [editingProduct, addProduct, updateProduct]);

  if (showForm) {
    return (
      <ProductEditor
        product={editingProduct}
        tags={tags}
        onSubmit={handleFormSubmit}
        onCancel={() => { setShowForm(false); setEditingProduct(null); }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {displayedProducts > 100 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Modo de Alto Desempenho Ativo</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold">{statistics.total}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Em Estoque</p>
                <p className="text-3xl font-bold">{statistics.active}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Estoque Baixo</p>
                <p className="text-3xl font-bold">{statistics.lowStock}</p>
              </div>
              <AlertCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Sem Estoque</p>
                <p className="text-3xl font-bold">{statistics.outOfStock}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background border shadow-lg">
        <CardHeader className="bg-muted/50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Package className="h-7 w-7 text-primary" />
                Gerenciamento de Produtos
              </CardTitle>
              <CardDescription className="mt-2">Performance otimizada</CardDescription>
            </div>
            <Button onClick={() => { setEditingProduct(null); setShowForm(true); }} size="lg">
              <Plus className="w-5 h-5 mr-2" />Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Buscar produtos..." defaultValue={filters.search} onChange={(e) => debouncedSetSearch(e.target.value)} className="pl-12 h-12" />
            </div>
          </div>
          <ProductListVirtualized
            products={products}
            loading={loading}
            onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
            onDelete={(id) => { if (confirm('Excluir?')) deleteProduct(id); }}
            height={Math.min(800, Math.max(400, products.length * 180))}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagerOptimized;