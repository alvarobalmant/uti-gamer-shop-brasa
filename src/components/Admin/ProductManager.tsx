
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useProducts, Product } from '@/hooks/useProducts';
import { useTags, Tag } from '@/hooks/useTags';
import ProductList from './ProductManager/ProductList';
import ProductForm from './ProductManager/ProductForm';

const ProductManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct, fetchProducts } = useProducts(); 
  const { tags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesTag = 
      !selectedTagId || 
      (Array.isArray(product.tags) && product.tags.some((tag: Tag) => tag.id === selectedTagId));
      
    return matchesSearch && matchesTag;
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

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

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        tags={tags}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Gerenciamento de Produtos</CardTitle>
            <CardDescription className="text-gray-400">
              Gerencie o catálogo de produtos da loja
            </CardDescription>
          </div>
          <Button onClick={handleCreateProduct} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={selectedTagId}
              onChange={(e) => setSelectedTagId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white h-10"
            >
              <option value="">Todas as Tags</option>
              {Array.isArray(tags) && tags.map((tag: Tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ProductList
          products={filteredProducts}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </CardContent>
    </Card>
  );
};

export default ProductManager;
