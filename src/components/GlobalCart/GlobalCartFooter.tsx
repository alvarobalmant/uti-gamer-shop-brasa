
import { Button } from '@/components/ui/button';

interface GlobalCartFooterProps {
  total: number;
  onSendToWhatsApp: () => void;
  onClose: () => void;
}

const GlobalCartFooter = ({ total, onSendToWhatsApp, onClose }: GlobalCartFooterProps) => {
  return (
    <div className="border-t border-gray-200 p-6 bg-white flex-shrink-0 rounded-b-2xl">
      <div className="bg-red-50 p-4 rounded-xl mb-4 border border-red-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600 font-medium">Subtotal:</span>
          <span className="text-gray-800 font-semibold">R$ {total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Frete:</span>
          <span className="text-red-600 font-bold">
            {total >= 200 ? 'GRÁTIS' : 'Calcular'}
          </span>
        </div>
        {total >= 200 && (
          <div className="text-center py-2 bg-green-100 rounded-lg mt-2">
            <p className="text-green-700 text-sm font-bold">🎉 Você ganhou frete grátis!</p>
          </div>
        )}
        <div className="border-t border-red-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Total:</span>
            <span className="text-2xl font-bold text-red-600">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <Button
        onClick={() => {
          onSendToWhatsApp();
          onClose();
        }}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-lg mb-3"
      >
        Finalizar no WhatsApp 📱
      </Button>
      
      <Button
        onClick={onClose}
        variant="outline"
        className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 rounded-xl"
      >
        Continuar Comprando
      </Button>
    </div>
  );
};

export default GlobalCartFooter;
