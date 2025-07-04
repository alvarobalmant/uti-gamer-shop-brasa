
import React, { useState, useEffect } from 'react';
import { useProductsEnhanced } from '@/hooks/useProductsEnhanced';
import { useImageUpload } from '@/hooks/useImageUpload';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Link, Trash2, Star, Plus, AlertTriangle } from 'lucide-react';
import ProductImageCard from '@/components/Admin/ProductImageManager/ProductImageCard';
import ImageDropZone from '@/components/Admin/ProductImageManager/ImageDropZone';
import BulkImageUpload from '@/components/Admin/ProductImageManager/BulkImageUpload';

const ProductImageManager: React.FC = () => {
  const { products, loading, updateProduct } = useProductsEnhanced();
  const { uploadImage, uploading } = useImageUpload();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [processingProducts, setProcessingProducts] = useState<Set<string>>(new Set());

  console.log('ProductImageManager: Renderizando com', products.length, 'produtos');

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addProcessingProduct = (productId: string) => {
    setProcessingProducts(prev => new Set([...prev, productId]));
  };

  const removeProcessingProduct = (productId: string) => {
    setProcessingProducts(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleImageDrop = async (productId: string, imageUrl: string, isMainImage: boolean = false) => {
    if (!imageUrl || !imageUrl.trim()) {
      toast.error('URL da imagem é obrigatória');
      return;
    }

    if (!productId) {
      toast.error('ID do produto não encontrado');
      return;
    }

    addProcessingProduct(productId);

    try {
      console.log('Atualizando imagem:', { productId, imageUrl, isMainImage });
      
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Produto não encontrado');
        return;
      }

      // Preparar os updates de forma segura
      const updates: any = {};
      
      if (isMainImage) {
        // Atualizar apenas a imagem principal
        updates.image = imageUrl.trim();
        console.log('Atualizando imagem principal para:', updates.image);
      } else {
        // Atualizar imagens secundárias
        const currentImages = Array.isArray(product.additional_images) ? product.additional_images : [];
        if (!currentImages.includes(imageUrl.trim())) {
          updates.additional_images = [...currentImages, imageUrl.trim()];
          console.log('Adicionando imagem secundária. Total:', updates.additional_images.length);
        } else {
          toast.info('Esta imagem já existe nas imagens secundárias');
          return;
        }
      }

      console.log('Updates que serão enviados:', updates);
      
      const result = await updateProduct(productId, updates);
      
      if (result) {
        toast.success(`Imagem ${isMainImage ? 'principal' : 'secundária'} adicionada com sucesso!`);
      } else {
        throw new Error('Falha ao atualizar produto');
      }
      
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      toast.error('Erro ao atualizar imagem. Tente novamente.');
    } finally {
      removeProcessingProduct(productId);
    }
  };

  const handleRemoveImage = async (productId: string, imageUrl: string, isMainImage: boolean = false) => {
    if (!productId || !imageUrl) {
      toast.error('Dados inválidos para remoção');
      return;
    }

    addProcessingProduct(productId);

    try {
      console.log('Removendo imagem:', { productId, imageUrl, isMainImage });
      
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast.error('Produto não encontrado');
        return;
      }

      // Preparar updates de forma muito específica
      const updates: any = {};
      
      if (isMainImage) {
        // Remover apenas a imagem principal, definindo como null
        updates.image = null;
        console.log('Removendo imagem principal');
      } else {
        // Remover das imagens secundárias
        const currentImages = Array.isArray(product.additional_images) ? product.additional_images : [];
        const updatedImages = currentImages.filter(img => img !== imageUrl);
        updates.additional_images = updatedImages;
        console.log('Removendo imagem secundária. Restam:', updatedImages.length);
      }

      console.log('Updates de remoção que serão enviados:', updates);
      
      const result = await updateProduct(productId, updates);
      
      if (result) {
        toast.success('Imagem removida com sucesso!');
      } else {
        throw new Error('Falha ao remover imagem');
      }
      
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error('Erro ao remover imagem. Tente novamente.');
    } finally {
      removeProcessingProduct(productId);
    }
  };

  const handleFileUpload = async (files: FileList | null, productId?: string, isMainImage: boolean = false) => {
    if (!files || files.length === 0) {
      toast.error('Nenhum arquivo selecionado');
      return;
    }

    if (!productId) {
      toast.error('ID do produto não encontrado');
      return;
    }

    addProcessingProduct(productId);

    try {
      console.log('Fazendo upload de arquivo:', { productId, isMainImage, filesCount: files.length });
      
      const file = files[0];
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Apenas arquivos de imagem são permitidos');
        return;
      }

      // Validar tamanho do arquivo (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 5MB permitido');
        return;
      }
      
      const uploadedUrl = await uploadImage(file, 'products');
      
      if (uploadedUrl) {
        await handleImageDrop(productId, uploadedUrl, isMainImage);
      } else {
        toast.error('Falha no upload da imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro no upload da imagem');
    } finally {
      removeProcessingProduct(productId);
    }
  };

  const handleUrlAdd = async (productId: string, url: string, isMainImage: boolean = false) => {
    if (!url || !url.trim()) {
      toast.error('URL é obrigatória');
      return;
    }

    // Validar se é uma URL válida
    try {
      new URL(url.trim());
    } catch {
      toast.error('URL inválida');
      return;
    }

    await handleImageDrop(productId, url.trim(), isMainImage);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearSelection = () => {
    setSelectedProducts([]);
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
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Imagens</h1>
            <p className="text-gray-600 mt-1">
              Gerencie as imagens dos produtos de forma fácil e segura
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              variant="outline"
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload em Lote
            </Button>
            
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {selectedProducts.length} selecionados
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSelection}
                >
                  Limpar
                </Button>
              </div>
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

        {/* Status Info */}
        {processingProducts.size > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-700">
                <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">
                  Processando {processingProducts.size} produto(s)...
                </span>
              </div>
            </CardContent>
          </Card>
        )}

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
        {filteredProducts.length > 0 ? (
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
                uploading={uploading || processingProducts.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              {searchTerm ? (
                <>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-600">
                    Tente ajustar sua pesquisa ou verifique se há produtos cadastrados.
                  </p>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum produto cadastrado
                  </h3>
                  <p className="text-gray-600">
                    Cadastre produtos primeiro para gerenciar suas imagens.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductImageManager;
