import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrustBadgesProps {
  className?: string;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ className }) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Certificações */}
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900 text-sm">Segurança</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            SSL 256-bit
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            PCI Compliant
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Site Blindado
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Reclame Aqui
          </div>
        </div>
      </div>

      {/* Informações Legais */}
      <div className="text-xs text-gray-500 space-y-1">
        <div>📋 CNPJ: 16.811.173/0001-20</div>
        <div>📍 Colatina - ES, Brasil</div>
        <div>⭐ 15+ anos no mercado</div>
        <div>🏆 +50.000 clientes satisfeitos</div>
      </div>

      {/* Links Úteis */}
      <div className="space-y-1">
        <button className="w-full text-left text-xs text-blue-600 hover:underline">
          📜 Política de Privacidade
        </button>
        <button className="w-full text-left text-xs text-blue-600 hover:underline">
          🔄 Política de Trocas
        </button>
        <button className="w-full text-left text-xs text-blue-600 hover:underline">
          📞 Central de Atendimento
        </button>
      </div>
    </div>
  );
};

export default TrustBadges;

