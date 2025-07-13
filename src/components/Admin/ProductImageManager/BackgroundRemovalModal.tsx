
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';
import { MagicBrushEditor } from '@/components/Admin/MagicBrushEditor';
import { Wand2, Sparkles, Bot, Eye, EyeOff, Save, X } from 'lucide-react';

interface BackgroundRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
  onImageProcessed: (newImageUrl: string) => void;
}

export const BackgroundRemovalModal: React.FC<BackgroundRemovalModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  productName,
  onImageProcessed
}) => {
  const { processImageFromUrl, processMagicBrushEdit, processing, progress } = useBackgroundRemoval();
  const [model, setModel] = useState<'general' | 'portrait' | 'object' | 'product' | 'auto'>('product');
  const [quality, setQuality] = useState<'fast' | 'balanced' | 'high'>('high');
  const [showPreview, setShowPreview] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLImageElement | null>(null);
  const [showMagicBrush, setShowMagicBrush] = useState(false);

  const handleProcess = async () => {
    try {
      const result = await processImageFromUrl(imageUrl, {
        model,
        quality,
        smoothEdges: true
      });

      if (result) {
        setProcessedUrl(result.url);
        setOriginalImage(result.originalImage);
        
        // Criar elemento de imagem processada
        const processedImg = new Image();
        processedImg.onload = () => {
          setProcessedImage(processedImg);
          setShowPreview(true);
        };
        processedImg.src = result.url;
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
    }
  };

  const handleDirectMagicBrush = async () => {
    try {
      const result = await processImageFromUrl(imageUrl, {
        model: 'product',
        quality: 'high',
        smoothEdges: true
      });

      if (result) {
        setOriginalImage(result.originalImage);
        
        // Criar elemento de imagem processada
        const processedImg = new Image();
        processedImg.onload = () => {
          setProcessedImage(processedImg);
          setShowMagicBrush(true);
        };
        processedImg.src = result.url;
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
    }
  };

  const handleMagicBrushSave = async (editedImageBlob: Blob) => {
    try {
      const finalUrl = await processMagicBrushEdit(editedImageBlob);
      
      if (finalUrl) {
        onImageProcessed(finalUrl);
        handleClose();
      }
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
    }
  };

  const handleSaveProcessed = () => {
    if (processedUrl) {
      onImageProcessed(processedUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setShowPreview(false);
    setShowMagicBrush(false);
    setProcessedUrl('');
    setOriginalImage(null);
    setProcessedImage(null);
    onClose();
  };

  if (showMagicBrush && originalImage && processedImage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Pincel Mágico - {productName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 p-6">
            <MagicBrushEditor
              originalImage={originalImage}
              processedImage={processedImage}
              onSave={handleMagicBrushSave}
              onCancel={() => setShowMagicBrush(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Remoção de Fundo - {productName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          {processing && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-blue-700 mb-1">
                      <span>Processando imagem...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!showPreview && (
            <>
              {/* Original Image */}
              <div className="space-y-3">
                <h3 className="font-medium">Imagem Original</h3>
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Original"
                    className="w-full max-h-64 object-contain rounded-lg border bg-gray-50"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Select value={model} onValueChange={(value: any) => setModel(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Produto (Recomendado)</SelectItem>
                      <SelectItem value="general">Geral</SelectItem>
                      <SelectItem value="object">Objeto</SelectItem>
                      <SelectItem value="portrait">Retrato</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Qualidade</label>
                  <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta (Recomendado)</SelectItem>
                      <SelectItem value="balanced">Balanceada</SelectItem>
                      <SelectItem value="fast">Rápida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleProcess}
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  {processing ? 'Processando...' : 'Remover Fundo (IA)'}
                </Button>
                
                <Button
                  onClick={handleDirectMagicBrush}
                  disabled={processing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {processing ? 'Preparando...' : 'Pincel Mágico Direto'}
                </Button>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p><strong>💡 Dica:</strong></p>
                <p>• <strong>IA:</strong> Processamento automático completo</p>
                <p>• <strong>Pincel Mágico:</strong> Controle manual para ajustes precisos</p>
              </div>
            </>
          )}

          {/* Preview */}
          {showPreview && processedUrl && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Resultado</h3>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Processado
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Original</h4>
                    <img
                      src={imageUrl}
                      alt="Original"
                      className="w-full h-48 object-contain rounded-lg border bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">Processado</h4>
                    <div 
                      className="w-full h-48 rounded-lg border bg-gray-50 flex items-center justify-center"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <img
                        src={processedUrl}
                        alt="Processado"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Preview */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    setShowMagicBrush(true);
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Ajustar com Pincel Mágico
                </Button>
                
                <Button
                  onClick={handleSaveProcessed}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Resultado
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Voltar
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
