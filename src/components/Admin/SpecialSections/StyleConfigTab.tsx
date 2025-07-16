import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Image, 
  Monitor,
  Smartphone,
  Tablet,
  Settings
} from 'lucide-react';

interface StyleConfigTabProps {
  data: any;
  onChange: (field: string, value: any) => void;
}

const StyleConfigTab: React.FC<StyleConfigTabProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Fundo da Seção */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Fundo da Seção
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">Tipo de Fundo</Label>
            <RadioGroup
              value={data.background_type}
              onValueChange={(value) => onChange('background_type', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="bg-color" />
                <Label htmlFor="bg-color" className="flex items-center gap-2 cursor-pointer">
                  <Palette className="h-4 w-4" />
                  Cor Sólida
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="bg-image" />
                <Label htmlFor="bg-image" className="flex items-center gap-2 cursor-pointer">
                  <Image className="h-4 w-4" />
                  Imagem de Fundo
                </Label>
              </div>
            </RadioGroup>
          </div>

          {data.background_type === 'color' && (
            <div className="space-y-2">
              <Label htmlFor="bg-color-value">Cor de Fundo</Label>
              <div className="flex gap-2">
                <Input
                  id="bg-color-value"
                  type="color"
                  value={data.background_value || '#ffffff'}
                  onChange={(e) => onChange('background_value', e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={data.background_value || '#ffffff'}
                  onChange={(e) => onChange('background_value', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          )}

          {data.background_type === 'image' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bg-image-url">URL da Imagem de Fundo</Label>
                <Input
                  id="bg-image-url"
                  value={data.background_value || ''}
                  onChange={(e) => onChange('background_value', e.target.value)}
                  placeholder="https://exemplo.com/imagem-de-fundo.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-position">Posição da Imagem</Label>
                <Select
                  value={data.background_image_position || 'center'}
                  onValueChange={(value) => onChange('background_image_position', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="top">Topo</SelectItem>
                    <SelectItem value="bottom">Base</SelectItem>
                    <SelectItem value="left">Esquerda</SelectItem>
                    <SelectItem value="right">Direita</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsividade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Configurações Responsivas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span className="text-sm font-medium">Desktop</span>
              </div>
              <Badge variant="default">Sempre Visível</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Tablet className="h-4 w-4" />
                <span className="text-sm font-medium">Tablet</span>
              </div>
              <Badge variant="default">Sempre Visível</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile</span>
              </div>
              <Badge variant="default">Sempre Visível</Badge>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Esta seção será automaticamente otimizada para todos os dispositivos
          </div>
        </CardContent>
      </Card>

      {/* Configurações Avançadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              Configurações avançadas de espaçamento, animações globais e outras opções 
              estarão disponíveis em versões futuras.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prévia das Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia das Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Tipo de Fundo</Label>
              <Badge variant="outline">
                {data.background_type === 'color' ? 'Cor Sólida' : 'Imagem de Fundo'}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Valor do Fundo</Label>
              <p className="text-sm">
                {data.background_value || 'Não definido'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StyleConfigTab;