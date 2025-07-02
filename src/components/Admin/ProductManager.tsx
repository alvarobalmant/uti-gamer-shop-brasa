
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useTags } from '@/hooks/useTags';
import ProductList from './ProductManager/ProductList';
import ProductForm from './ProductManager/ProductForm';
import { Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';

const ProductManager = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const { tags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Detectar se deve abrir diretamente na edição via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editProductId = urlParams.get('edit_product');
    
    if (editProductId && products.length > 0) {
      const productToEdit = products.find(p => p.id === editProductId);
      if (productToEdit) {
        setEditingProduct(productToEdit);
        setShowForm(true);
        // Limpar o parâmetro da URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('edit_product');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [products]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || product.tags?.some(tag => tag.id === selectedTag);
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
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#2C2C44] border-[#343A40]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#007BFF] bg-opacity-20 rounded-lg">
                <Package className="h-6 w-6 text-[#007BFF]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total de Produtos</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#2C2C44] border-[#343A40]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#28A745] bg-opacity-20 rounded-lg">
                <Filter className="h-6 w-6 text-[#28A745]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Produtos Filtrados</p>
                <p className="text-2xl font-bold text-white">{filteredProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C44] border-[#343A40]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFC107] bg-opacity-20 rounded-lg">
                <Search className="h-6 w-6 text-[#FFC107]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Categorias</p>
                <p className="text-2xl font-bold text-white">{tags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card principal */}
      <Card className="bg-[#2C2C44] border-[#343A40]">
        <CardHeader className="border-b border-[#343A40]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Gerenciamento de Produtos</CardTitle>
              <CardDescription className="text-gray-400">
                Gerencie o catálogo de produtos da loja
              </CardDescription>
            </div>
            <Button 
              onClick={handleCreateProduct} 
              className="bg-[#007BFF] hover:bg-[#0056B3] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filtros e Busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#343A40] border-[#6C757D] text-white placeholder-gray-400 focus:border-[#007BFF]"
              />
            </div>
            <div className="w-full sm:w-64">
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 bg-[#343A40] border border-[#6C757D] rounded-md text-white focus:border-[#007BFF] focus:outline-none"
              >
                <option value="">Todas as categorias</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtros ativos */}
          {(searchTerm || selectedTag) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <Badge 
                  variant="secondary" 
                  className="bg-[#007BFF] bg-opacity-20 text-[#007BFF] border-[#007BFF]"
                >
                  Busca: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedTag && (
                <Badge 
                  variant="secondary" 
                  className="bg-[#28A745] bg-opacity-20 text-[#28A745] border-[#28A745]"
                >
                  Categoria: {tags.find(tag => tag.id === selectedTag)?.name}
                  <button
                    onClick={() => setSelectedTag('')}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Lista de Produtos */}
          <ProductList
            products={filteredProducts}
            loading={loading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManager;
