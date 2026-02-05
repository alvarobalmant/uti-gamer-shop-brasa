import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Package, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import { useProductsAdmin } from '@/hooks/useProductsEnhanced';
import { useTags } from '@/hooks/useTags';
import ProductList from './ProductManager/ProductListNew';
import ProductEditor from './ProductEditor/ProductEditor';
import { Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';

const ProductManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProductsAdmin();
  const { tags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || product.tags?.some(tag => tag.id === selectedTag);
    return matchesSearch && matchesTag;
  });

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.stock && p.stock > 0).length;
  const lowStockProducts = products.filter(p => p.stock && p.stock <= 5 && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => !p.stock || p.stock === 0).length;

  const handleFormSubmit = async (productData: any) => {
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
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Produtos</p>
                <p className="text-3xl font-bold">{totalProducts}</p>
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
                <p className="text-3xl font-bold">{activeProducts}</p>
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
                <p className="text-3xl font-bold">{lowStockProducts}</p>
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
                <p className="text-3xl font-bold">{outOfStockProducts}</p>
              </div>
              <Package className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-0 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Package className="h-7 w-7 text-blue-600" />
                Gerenciamento de Produtos
              </CardTitle>
              <CardDescription className="mt-2">Gerencie o catálogo de produtos</CardDescription>
            </div>
            <Button onClick={() => { setEditingProduct(null); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700" size="lg">
              <Plus className="w-5 h-5 mr-2" />Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Buscar produtos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-12 h-12" />
              </div>
            </div>
          </div>
          <ProductList products={filteredProducts} loading={loading} onEdit={(p) => { setEditingProduct(p); setShowForm(true); }} onDelete={(id) => { if (confirm('Excluir?')) deleteProduct(id); }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;