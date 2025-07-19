import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info, Eye, EyeOff, FileText, Type } from 'lucide-react';

interface BasicConfigTabProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const BasicConfigTab: React.FC<BasicConfigTabProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Nome da Seção *</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Ex: Banner Promocional Principal"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Nome interno para identificação no painel administrativo
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="Ex: Seção principal de banners na homepage"
                rows={3}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Descrição opcional para facilitar a organização
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status e Visibilidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Status e Visibilidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="is_active" className="text-base font-medium">
                  Seção Ativa
                </Label>
                <Badge variant={data.is_active ? 'default' : 'secondary'} className="gap-1">
                  {data.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {data.is_active ? 'Visível' : 'Oculta'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {data.is_active 
                  ? 'Esta seção será exibida no site para os visitantes'
                  : 'Esta seção ficará oculta no site, mas será mantida no painel'
                }
              </p>
            </div>
            <Switch
              id="is_active"
              checked={data.is_active}
              onCheckedChange={(checked) => onChange('is_active', checked)}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Dica de Organização
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Use nomes descritivos para facilitar a identificação das seções. 
                  Você pode desativar temporariamente uma seção sem perder suas configurações.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prévia do Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo da Configuração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Nome da Seção</Label>
              <p className="text-sm font-medium">
                {data.title || 'Sem nome definido'}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <Badge variant={data.is_active ? 'default' : 'secondary'} className="gap-1">
                {data.is_active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                {data.is_active ? 'Ativa no Site' : 'Inativa'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicConfigTab;