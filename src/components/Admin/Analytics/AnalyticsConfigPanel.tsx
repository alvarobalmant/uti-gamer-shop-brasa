import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { useAnalyticsConfig } from '@/hooks/useAnalyticsConfig';

export const AnalyticsConfigPanel: React.FC = () => {
  const { config, toggleMockData, showMockData } = useAnalyticsConfig();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Configurações de Analytics
        </CardTitle>
        <CardDescription>
          Configure como os dados de analytics são exibidos no dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="mock-data-toggle" className="text-base">
              Exibir dados mock
            </Label>
            <p className="text-sm text-muted-foreground">
              Quando habilitado, exibe dados de demonstração nos gráficos. 
              Desabilite para ver apenas dados reais do sistema.
            </p>
          </div>
          <Switch
            id="mock-data-toggle"
            checked={showMockData}
            onCheckedChange={toggleMockData}
          />
        </div>
        
        {showMockData && (
          <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <p className="text-sm text-warning-foreground">
              ⚠️ <strong>Modo de demonstração ativo:</strong> Os dados exibidos são fictícios 
              e foram criados apenas para fins de demonstração. Desative esta opção para 
              visualizar dados reais do seu sistema.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};