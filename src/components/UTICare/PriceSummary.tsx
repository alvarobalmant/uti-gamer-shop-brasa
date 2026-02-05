import React from 'react';
import { Shield, Monitor, Gamepad2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  descricao: string;
  foto: string | null;
  platform: string | null;
}

interface SelectedEquipment {
  console?: Product | null;
  controllers: { product: Product; quantity: number }[];
}

interface Plan {
  id: string;
  name: string;
  basePrice: number;
  includesConsole: boolean;
  includesController: boolean;
  extraControllerPrice?: number;
}

interface PriceSummaryProps {
  plan: Plan;
  selectedEquipment: SelectedEquipment;
  monthlyPrice: number;
}

const PriceSummary: React.FC<PriceSummaryProps> = ({
  plan,
  selectedEquipment,
  monthlyPrice
}) => {
  const totalControllers = selectedEquipment.controllers.reduce((sum, c) => sum + c.quantity, 0);
  
  // Calculate breakdown
  const getBreakdown = () => {
    const items: { label: string; value: number }[] = [];

    if (plan.id === 'controle') {
      items.push({
        label: `${totalControllers}x Controle${totalControllers > 1 ? 's' : ''} (R$ 19,90 cada)`,
        value: plan.basePrice * totalControllers
      });
    } else if (plan.id === 'console') {
      items.push({
        label: 'Console (proteção mensal)',
        value: plan.basePrice
      });
    } else if (plan.id === 'gamer-pro') {
      items.push({
        label: 'Plano Gamer Pro (1 console + 1 controle)',
        value: plan.basePrice
      });
      
      const extraControllers = Math.max(0, totalControllers - 1);
      if (extraControllers > 0) {
        items.push({
          label: `${extraControllers}x Controle${extraControllers > 1 ? 's' : ''} extra${extraControllers > 1 ? 's' : ''} (R$ 15,90 cada)`,
          value: extraControllers * (plan.extraControllerPrice || 0)
        });
      }
    }

    return items;
  };

  const breakdown = getBreakdown();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Resumo da Assinatura</h3>

      {/* Plan info */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">{plan.name}</h4>
            <p className="text-sm text-muted-foreground">Proteção mensal para seus equipamentos</p>
          </div>
        </div>
      </div>

      {/* Selected equipment */}
      <div className="space-y-4">
        <h4 className="font-medium">Equipamentos selecionados</h4>
        
        {selectedEquipment.console && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <Monitor className="w-5 h-5 text-muted-foreground" />
            {selectedEquipment.console.foto && (
              <img
                src={selectedEquipment.console.foto}
                alt={selectedEquipment.console.descricao}
                className="w-12 h-12 object-contain rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{selectedEquipment.console.descricao}</p>
              <p className="text-xs text-muted-foreground">Console</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        )}

        {selectedEquipment.controllers.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <Gamepad2 className="w-5 h-5 text-muted-foreground" />
            {product.foto && (
              <img
                src={product.foto}
                alt={product.descricao}
                className="w-12 h-12 object-contain rounded"
              />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{product.descricao}</p>
              <p className="text-xs text-muted-foreground">Controle × {quantity}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium">Detalhamento do valor</h4>
        
        <div className="p-4 rounded-lg bg-card border border-border space-y-3">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span>R$ {item.value.toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
          
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total mensal</span>
              <span className="text-2xl font-bold text-primary">
                R$ {monthlyPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits reminder */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <h4 className="font-medium mb-3">O que está incluso:</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Reparos ilimitados
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Manutenção preventiva
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Atendimento prioritário
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Sem fidelidade - cancele quando quiser
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PriceSummary;
