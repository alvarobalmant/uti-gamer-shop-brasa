
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Trash2, Save, ArrowUp, ArrowDown, Grid, Image, Type, Package, Eye, EyeOff } from 'lucide-react';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';

interface SpecialSection {
  id: string;
  title: string;
  description?: string;
  background_type: 'color' | 'gradient' | 'image';
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  padding_top?: number;
  padding_bottom?: number;
  padding_left?: number;
  padding_right?: number;
  margin_top?: number;
  margin_bottom?: number;
  border_radius?: number;
  display_order?: number;
  is_active?: boolean;
  content_config?: any;
  mobile_settings?: any;
  elements?: SpecialSectionElement[];
}

interface SpecialSectionElement {
  id: string;
  special_section_id: string;
  element_type: 'banner' | 'products' | 'text' | 'image' | 'grid';
  title?: string;
  subtitle?: string;
  content_type?: string;
  content_ids?: any;
  image_url?: string;
  link_url?: string;
  link_text?: string;
  background_type?: string;
  background_color?: string;
  background_gradient?: string;
  background_image_url?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  width_percentage?: number;
  height_desktop?: number;
  height_mobile?: number;
  padding?: number;
  margin_bottom?: number;
  border_radius?: number;
  grid_position?: string;
  grid_size?: string;
  visible_items_desktop?: number;
  visible_items_tablet?: number;
  visible_items_mobile?: number;
  display_order?: number;
  is_active?: boolean;
  mobile_settings?: any;
}

