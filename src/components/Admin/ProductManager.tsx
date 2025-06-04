import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react'; // Removed Filter icon for now
import { useProducts, Product } from '@/hooks/useProducts'; // Import Product interface
import { useTags, Tag } from '@/hooks/useTags'; // Import Tag interface
import ProductList from './ProductManager/ProductList';
import ProductForm from './ProductManager/ProductForm';

const ProductManager = () => {
  // Use Product interface for state
  const { products, loading, addProduct, updateProduct, deleteProduct, fetchProducts } = useProducts(); 
  const { tags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string>(''); // Store tag ID
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Correct filtering logic
  const filteredProducts = products.filter(product => {
    // Check search term against title (primary) or description
    const matchesSearch = 
      (product.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description?.toLowerCase().includes(searchTerm.toLowerCase()));
      
    // Check if the product's tags array includes the selected tag ID
    // Ensure product.tags is an array of ProductTag objects
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

  // Ensure productData matches ProductInput type expected by hooks
  const handleFormSubmit = async (productData: any) => { // Use 'any' temporarily, should match ProductInput
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }
      setShowForm(false);
      setEditingProduct(null);
      // fetchProducts(); // Re-fetch handled within hooks now
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      // Error toast is handled within the hook
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(productId);
        // fetchProducts(); // Re-fetch handled within hooks now
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
         // Error toast is handled within the hook
      }
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct} // Pass Product | null
        allTags={tags} // Pass all available tags
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
        {/* Filtros e Busca */}
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
              value={selectedTagId} // Use selectedTagId
              onChange={(e) => setSelectedTagId(e.target.value)} // Update selectedTagId
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white h-10" // Match input height
            >
              <option value="">Todas as Tags</option> {/* Changed label */}
              {/* Ensure tags is an array before mapping */}
              {Array.isArray(tags) && tags.map((tag: Tag) => ( // Use Tag interface
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Produtos */}
        <ProductList
          products={filteredProducts} // Pass filtered products
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </CardContent>
    </Card>
  );
};

export default ProductManager;
