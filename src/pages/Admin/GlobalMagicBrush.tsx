
import React, { useState } from 'react';
import { useProductsEnhanced } from '@/hooks/useProductsEnhanced';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { useProductImageManager } from '@/hooks/useProductImageManager';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Wand2, Sparkles, AlertTriangle, Save } from 'lucide-react';
import { MagicBrushEditor } from '@/components/Admin/MagicBrushEditor';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const GlobalMagicBrush: React.FC = () => {
  const { products, loading, refreshProducts } = useProductsEnhanced();
  const { processImageFromUrl, processMagicBrushEdit, processing, progress } = useBackgroundRemoval();
  const { updateProductImage } = useProductImageManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [showMagicBrush, setShowMagicBrush] = useState(false);
  const [isMainImage, setIsMainImage] = useState(false);

  console.log('GlobalMagicBrush: Renderizando com', products.length, 'produtos');

  const filteredProducts = products.filter(product => 
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMagicBrushClick = async (product: any, imageUrl: string, isMain: boolean) => {
    if (!imageUrl || processing) return;

    try {
      console.log('🪄 Iniciando processamento para pincel mágico:', { productId: product.id, imageUrl, isMain });
      
      const result = await processImageFromUrl(imageUrl, {
        model: 'product',
        quality: 'high',
        smoothEdges: true
      });

      if (result) {
        setSelectedProduct(product);
        setOriginalImage(result.originalImage);
        
        // Criar elemento de imagem processada
        const processedImg = new Image();
        processedImg.onload = () => {
          setProcessedImage(processedImg);
          setIsMainImage(isMain);
          setShowMagicBrush(true);
        };
        processedImg.src = result.url;
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast.error('Erro ao processar imagem. Tente novamente.');
    }
  };

  const handleMagicBrushSave = async (editedImageBlob: Blob) => {
    if (!selectedProduct) return;

    try {
      console.log('💾 Salvando resultado do pincel mágico...');
      
      const finalUrl = await processMagicBrushEdit(editedImageBlob);
      
      if (finalUrl) {
        await updateProductImage(selectedProduct.id, finalUrl, isMainImage);
        await refreshProducts();
        
        setShowMagicBrush(false);
        setSelectedProduct(null);
        setOriginalImage(null);
        setProcessedImage(null);
        
        toast.success('🪄 Pincel mágico aplicado e produto atualizado!');
      }
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      toast.error('Erro ao salvar resultado. Tente novamente.');
    }
  };

  const handleMagicBrushCancel = () => {
    setShowMagicBrush(false);
    setSelectedProduct(null);
    setOriginalImage(null);
    setProcessedImage(null);
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
            <h1 className="text-3xl font-bold text-gray-900">🪄 Pincel Mágico Geral</h1>
            <p className="text-gray-600 mt-1">
              Remova fundos de todas as imagens dos produtos usando o pincel mágico
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        {processing && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-purple-700 mb-1">
                    <span>Processando imagem...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg truncate">{product.name || 'Sem nome'}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{product.id}</Badge>
                    {product.platform_name && (
                      <Badge variant="secondary">{product.platform_name}</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 space-y-4">
                  {/* Imagem Principal */}
                  {product.image && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Imagem Principal</h4>
                      <div className="relative group">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Button
                            onClick={() => handleMagicBrushClick(product, product.image, true)}
                            disabled={processing}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            size="sm"
                          >
                            <Wand2 className="w-4 h-4 mr-1" />
                            Pincel Mágico
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Imagens Adicionais */}
                  {product.additional_images && product.additional_images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">
                        Imagens Adicionais ({product.additional_images.length})
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {product.additional_images.slice(0, 4).map((imageUrl: string, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`${product.name} - ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                              <Button
                                onClick={() => handleMagicBrushClick(product, imageUrl, false)}
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                              >
                                <Wand2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {product.additional_images.length > 4 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{product.additional_images.length - 4} imagens
                        </p>
                      )}
                    </div>
                  )}

                  {!product.image && (!product.additional_images || product.additional_images.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Nenhuma imagem disponível</p>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                    Cadastre produtos primeiro para usar o pincel mágico.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Magic Brush Modal */}
        <Dialog open={showMagicBrush} onOpenChange={setShowMagicBrush}>
          <DialogContent className="max-w-7xl max-h-[95vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Pincel Mágico - {selectedProduct?.name}
              </DialogTitle>
            </DialogHeader>
            
            {originalImage && processedImage && (
              <div className="flex-1 p-6">
                <MagicBrushEditor
                  originalImage={originalImage}
                  processedImage={processedImage}
                  onSave={handleMagicBrushSave}
                  onCancel={handleMagicBrushCancel}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GlobalMagicBrush;