export const SpecialSectionManager = () => {
  const { sections, elements, loading, createSection, updateSection, deleteSection, createElement, updateElement, deleteElement } = useSpecialSections();
  const [selectedSection, setSelectedSection] = useState<SpecialSection | null>(null);
  const [selectedElement, setSelectedElement] = useState<SpecialSectionElement | null>(null);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [activeTab, setActiveTab] = useState('sections');

  const [sectionForm, setSectionForm] = useState<Partial<SpecialSection>>({
    title: '',
    description: '',
    background_type: 'color',
    background_color: '#FFFFFF',
    padding_top: 40,
    padding_bottom: 40,
    padding_left: 20,
    padding_right: 20,
    margin_top: 50,
    margin_bottom: 50,
    border_radius: 0,
    is_active: true,
  });

  const [elementForm, setElementForm] = useState<Partial<SpecialSectionElement>>({
    element_type: 'banner',
    title: '',
    subtitle: '',
    background_type: 'color',
    background_color: '#FFFFFF',
    text_color: '#000000',
    width_percentage: 100,
    height_desktop: 400,
    height_mobile: 300,
    padding: 20,
    margin_bottom: 30,
    border_radius: 0,
    visible_items_desktop: 4,
    visible_items_tablet: 3,
    visible_items_mobile: 1,
    is_active: true,
  });

  const handleSaveSection = async () => {
    try {
      if (isEditingSection && selectedSection) {
        await updateSection(selectedSection.id, sectionForm);
        toast.success('Seção especial atualizada com sucesso!');
      } else {
        await createSection(sectionForm);
        toast.success('Seção especial criada com sucesso!');
      }
      
      resetSectionForm();
    } catch (error) {
      toast.error('Erro ao salvar seção especial');
      console.error('Error saving section:', error);
    }
  };

  const handleSaveElement = async () => {
    if (!selectedSection) {
      toast.error('Selecione uma seção primeiro');
      return;
    }

    try {
      const elementData = {
        ...elementForm,
        special_section_id: selectedSection.id,
      };

      if (isEditingElement && selectedElement) {
        await updateElement(selectedElement.id, elementData);
        toast.success('Elemento atualizado com sucesso!');
      } else {
        await createElement(elementData);
        toast.success('Elemento criado com sucesso!');
      }
      
      resetElementForm();
    } catch (error) {
      toast.error('Erro ao salvar elemento');
      console.error('Error saving element:', error);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection(sectionId);
      toast.success('Seção especial excluída com sucesso!');
      if (selectedSection?.id === sectionId) {
        setSelectedSection(null);
      }
    } catch (error) {
      toast.error('Erro ao excluir seção especial');
      console.error('Error deleting section:', error);
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    try {
      await deleteElement(elementId);
      toast.success('Elemento excluído com sucesso!');
      if (selectedElement?.id === elementId) {
        setSelectedElement(null);
      }
    } catch (error) {
      toast.error('Erro ao excluir elemento');
      console.error('Error deleting element:', error);
    }
  };

  const resetSectionForm = () => {
    setSectionForm({
      title: '',
      description: '',
      background_type: 'color',
      background_color: '#FFFFFF',
      padding_top: 40,
      padding_bottom: 40,
      padding_left: 20,
      padding_right: 20,
      margin_top: 50,
      margin_bottom: 50,
      border_radius: 0,
      is_active: true,
    });
    setSelectedSection(null);
    setIsEditingSection(false);
  };

  const resetElementForm = () => {
    setElementForm({
      element_type: 'banner',
      title: '',
      subtitle: '',
      background_type: 'color',
      background_color: '#FFFFFF',
      text_color: '#000000',
      width_percentage: 100,
      height_desktop: 400,
      height_mobile: 300,
      padding: 20,
      margin_bottom: 30,
      border_radius: 0,
      visible_items_desktop: 4,
      visible_items_tablet: 3,
      visible_items_mobile: 1,
      is_active: true,
    });
    setSelectedElement(null);
    setIsEditingElement(false);
  };

  const editSection = (section: SpecialSection) => {
    setSelectedSection(section);
    setSectionForm(section);
    setIsEditingSection(true);
    setActiveTab('section-form');
  };

  const editElement = (element: SpecialSectionElement) => {
    setSelectedElement(element);
    setElementForm(element);
    setIsEditingElement(true);
    setActiveTab('element-form');
  };

  const getSectionElements = (sectionId: string) => {
    return elements.filter(element => element.special_section_id === sectionId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Carregando seções especiais...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Seções Especiais</h2>
          <p className="text-gray-400">Crie e gerencie seções personalizadas para sua página</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="section-form">
            {isEditingSection ? 'Editar Seção' : 'Nova Seção'}
          </TabsTrigger>
          <TabsTrigger value="elements" disabled={!selectedSection}>
            Elementos
          </TabsTrigger>
          <TabsTrigger value="element-form" disabled={!selectedSection}>
            {isEditingElement ? 'Editar Elemento' : 'Novo Elemento'}
          </TabsTrigger>
        </TabsList>

        {/* Seções List */}
        <TabsContent value="sections">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Seções Especiais</CardTitle>
                <Button
                  onClick={() => {
                    resetSectionForm();
                    setActiveTab('section-form');
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Seção
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
                    onClick={() => setSelectedSection(section)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-white">{section.title}</h3>
                        <Badge variant={section.is_active ? "default" : "secondary"}>
                          {section.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {section.description && (
                        <p className="text-sm text-gray-400 mt-1">{section.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Elementos: {getSectionElements(section.id).length}</span>
                        <span>Ordem: {section.display_order || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          editSection(section);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta seção especial? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSection(section.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}

                {sections.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Nenhuma seção especial encontrada. Crie sua primeira seção!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Section Form */}
        <TabsContent value="section-form">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {isEditingSection ? 'Editar Seção Especial' : 'Nova Seção Especial'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Título</Label>
                  <Input
                    id="title"
                    value={sectionForm.title || ''}
                    onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                    placeholder="Digite o título da seção"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_type" className="text-white">Tipo de Fundo</Label>
                  <Select
                    value={sectionForm.background_type || 'color'}
                    onValueChange={(value) => setSectionForm({ ...sectionForm, background_type: value as 'color' | 'gradient' | 'image' })}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="color">Cor Sólida</SelectItem>
                      <SelectItem value="gradient">Gradiente</SelectItem>
                      <SelectItem value="image">Imagem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  value={sectionForm.description || ''}
                  onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                  placeholder="Descrição da seção (opcional)"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {/* Background Settings */}
              {sectionForm.background_type === 'color' && (
                <div className="space-y-2">
                  <Label htmlFor="background_color" className="text-white">Cor de Fundo</Label>
                  <Input
                    id="background_color"
                    type="color"
                    value={sectionForm.background_color || '#FFFFFF'}
                    onChange={(e) => setSectionForm({ ...sectionForm, background_color: e.target.value })}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
              )}

              {sectionForm.background_type === 'gradient' && (
                <div className="space-y-2">
                  <Label htmlFor="background_gradient" className="text-white">Gradiente CSS</Label>
                  <Input
                    id="background_gradient"
                    value={sectionForm.background_gradient || ''}
                    onChange={(e) => setSectionForm({ ...sectionForm, background_gradient: e.target.value })}
                    placeholder="Ex: linear-gradient(45deg, #ff0000, #0000ff)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              )}

              {sectionForm.background_type === 'image' && (
                <div className="space-y-2">
                  <Label className="text-white">Imagem de Fundo</Label>
                  <ImageUpload
                    onImageSelect={(url) => setSectionForm({ ...sectionForm, background_image_url: url })}
                    currentImage={sectionForm.background_image_url}
                  />
                </div>
              )}

              {/* Spacing Settings */}
              <Separator />
              <h3 className="text-lg font-medium text-white">Espaçamento</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="padding_top" className="text-white">Padding Top</Label>
                  <Input
                    id="padding_top"
                    type="number"
                    value={sectionForm.padding_top || 0}
                    onChange={(e) => setSectionForm({ ...sectionForm, padding_top: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="padding_bottom" className="text-white">Padding Bottom</Label>
                  <Input
                    id="padding_bottom"
                    type="number"
                    value={sectionForm.padding_bottom || 0}
                    onChange={(e) => setSectionForm({ ...sectionForm, padding_bottom: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin_top" className="text-white">Margin Top</Label>
                  <Input
                    id="margin_top"
                    type="number"
                    value={sectionForm.margin_top || 0}
                    onChange={(e) => setSectionForm({ ...sectionForm, margin_top: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="border_radius" className="text-white">Border Radius</Label>
                  <Input
                    id="border_radius"
                    type="number"
                    value={sectionForm.border_radius || 0}
                    onChange={(e) => setSectionForm({ ...sectionForm, border_radius: parseInt(e.target.value) })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={sectionForm.is_active || false}
                    onCheckedChange={(checked) => setSectionForm({ ...sectionForm, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="text-white">Seção Ativa</Label>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={resetSectionForm}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSaveSection}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditingSection ? 'Atualizar' : 'Criar'} Seção
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Elements List */}
        <TabsContent value="elements">
          {selectedSection && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Elementos da Seção</CardTitle>
                    <p className="text-gray-400 mt-1">Seção: {selectedSection.title}</p>
                  </div>
                  <Button
                    onClick={() => {
                      resetElementForm();
                      setActiveTab('element-form');
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Elemento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getSectionElements(selectedSection.id).map((element) => (
                    <div
                      key={element.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {element.element_type === 'banner' && <Type className="w-4 h-4 text-blue-400" />}
                            {element.element_type === 'image' && <Image className="w-4 h-4 text-green-400" />}
                            {element.element_type === 'products' && <Package className="w-4 h-4 text-purple-400" />}
                            {element.element_type === 'grid' && <Grid className="w-4 h-4 text-orange-400" />}
                          </div>
                          <h3 className="font-medium text-white">
                            {element.title || `Elemento ${element.element_type}`}
                          </h3>
                          <Badge variant={element.is_active ? "default" : "secondary"}>
                            {element.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Tipo: {element.element_type}</span>
                          <span>Ordem: {element.display_order || 0}</span>
                          {element.width_percentage && <span>Largura: {element.width_percentage}%</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editElement(element)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este elemento? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteElement(element.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}

                  {getSectionElements(selectedSection.id).length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      Nenhum elemento encontrado. Adicione elementos à esta seção!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Element Form */}
        <TabsContent value="element-form">
          {selectedSection && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {isEditingElement ? 'Editar Elemento' : 'Novo Elemento'}
                </CardTitle>
                <p className="text-gray-400">Seção: {selectedSection.title}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="element_type" className="text-white">Tipo de Elemento</Label>
                    <Select
                      value={elementForm.element_type || 'banner'}
                      onValueChange={(value) => setElementForm({ ...elementForm, element_type: value as any })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="products">Produtos</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="element_title" className="text-white">Título</Label>
                    <Input
                      id="element_title"
                      value={elementForm.title || ''}
                      onChange={(e) => setElementForm({ ...elementForm, title: e.target.value })}
                      placeholder="Título do elemento"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="element_subtitle" className="text-white">Subtítulo</Label>
                  <Input
                    id="element_subtitle"
                    value={elementForm.subtitle || ''}
                    onChange={(e) => setElementForm({ ...elementForm, subtitle: e.target.value })}
                    placeholder="Subtítulo do elemento (opcional)"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                {/* Element-specific settings */}
                {(elementForm.element_type === 'banner' || elementForm.element_type === 'image') && (
                  <div className="space-y-2">
                    <Label className="text-white">Imagem</Label>
                    <ImageUpload
                      onImageSelect={(url) => setElementForm({ ...elementForm, image_url: url })}
                      currentImage={elementForm.image_url}
                    />
                  </div>
                )}

                {elementForm.element_type === 'banner' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="link_url" className="text-white">URL do Link</Label>
                      <Input
                        id="link_url"
                        value={elementForm.link_url || ''}
                        onChange={(e) => setElementForm({ ...elementForm, link_url: e.target.value })}
                        placeholder="https://exemplo.com"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="link_text" className="text-white">Texto do Botão</Label>
                      <Input
                        id="link_text"
                        value={elementForm.link_text || ''}
                        onChange={(e) => setElementForm({ ...elementForm, link_text: e.target.value })}
                        placeholder="Clique aqui"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}

                {elementForm.element_type === 'products' && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="visible_items_desktop" className="text-white">Itens Desktop</Label>
                      <Input
                        id="visible_items_desktop"
                        type="number"
                        value={elementForm.visible_items_desktop || 4}
                        onChange={(e) => setElementForm({ ...elementForm, visible_items_desktop: parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visible_items_tablet" className="text-white">Itens Tablet</Label>
                      <Input
                        id="visible_items_tablet"
                        type="number"
                        value={elementForm.visible_items_tablet || 3}
                        onChange={(e) => setElementForm({ ...elementForm, visible_items_tablet: parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visible_items_mobile" className="text-white">Itens Mobile</Label>
                      <Input
                        id="visible_items_mobile"
                        type="number"
                        value={elementForm.visible_items_mobile || 1}
                        onChange={(e) => setElementForm({ ...elementForm, visible_items_mobile: parseInt(e.target.value) })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Styling Options */}
                <Separator />
                <h3 className="text-lg font-medium text-white">Estilo</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width_percentage" className="text-white">Largura (%)</Label>
                    <Input
                      id="width_percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={elementForm.width_percentage || 100}
                      onChange={(e) => setElementForm({ ...elementForm, width_percentage: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height_desktop" className="text-white">Altura Desktop (px)</Label>
                    <Input
                      id="height_desktop"
                      type="number"
                      value={elementForm.height_desktop || 400}
                      onChange={(e) => setElementForm({ ...elementForm, height_desktop: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="element_padding" className="text-white">Padding</Label>
                    <Input
                      id="element_padding"
                      type="number"
                      value={elementForm.padding || 0}
                      onChange={(e) => setElementForm({ ...elementForm, padding: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="element_margin_bottom" className="text-white">Margin Bottom</Label>
                    <Input
                      id="element_margin_bottom"
                      type="number"
                      value={elementForm.margin_bottom || 0}
                      onChange={(e) => setElementForm({ ...elementForm, margin_bottom: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="element_border_radius" className="text-white">Border Radius</Label>
                    <Input
                      id="element_border_radius"
                      type="number"
                      value={elementForm.border_radius || 0}
                      onChange={(e) => setElementForm({ ...elementForm, border_radius: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order" className="text-white">Ordem</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={elementForm.display_order || 0}
                      onChange={(e) => setElementForm({ ...elementForm, display_order: parseInt(e.target.value) })}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="element_is_active"
                      checked={elementForm.is_active || false}
                      onCheckedChange={(checked) => setElementForm({ ...elementForm, is_active: checked })}
                    />
                    <Label htmlFor="element_is_active" className="text-white">Elemento Ativo</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={resetElementForm}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSaveElement}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isEditingElement ? 'Atualizar' : 'Criar'} Elemento
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
