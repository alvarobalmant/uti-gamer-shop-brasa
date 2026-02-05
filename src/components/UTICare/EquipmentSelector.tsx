import React from 'react';
import { Loader2, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  descricao: string;
  foto: string | null;
  platform: string | null;
  grupo: string | null;
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
  maxControllers: number;
}

interface EquipmentSelectorProps {
  plan: Plan;
  products: { consoles: Product[]; controllers: Product[] };
  selectedEquipment: SelectedEquipment;
  onEquipmentChange: (equipment: SelectedEquipment) => void;
  loading: boolean;
}

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({
  plan,
  products,
  selectedEquipment,
  onEquipmentChange,
  loading
}) => {
  const handleSelectConsole = (console: Product) => {
    onEquipmentChange({
      ...selectedEquipment,
      console: selectedEquipment.console?.id === console.id ? null : console
    });
  };

  const handleToggleController = (controller: Product) => {
    const existing = selectedEquipment.controllers.find(c => c.product.id === controller.id);
    
    if (existing) {
      // Remove controller
      onEquipmentChange({
        ...selectedEquipment,
        controllers: selectedEquipment.controllers.filter(c => c.product.id !== controller.id)
      });
    } else {
      // Add controller with quantity 1
      onEquipmentChange({
        ...selectedEquipment,
        controllers: [...selectedEquipment.controllers, { product: controller, quantity: 1 }]
      });
    }
  };

  const handleUpdateQuantity = (controllerId: string, delta: number) => {
    onEquipmentChange({
      ...selectedEquipment,
      controllers: selectedEquipment.controllers.map(c => {
        if (c.product.id === controllerId) {
          const newQuantity = Math.max(1, Math.min(plan.maxControllers, c.quantity + delta));
          return { ...c, quantity: newQuantity };
        }
        return c;
      })
    });
  };

  const totalControllers = selectedEquipment.controllers.reduce((sum, c) => sum + c.quantity, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Group products by platform
  const groupByPlatform = (items: Product[]) => {
    return items.reduce((acc, item) => {
      const platform = item.platform || 'Outros';
      if (!acc[platform]) acc[platform] = [];
      acc[platform].push(item);
      return acc;
    }, {} as Record<string, Product[]>);
  };

  const consolesByPlatform = groupByPlatform(products.consoles);
  const controllersByPlatform = groupByPlatform(products.controllers);

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold">Selecione seus equipamentos</h3>

      {/* Console Selection */}
      {plan.includesConsole && (
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Console</h4>
          <p className="text-sm text-muted-foreground">Selecione o console que deseja proteger</p>
          
          {Object.entries(consolesByPlatform).map(([platform, consoles]) => (
            <div key={platform} className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">{platform}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consoles.map((console) => (
                  <div
                    key={console.id}
                    onClick={() => handleSelectConsole(console)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      selectedEquipment.console?.id === console.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {console.foto && (
                      <img
                        src={console.foto}
                        alt={console.descricao}
                        className="w-16 h-16 object-contain rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{console.descricao}</p>
                    </div>
                    {selectedEquipment.console?.id === console.id && (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {products.consoles.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              Nenhum console disponível no momento.
            </p>
          )}
        </div>
      )}

      {/* Controller Selection */}
      {plan.includesController && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-lg">Controles</h4>
              <p className="text-sm text-muted-foreground">
                Selecione os controles que deseja proteger
                {plan.maxControllers > 1 && ` (máximo ${plan.maxControllers})`}
              </p>
            </div>
            {plan.maxControllers > 1 && (
              <span className="text-sm text-muted-foreground">
                {totalControllers}/{plan.maxControllers}
              </span>
            )}
          </div>
          
          {Object.entries(controllersByPlatform).map(([platform, controllers]) => (
            <div key={platform} className="space-y-2">
              <h5 className="text-sm font-medium text-muted-foreground">{platform}</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {controllers.map((controller) => {
                  const selectedController = selectedEquipment.controllers.find(
                    c => c.product.id === controller.id
                  );
                  const isSelected = !!selectedController;

                  return (
                    <div
                      key={controller.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div
                        onClick={() => handleToggleController(controller)}
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                      >
                        {controller.foto && (
                          <img
                            src={controller.foto}
                            alt={controller.descricao}
                            className="w-14 h-14 object-contain rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{controller.descricao}</p>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(controller.id, -1);
                            }}
                            disabled={selectedController.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {selectedController.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateQuantity(controller.id, 1);
                            }}
                            disabled={totalControllers >= plan.maxControllers}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleToggleController(controller)}
                          className="cursor-pointer"
                        >
                          <div className="w-6 h-6 rounded border-2 border-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {products.controllers.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">
              Nenhum controle disponível no momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EquipmentSelector;
