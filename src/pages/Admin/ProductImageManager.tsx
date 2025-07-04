
import React, { useState, useEffect } from 'react';
import { useProductsEnhanced } from '@/hooks/useProductsEnhanced';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Link, Trash2, Star, Plus } from 'lucide-react';
import ProductImageCard from '@/components/Admin/ProductImageManager/ProductImageCard';
import ImageDropZone from '@/components/Admin/ProductImageManager/ImageDropZone';
import BulkImageUpload from '@/components/Admin/ProductImageManager/BulkImageUpload';

const ProductImageManager: React.FC = () => {
  const { products, loading, updateProduct } = useProductsEnhanced();
  const { uploadImage, uploading } = useImageUpload();
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedImage, setDraggedImage] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageDrop = async (productId: string, imageUrl: string, isMainImage: boolean = false) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let updates: any = {};
      
      if (isMainImage) {
        updates.image = imageUrl;
      } else {
        const currentImages = product.additional_images || [];
        if (!currentImages.includes(imageUrl)) {
          updates.additional_images = [...currentImages, imageUrl];
        }
      }

      await updateProduct(productId, updates);
      toast.success(`Imagem ${isMainImage ? 'principal' : 'secundária'} atualizada!`);
    } catch (error) {
      toast.error('Erro ao atualizar imagem');
    }
  };

  const handleRemoveImage = async (productId: string, imageUrl: string, isMainImage: boolean = false) => {
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      let updates: any = {};
      
      if (isMainImage) {
        updates.image = '';
      } else {
        const currentImages = product.additional_images || [];
        updates.additional_images = currentImages.filter(img => img !== imageUrl);
      }

      await updateProduct(productId, updates);
      toast.success('Imagem removida!');
    } catch (error) {
      toast.error('Erro ao remover imagem');
    }
  };

  const handleFileUpload = async (files: FileList | null, productId?: string, isMainImage: boolean = false) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const uploadedUrl = await uploadImage(file, 'products');
    
    if (uploadedUrl && productId) {
      await handleImageDrop(productId, uploadedUrl, isMainImage);
    }
  };

  const handleUrlAdd = async (productId: string, url: string, isMainImage: boolean = false) => {
    if (url.trim()) {
      await handleImageDrop(productId, url.trim(), isMainImage);
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Imagens dos Produtos</h1>
            <p className="text-gray-600 mt-1">Arraste imagens ou adicione links diretamente nos produtos</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload em Lote
            </Button>
            
            {selectedProducts.length > 0 && (
              <Badge variant="secondary">
                {selectedProducts.length} selecionados
              </Badge>
            )}
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar produtos por nome ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bulk Upload */}
        {showBulkUpload && (
          <BulkImageUpload
            selectedProducts={selectedProducts}
            products={products}
            onClose={() => setShowBulkUpload(false)}
            onImageUpload={handleImageDrop}
          />
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductImageCard
              key={product.id}
              product={product}
              onImageDrop={handleImageDrop}
              onRemoveImage={handleRemoveImage}
              onFileUpload={handleFileUpload}
              onUrlAdd={handleUrlAdd}
              isSelected={selectedProducts.includes(product.id)}
              onToggleSelection={() => toggleProductSelection(product.id)}
              uploading={uploading}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600">Tente ajustar sua pesquisa ou verifique se há produtos cadastrados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductImageManager;
