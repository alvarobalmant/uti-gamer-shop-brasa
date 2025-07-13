import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Palette, Zap, Hand, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useBackgroundRemoval } from '@/hooks/useBackgroundRemoval';

interface BackgroundRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  productName: string;
  onSuccess: (processedImageUrl: string) => void;
}

export const BackgroundRemovalModal: React.FC<BackgroundRemovalModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  productName,
  onSuccess
}) => {
  const { processImageFromUrl, processing } = useBackgroundRemoval();
  const [step, setStep] = useState<'preview' | 'processing' | 'result'>('preview');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep('preview');
      setProcessedImageUrl('');
      setProgress(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (processing && step === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [processing, step]);

  const handleAutoProcess = async () => {
    setStep('processing');
    setProgress(10);
    
    try {
      const result = await processImageFromUrl(imageUrl);
      
      if (result) {
        setProcessedImageUrl(result);
        setProgress(100);
        setStep('result');
      } else {
        setStep('preview');
        setProgress(0);
      }
    } catch (error) {
      console.error('Erro no processamento:', error);
      setStep('preview');
      setProgress(0);
    }
  };

  const handleApply = () => {
    if (processedImageUrl) {
      onSuccess(processedImageUrl);
      onClose();
    }
  };

  const handleCancel = () => {
    setStep('preview');
    setProcessedImageUrl('');
    setProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-600" />
            Remoção Automática de Fundo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">{productName}</h3>
              <p className="text-sm text-gray-600">Transformar box art em PNG transparente</p>
            </div>
            <Badge variant={step === 'result' ? 'default' : 'secondary'}>
              {step === 'preview' && 'Pronto para processar'}
              {step === 'processing' && 'Processando...'}
              {step === 'result' && 'Processado'}
            </Badge>
          </div>

          {/* Preview Step */}
          {step === 'preview' && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-full max-w-md mx-auto">
                      <img
                        src={imageUrl}
                        alt={productName}
                        className="w-full h-auto rounded-lg border shadow-sm"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Imagem Original</h4>
                      <p className="text-sm text-gray-600">
                        A IA irá detectar automaticamente a box art e remover o fundo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleAutoProcess}
                  disabled={processing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Processar Automaticamente
                </Button>
                
                <Button
                  variant="outline"
                  disabled
                  className="px-6"
                >
                  <Hand className="w-4 h-4 mr-2" />
                  Ajuste Manual
                  <Badge variant="secondary" className="ml-2 text-xs">Em Breve</Badge>
                </Button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-gray-900">
                        Removendo Fundo Automaticamente
                      </h4>
                      <p className="text-gray-600">
                        A IA está processando sua imagem...
                      </p>
                    </div>

                    <div className="w-full max-w-md mx-auto space-y-2">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-gray-500">{Math.round(progress)}% concluído</p>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• Detectando objeto principal</p>
                      <p>• Criando máscara de transparência</p>
                      <p>• Otimizando resultado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Result Step */}
          {step === 'result' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original */}
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <img
                        src={imageUrl}
                        alt="Original"
                        className="w-full h-auto rounded-lg border"
                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                      <h4 className="font-medium text-gray-700">Original</h4>
                    </div>
                  </CardContent>
                </Card>

                {/* Processed */}
                <Card className="ring-2 ring-green-500">
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <div 
                        className="w-full rounded-lg border"
                        style={{ 
                          maxHeight: '200px',
                          background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                      >
                        <img
                          src={processedImageUrl}
                          alt="Sem Fundo"
                          className="w-full h-auto rounded-lg"
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-green-700">Sem Fundo</h4>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Processamento Concluído!</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Fundo removido com sucesso. A imagem está pronta para uso com transparência.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleApply}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aplicar Resultado
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setStep('preview')}
                  className="px-6"
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={processing}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Cancelar
            </Button>

            <div className="text-xs text-gray-500">
              <p>✨ IA processando em segundo plano</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};