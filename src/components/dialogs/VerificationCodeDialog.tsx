import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, MessageCircle } from 'lucide-react';

interface VerificationCodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  verificationCode: string;
  onContinueToWhatsApp: () => void;
}

export const VerificationCodeDialog: React.FC<VerificationCodeDialogProps> = ({
  isOpen,
  onClose,
  verificationCode,
  onContinueToWhatsApp,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Pedido Criado com Sucesso!
          </DialogTitle>
          <DialogDescription>
            Seu código de verificação foi gerado. Copie o código abaixo antes de continuar para o WhatsApp.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg border">
            <div className="text-sm text-muted-foreground mb-2">
              🔐 Código de Verificação:
            </div>
            <div className="flex items-center justify-between gap-3">
              <code className="text-lg font-mono font-semibold bg-background px-3 py-2 rounded border flex-1 text-center">
                {verificationCode}
              </code>
              <CopyButton
                text={verificationCode}
                size="sm"
                successMessage="Código copiado!"
                errorMessage="Erro ao copiar código"
              >
                Copiar
              </CopyButton>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
            💡 <strong>Dica:</strong> Este código será enviado automaticamente no WhatsApp, mas é recomendado copiá-lo para ter certeza.
          </div>

          <Separator />
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={onContinueToWhatsApp}
              className="w-full"
              size="lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Continuar para WhatsApp
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};