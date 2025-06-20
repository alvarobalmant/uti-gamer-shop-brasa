import React, { useState, useCallback, useEffect } from 'react';
import { Controller, useFieldArray, Control, UseFormSetValue } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, Trash2, ArrowUp, ArrowDown, Image, Upload, ExternalLink, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface BannerConfig {
  type: 'full_width' | 'half_width' | 'third_width' | 'quarter_width' | 'product_highlight';
  image_url?: string;
  link_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  enable_hover_animation?: boolean;
}

interface BannerRowConfig {
  row_id?: string;
  layout: '1_col_full' | '2_col_half' | '3_col_third' | '4_col_quarter' | 'custom';
  banners: BannerConfig[];
  custom_sizes?: Array<{width: string, widthUnit: string, height: string}>; // Para layouts customizados
}

interface BannersSectionProps {
  control: Control<any>;
  onImageUpload: (file: File) => Promise<string>;
  setValue: UseFormSetValue<any>;
}

const BannersSection: React.FC<BannersSectionProps> = ({ control, onImageUpload, setValue }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<'1_col_full' | '2_col_half' | '3_col_third' | '4_col_quarter' | 'custom'>('1_col_full');
  const [customBannerCount, setCustomBannerCount] = useState(2);
  const [customBannerSizes, setCustomBannerSizes] = useState<Array<{width: string, widthUnit: string, height: string}>>([
    {width: '50', widthUnit: '%', height: 'auto'}, 
    {width: '50', widthUnit: '%', height: 'auto'}
  ]);
  const [uploadingImages, setUploadingImages] = useState<{ [key: string]: boolean }>({});

  const { fields: bannerRows, append: appendBannerRow, remove: removeBannerRow, move: moveBannerRow } = useFieldArray({
    control,
    name: 'banner_rows',
  });

  const getLayoutDisplayName = (layout: string) => {
    switch (layout) {
      case '1_col_full': return '1 Coluna (Full Width)';
      case '2_col_half': return '2 Colunas (Half Width)';
      case '3_col_third': return '3 Colunas (Third Width)';
      case '4_col_quarter': return '4 Colunas (Quarter Width)';
      case 'custom': return 'Layout Personalizado';
      default: return layout;
    }
  };

  const getLayoutIcon = (layout: string) => {
    switch (layout) {
      case '1_col_full': return '█';
      case '2_col_half': return '█ █';
      case '3_col_third': return '█ █ █';
      case '4_col_quarter': return '█ █ █ █';
      case 'custom': return '⚙️';
      default: return '█';
    }
  };

  // Função para atualizar tamanhos customizados quando a quantidade muda
  const updateCustomBannerCount = (count: number) => {
    setCustomBannerCount(count);
    const equalWidth = Math.floor(100 / count);
    const remainder = 100 - (equalWidth * count);
    const newSizes = Array.from({ length: count }, (_, index) => ({
      width: (index === 0 ? equalWidth + remainder : equalWidth).toString(),
      widthUnit: '%',
      height: 'auto'
    }));
    setCustomBannerSizes(newSizes);
  };

  // Função para obter recomendações de tamanho
  const getSizeRecommendations = () => {
    return [
      { label: 'Banner Pequeno', width: '300', widthUnit: 'px', height: '200px' },
      { label: 'Banner Médio', width: '500', widthUnit: 'px', height: '300px' },
      { label: 'Banner Grande', width: '800', widthUnit: 'px', height: '400px' },
      { label: 'Banner Full Width', width: '100', widthUnit: '%', height: 'auto' },
      { label: 'Banner Quadrado', width: '400', widthUnit: 'px', height: '400px' },
      { label: 'Banner Alto', width: '300', widthUnit: 'px', height: '500px' },
    ];
  };

  // Função para obter opções de unidade
  const getWidthUnitOptions = () => {
    return [
      { value: 'px', label: 'px' },
      { value: '%', label: '%' },
      { value: 'vw', label: 'vw' },
      { value: 'em', label: 'em' },
      { value: 'rem', label: 'rem' },
    ];
  };

  const addBannerRow = useCallback(() => {
    let bannersCount: number;
    let customSizes: Array<{width: string, widthUnit: string, height: string}> | undefined;

    if (selectedLayout === 'custom') {
      bannersCount = customBannerCount;
      customSizes = [...customBannerSizes];
    } else {
      bannersCount = selectedLayout === '1_col_full' ? 1 
                   : selectedLayout === '2_col_half' ? 2
                   : selectedLayout === '3_col_third' ? 3
                   : 4;
    }
    
    const newBanners = Array.from({ length: bannersCount }, () => ({
      type: 'full_width' as const,
      image_url: '',
      link_url: '',
      title: '',
      subtitle: '',
      button_text: '',
      enable_hover_animation: true,
    }));

    const newRow: any = {
      row_id: crypto.randomUUID(),
      layout: selectedLayout,
      banners: newBanners,
    };

    if (selectedLayout === 'custom') {
      newRow.custom_sizes = customSizes;
    }

    appendBannerRow(newRow, { shouldFocus: false });
    
    setIsModalOpen(false);
  }, [appendBannerRow, selectedLayout, customBannerCount, customBannerSizes]);

  const handleImageUploadForBanner = useCallback(async (file: File, rowIndex: number, bannerIndex: number) => {
    const uploadKey = `${rowIndex}-${bannerIndex}`;
    setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

    try {
      const imageUrl = await onImageUpload(file);
      setValue(`banner_rows.${rowIndex}.banners.${bannerIndex}.image_url`, imageUrl);
      console.log("Image uploaded:", imageUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert(`Erro ao fazer upload da imagem: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  }, [onImageUpload, setValue]);

  const getExpectedDimensions = (layout: BannerRowConfig["layout"]) => {
    switch (layout) {
      case "1_col_full":
        return { width: 1200, height: 180 };
      case "2_col_half":
      case "3_col_third":
      case "4_col_quarter":
        return { width: 600, height: 300 };
      default:
        return { width: 0, height: 0 }; // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da seção */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Configuração de Banners</h2>
          <p className="text-gray-400 mt-1">Organize banners em linhas com diferentes layouts</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF8C00] hover:bg-[#FF7700] text-white">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Linha de Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C44] border-[#343A40] text-white max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Selecionar Layout da Linha</DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <RadioGroup value={selectedLayout} onValueChange={(value: any) => setSelectedLayout(value)}>
                {[
                  { value: '1_col_full', label: '1 Coluna (Full Width)', icon: '█' },
                  { value: '2_col_half', label: '2 Colunas (Half Width)', icon: '█ █' },
                  { value: '3_col_third', label: '3 Colunas (Third Width)', icon: '█ █ █' },
                  { value: '4_col_quarter', label: '4 Colunas (Quarter Width)', icon: '█ █ █ █' },
                  { value: 'custom', label: 'Layout Personalizado', icon: '⚙️' },
                ].map((layout) => (
                  <div key={layout.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={layout.value} id={layout.value} />
                    <Label htmlFor={layout.value} className="flex items-center gap-3 cursor-pointer">
                      <span className="font-mono text-blue-300">{layout.icon}</span>
                      <span>{layout.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Configurações para layout personalizado */}
              {selectedLayout === 'custom' && (
                <div className="mt-4 p-4 bg-[#1A1A2E] rounded-lg border border-[#343A40]">
                  <h4 className="text-white font-medium mb-3">Configuração Personalizada</h4>
                  
                  {/* Quantidade de banners */}
                  <div className="mb-4">
                    <Label className="text-gray-300 mb-2 block">Quantidade de banners</Label>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      value={customBannerCount}
                      onChange={(e) => updateCustomBannerCount(parseInt(e.target.value) || 1)}
                      className="bg-[#2C2C44] border-[#343A40] text-white w-20"
                    />
                  </div>

                  {/* Tamanhos dos banners */}
                  <div>
                    <Label className="text-gray-300 mb-3 block">Configuração de cada banner</Label>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {customBannerSizes.map((size, index) => (
                        <div key={index} className="p-3 bg-[#2C2C44] rounded border border-[#343A40]">
                          <h5 className="text-white font-medium mb-3">Banner {index + 1}</h5>
                          
                          {/* Largura */}
                          <div className="mb-3">
                            <Label className="text-gray-300 mb-1 block text-sm">Largura</Label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={size.width}
                                onChange={(e) => {
                                  const newSizes = [...customBannerSizes];
                                  newSizes[index] = { ...newSizes[index], width: e.target.value };
                                  setCustomBannerSizes(newSizes);
                                }}
                                className="bg-[#1A1A2E] border-[#343A40] text-white flex-1"
                                placeholder="ex: 500, 50, 30"
                              />
                              <select
                                value={size.widthUnit}
                                onChange={(e) => {
                                  const newSizes = [...customBannerSizes];
                                  newSizes[index] = { ...newSizes[index], widthUnit: e.target.value };
                                  setCustomBannerSizes(newSizes);
                                }}
                                className="bg-[#1A1A2E] border border-[#343A40] text-white rounded px-2 py-1 text-sm min-w-[60px]"
                              >
                                {getWidthUnitOptions().map((unit) => (
                                  <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Altura */}
                          <div className="mb-3">
                            <Label className="text-gray-300 mb-1 block text-sm">Altura</Label>
                            <div className="flex gap-2">
                              <Input
                                type="text"
                                value={size.height}
                                onChange={(e) => {
                                  const newSizes = [...customBannerSizes];
                                  newSizes[index] = { ...newSizes[index], height: e.target.value };
                                  setCustomBannerSizes(newSizes);
                                }}
                                className="bg-[#1A1A2E] border-[#343A40] text-white flex-1"
                                placeholder="ex: 300px, auto, 50vh"
                              />
                            </div>
                          </div>

                          {/* Recomendações rápidas */}
                          <div>
                            <Label className="text-gray-300 mb-2 block text-sm">Tamanhos recomendados:</Label>
                            <div className="flex flex-wrap gap-1">
                              {getSizeRecommendations().map((rec, recIndex) => (
                                <Button
                                  key={recIndex}
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6 px-2 bg-[#1A1A2E] border-[#343A40] text-gray-300 hover:bg-[#343A40]"
                                  onClick={() => {
                                    const newSizes = [...customBannerSizes];
                                    newSizes[index] = { 
                                      width: rec.width, 
                                      widthUnit: rec.widthUnit, 
                                      height: rec.height 
                                    };
                                    setCustomBannerSizes(newSizes);
                                  }}
                                >
                                  {rec.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-3 bg-[#1A1A2E] rounded border border-[#343A40]">
                      <p className="text-xs text-gray-400 mb-2">
                        <strong>💡 Dicas de tamanhos:</strong>
                      </p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        <li>• <strong>Pixels:</strong> 500px (tamanho fixo)</li>
                        <li>• <strong>Porcentagem:</strong> 50% (relativo ao container)</li>
                        <li>• <strong>Viewport:</strong> 30vw (relativo à largura da tela)</li>
                        <li>• <strong>Em/Rem:</strong> 20em, 15rem (relativo à fonte)</li>
                        <li>• <strong>Altura:</strong> 300px, auto, 50vh</li>
                        <li>• <strong>Centralização:</strong> Banners sempre centralizados automaticamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="flex-shrink-0 mt-4 pt-4 border-t border-[#343A40]">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={addBannerRow} className="bg-[#FF8C00] hover:bg-[#FF7700]">
                Adicionar Linha
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de linhas de banners */}
      {bannerRows.length === 0 ? (
        <Card className="bg-[#2C2C44] border-[#343A40] border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Image className="h-12 w-12 text-gray-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum banner configurado</h3>
            <p className="text-gray-500 text-center mb-4">
              Adicione sua primeira linha de banners para começar a configurar a seção especial.
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#FF8C00] hover:bg-[#FF7700] text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Primeira Linha
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bannerRows.map((row, rowIndex) => (
            <Card key={row.id} className="bg-[#2C2C44] border-[#343A40]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#FF8C00] text-white">
                      Linha {rowIndex + 1}
                    </Badge>
                    <span className="text-gray-300">{getLayoutDisplayName(row.layout)}</span>
                    <span className="font-mono text-blue-300">{getLayoutIcon(row.layout)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveBannerRow(rowIndex, Math.max(0, rowIndex - 1))}
                      disabled={rowIndex === 0}
                      className="border-gray-600 text-gray-300"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveBannerRow(rowIndex, Math.min(bannerRows.length - 1, rowIndex + 1))}
                      disabled={rowIndex === bannerRows.length - 1}
                      className="border-gray-600 text-gray-300"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBannerRow(rowIndex)}
                      className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className={`grid gap-4 ${
                  row.layout === '1_col_full' ? 'grid-cols-1' :
                  row.layout === '2_col_half' ? 'grid-cols-1 md:grid-cols-2' :
                  row.layout === '3_col_third' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {row.banners.map((banner, bannerIndex) => {
                    const uploadKey = `${rowIndex}-${bannerIndex}`;
                    const isUploading = uploadingImages[uploadKey];

                    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUploadForBanner(file, rowIndex, bannerIndex);
                      }
                    };

                    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        handleImageUploadForBanner(file, rowIndex, bannerIndex);
                      }
                    };

                    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
                      e.preventDefault();
                      e.stopPropagation();
                    };

                    return (
                      <Card key={bannerIndex} className="bg-[#343A40] border-[#495057]">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm text-gray-300">
                            Banner {bannerIndex + 1}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Upload de Imagem */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Imagem {row.layout === '1_col_full' ? '(Proporção: 20:3, Tamanho Recomendado: 1200x180px)' : '(Proporção: 2:1, Tamanho Recomendado: 600x300px)'}</Label>
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.image_url`}
                              control={control}
                              render={({ field }) => (
                                <div className="space-y-2">
                                  {field.value ? (
                                    <div className="relative">
                                      <img 
                                        src={field.value} 
                                        alt="Banner preview" 
                                        className="w-full h-24 object-cover rounded border border-[#495057]"
                                      />
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => field.onChange('')}
                                        className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-600 border-red-600 text-white hover:bg-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <div 
                                      className="border-2 border-dashed border-[#495057] rounded-lg p-4 text-center cursor-pointer"
                                      onDrop={handleDrop}
                                      onDragOver={handleDragOver}
                                      onClick={() => document.getElementById(`image-upload-${rowIndex}-${bannerIndex}`)?.click()}
                                    >
                                      {isUploading ? (
                                        <div className="flex flex-col items-center justify-center">
                                          <Loader2 className="h-6 w-6 text-blue-400 animate-spin mb-2" />
                                          <p className="text-xs text-blue-400">Enviando...</p>
                                        </div>
                                      ) : (
                                        <>
                                          <Upload className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                                          <p className="text-xs text-gray-500 mb-2">Arraste e solte ou clique para fazer upload</p>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id={`image-upload-${rowIndex}-${bannerIndex}`}
                                          />
                                          <Label 
                                            htmlFor={`image-upload-${rowIndex}-${bannerIndex}`}
                                            className="cursor-pointer text-blue-400 hover:text-blue-300 text-xs"
                                          >
                                            Selecionar arquivo
                                          </Label>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                          </div>

                          {/* URL do Link */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Link URL</Label>
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.link_url`}
                              control={control}
                              render={({ field }) => (
                                <div className="relative">
                                  <Input
                                    {...field}
                                    placeholder="https://..."
                                    className="bg-[#1A1A2E] border-[#495057] text-white text-xs pr-8"
                                  />
                                  {field.value && (
                                    <ExternalLink className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                                  )}
                                </div>
                              )}
                            />
                          </div>

                          {/* Título */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Título</Label>
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.title`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Título do banner"
                                  className="bg-[#1A1A2E] border-[#495057] text-white text-xs"
                                />
                              )}
                            />
                          </div>

                          {/* Subtítulo */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Subtítulo</Label>
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.subtitle`}
                              control={control}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="Subtítulo ou descrição"
                                  className="bg-[#1A1A2E] border-[#495057] text-white text-xs"
                                />
                              )}
                            />
                          </div>

                          {/* Texto do Botão */}
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-400">Texto do Botão</Label>
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.button_text`}
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="Comprar Agora"
                                  className="bg-[#1A1A2E] border-[#495057] text-white text-xs"
                                />
                              )}
                            />
                          </div>

                          {/* Animação de Hover */}
                          <div className="flex items-center space-x-2">
                            <Controller
                              name={`banner_rows.${rowIndex}.banners.${bannerIndex}.enable_hover_animation`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  id={`hover-animation-${rowIndex}-${bannerIndex}`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-[#495057] data-[state=checked]:bg-[#FF8C00] data-[state=checked]:text-white"
                                />
                              )}
                            />
                            <Label htmlFor={`hover-animation-${rowIndex}-${bannerIndex}`} className="text-xs text-gray-300">
                              Habilitar animação de hover
                            </Label>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannersSection;


