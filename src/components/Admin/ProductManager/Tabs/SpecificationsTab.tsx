// Stub: Specifications managed via ERP/product.specifications field
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Info } from 'lucide-react';
import { ProductFormData } from '@/types/product-extended';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SpecificationsTabProps {
  formData: ProductFormData;
  onChange: (field: string, value: any) => void;
}

const SpecificationsTab: React.FC<SpecificationsTabProps> = ({ formData }) => {
  // Ensure specifications is always an array
  const rawSpecs = formData.specifications;
  const specifications = Array.isArray(rawSpecs) ? rawSpecs : [];

  return (
    <div className="space-y-4">
      <Alert className="bg-muted border-border">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-muted-foreground">
          Especificações são gerenciadas através do sistema ERP (IntegraAPI).
        </AlertDescription>
      </Alert>

      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground text-lg">
            <FileText className="w-5 h-5 text-primary" />
            Especificações do Produto
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specifications.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma especificação cadastrada para este produto.
            </p>
          ) : (
            <div className="space-y-2">
              {specifications.map((spec: any, index: number) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {spec.icon && <span className="text-lg">{spec.icon}</span>}
                    <div>
                      <span className="text-foreground font-medium">{spec.label || spec.name}</span>
                      {spec.category && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {spec.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-muted-foreground">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecificationsTab;