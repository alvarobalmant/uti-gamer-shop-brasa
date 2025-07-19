import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Sparkles, 
  Layers, 
  Eye, 
  Link,
  Type,
  MousePointer,
  Box,
  Info,
  Image,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BannersConfigTabProps {
  data: any;
  onChange: (config: any) => void;
}

const BannersConfigTab: React.FC<BannersConfigTabProps> = ({ data, onChange }) => {
  const bannerRows = data.banner_rows || [];
  const currentRow = bannerRows[0] || {
    row_id: crypto.randomUUID(),
    layout: '2_col_half',
    banners: [
      {
        type: 'full_width',
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        button_text: '',
        enable_hover_animation: true,
        enable_shadow: false
      },
      {
        type: 'full_width',
        title: '',
        subtitle: '',
        image_url: '',
        link_url: '',
        button_text: '',
        enable_hover_animation: true,
        enable_shadow: false
      }
    ]
  };

  const updateBanner = (bannerIndex: number, field: string, value: any) => {
    const updatedBanners = [...currentRow.banners];
    updatedBanners[bannerIndex] = {
      ...updatedBanners[bannerIndex],
      [field]: value
    };

    const updatedRow = {
      ...currentRow,
      banners: updatedBanners
    };

    const updatedRows = [...bannerRows];
    updatedRows[0] = updatedRow;

    onChange({
      ...data,
      banner_rows: updatedRows
    });
  };

  return (
    <div className="space-y-6">
      {/* Informação Principal */}
      <Alert>
        <Target className="h-4 w-4" />
        <AlertDescription>
          <strong>Seção Principal:</strong> Configure os banners que serão exibidos na sua seção especial. 
          Use os efeitos visuais para criar uma experiência moderna e profissional.
        </AlertDescription>
      </Alert>

      {/* Banner 1 */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Banner 1
            <Badge variant="secondary">Principal</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conteúdo do Banner */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="banner1-title" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Título
              </Label>
              <Input
                id="banner1-title"
                value={currentRow.banners[0]?.title || ''}
                onChange={(e) => updateBanner(0, 'title', e.target.value)}
                placeholder="Ex: Oferta Especial"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner1-subtitle" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Subtítulo
              </Label>
              <Input
                id="banner1-subtitle"
                value={currentRow.banners[0]?.subtitle || ''}
                onChange={(e) => updateBanner(0, 'subtitle', e.target.value)}
                placeholder="Ex: Até 50% de desconto"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="banner1-image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                URL da Imagem
              </Label>
              <Input
                id="banner1-image"
                value={currentRow.banners[0]?.image_url || ''}
                onChange={(e) => updateBanner(0, 'image_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner1-link" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Link de Destino
              </Label>
              <Input
                id="banner1-link"
                value={currentRow.banners[0]?.link_url || ''}
                onChange={(e) => updateBanner(0, 'link_url', e.target.value)}
                placeholder="https://exemplo.com/destino"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner1-button" className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Texto do Botão
            </Label>
            <Input
              id="banner1-button"
              value={currentRow.banners[0]?.button_text || ''}
              onChange={(e) => updateBanner(0, 'button_text', e.target.value)}
              placeholder="Ex: Ver Oferta"
            />
          </div>

          {/* SEÇÃO DESTACADA - Efeitos Visuais */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <Sparkles className="h-5 w-5" />
                ✨ Efeitos Visuais (Banner 1)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <Checkbox
                  id="banner1-hover"
                  checked={currentRow.banners[0]?.enable_hover_animation || false}
                  onCheckedChange={(checked) => updateBanner(0, 'enable_hover_animation', checked)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <div className="flex-1">
                  <Label htmlFor="banner1-hover" className="text-base font-medium cursor-pointer">
                    🎯 Habilitar animação de hover
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona efeito de escala suave quando o usuário passa o mouse
                  </p>
                </div>
                <Badge variant={currentRow.banners[0]?.enable_hover_animation ? 'default' : 'secondary'}>
                  {currentRow.banners[0]?.enable_hover_animation ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <Checkbox
                  id="banner1-shadow"
                  checked={currentRow.banners[0]?.enable_shadow || false}
                  onCheckedChange={(checked) => updateBanner(0, 'enable_shadow', checked)}
                  className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <div className="flex-1">
                  <Label htmlFor="banner1-shadow" className="text-base font-medium cursor-pointer">
                    🎮 Habilitar profundidade (sombra)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona sombra elegante inspirada no design moderno
                  </p>
                </div>
                <Badge variant={currentRow.banners[0]?.enable_shadow ? 'default' : 'secondary'}>
                  {currentRow.banners[0]?.enable_shadow ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Banner 2 */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Banner 2
            <Badge variant="secondary">Secundário</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conteúdo do Banner */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="banner2-title" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Título
              </Label>
              <Input
                id="banner2-title"
                value={currentRow.banners[1]?.title || ''}
                onChange={(e) => updateBanner(1, 'title', e.target.value)}
                placeholder="Ex: Nova Coleção"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner2-subtitle" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Subtítulo
              </Label>
              <Input
                id="banner2-subtitle"
                value={currentRow.banners[1]?.subtitle || ''}
                onChange={(e) => updateBanner(1, 'subtitle', e.target.value)}
                placeholder="Ex: Lançamento exclusivo"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="banner2-image" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                URL da Imagem
              </Label>
              <Input
                id="banner2-image"
                value={currentRow.banners[1]?.image_url || ''}
                onChange={(e) => updateBanner(1, 'image_url', e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner2-link" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                Link de Destino
              </Label>
              <Input
                id="banner2-link"
                value={currentRow.banners[1]?.link_url || ''}
                onChange={(e) => updateBanner(1, 'link_url', e.target.value)}
                placeholder="https://exemplo.com/destino"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner2-button" className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              Texto do Botão
            </Label>
            <Input
              id="banner2-button"
              value={currentRow.banners[1]?.button_text || ''}
              onChange={(e) => updateBanner(1, 'button_text', e.target.value)}
              placeholder="Ex: Descobrir"
            />
          </div>

          {/* SEÇÃO DESTACADA - Efeitos Visuais */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                <Sparkles className="h-5 w-5" />
                ✨ Efeitos Visuais (Banner 2)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <Checkbox
                  id="banner2-hover"
                  checked={currentRow.banners[1]?.enable_hover_animation || false}
                  onCheckedChange={(checked) => updateBanner(1, 'enable_hover_animation', checked)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex-1">
                  <Label htmlFor="banner2-hover" className="text-base font-medium cursor-pointer">
                    🎯 Habilitar animação de hover
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona efeito de escala suave quando o usuário passa o mouse
                  </p>
                </div>
                <Badge variant={currentRow.banners[1]?.enable_hover_animation ? 'default' : 'secondary'}>
                  {currentRow.banners[1]?.enable_hover_animation ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <Checkbox
                  id="banner2-shadow"
                  checked={currentRow.banners[1]?.enable_shadow || false}
                  onCheckedChange={(checked) => updateBanner(1, 'enable_shadow', checked)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex-1">
                  <Label htmlFor="banner2-shadow" className="text-base font-medium cursor-pointer">
                    🎮 Habilitar profundidade (sombra)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Adiciona sombra elegante inspirada no design moderno
                  </p>
                </div>
                <Badge variant={currentRow.banners[1]?.enable_shadow ? 'default' : 'secondary'}>
                  {currentRow.banners[1]?.enable_shadow ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Informações de Ajuda */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Dicas para Melhores Resultados
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Use imagens de alta qualidade (mínimo 1200px de largura)</li>
                <li>• Teste os efeitos visuais para encontrar a combinação perfeita</li>
                <li>• Mantenha títulos concisos e calls-to-action claros</li>
                <li>• A animação de hover funciona apenas em dispositivos com mouse</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BannersConfigTab;