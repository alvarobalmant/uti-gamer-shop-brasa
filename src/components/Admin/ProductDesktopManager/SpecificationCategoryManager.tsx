// Stub: Specifications managed via ERP
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Info } from 'lucide-react';
import { SpecificationCategory } from '@/hooks/useProductSpecifications';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SpecificationCategoryManagerProps {
  productId: string;
  categorizedSpecs: SpecificationCategory[];
  onSpecificationsChange: () => void;
}

const SpecificationCategoryManager: React.FC<SpecificationCategoryManagerProps> = ({
  categorizedSpecs
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-muted border-border">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-muted-foreground">
          Especificações são gerenciadas através do sistema ERP (IntegraAPI).
        </AlertDescription>
      </Alert>

      {categorizedSpecs.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-8">
            <p className="text-muted-foreground text-center">
              Nenhuma especificação cadastrada.
            </p>
          </CardContent>
        </Card>
      ) : (
        categorizedSpecs.map((category, catIndex) => (
          <Card key={catIndex} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground text-base">
                <Settings className="w-4 h-4 text-primary" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((spec, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      {spec.icon && <span>{spec.icon}</span>}
                      <span className="text-foreground">{spec.label}</span>
                      {spec.highlight && (
                        <Badge variant="secondary" className="text-xs">Destaque</Badge>
                      )}
                    </div>
                    <span className="text-muted-foreground">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default SpecificationCategoryManager;