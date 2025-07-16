import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { SpecialSection, SpecialSectionCreateInput, SpecialSectionUpdateInput } from '@/types/specialSections';
import BasicConfigTab from './BasicConfigTab';
import BannersConfigTab from './BannersConfigTab';
import StyleConfigTab from './StyleConfigTab';
import { useToast } from '@/hooks/use-toast';

interface SpecialSectionEditorProps {
  section: SpecialSection | null;
  onSubmit: (data: SpecialSectionCreateInput | SpecialSectionUpdateInput) => Promise<void>;
  onCancel: () => void;
}

const SpecialSectionEditor: React.FC<SpecialSectionEditorProps> = ({
  section,
  onSubmit,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: section?.title || '',
    description: section?.description || '',
    is_active: section?.is_active ?? true,
    background_type: section?.background_type || 'color',
    background_value: section?.background_value || '#ffffff',
    background_image_position: section?.background_image_position || 'center',
    content_config: section?.content_config || {
      banner_rows: [{
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
      }]
    }
  });
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSubmit(formData);
      toast({
        title: "Sucesso!",
        description: section ? "Seção atualizada com sucesso!" : "Seção criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar seção. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateContentConfig = (config: any) => {
    setFormData((prev: any) => ({
      ...prev,
      content_config: config
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {section ? 'Editar Seção Especial' : 'Nova Seção Especial'}
            </h2>
            <p className="text-muted-foreground">
              Configure sua seção especial de forma intuitiva e profissional
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Salvando...' : 'Salvar Seção'}
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração da Seção</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Configurações Básicas</TabsTrigger>
              <TabsTrigger value="banners" className="font-semibold">
                🎯 Banners (Principal)
              </TabsTrigger>
              <TabsTrigger value="style">Estilo Visual</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basic" className="space-y-6">
                <BasicConfigTab
                  data={formData}
                  onChange={updateFormData}
                />
              </TabsContent>

              <TabsContent value="banners" className="space-y-6">
                <BannersConfigTab
                  data={formData.content_config || { banner_rows: [] }}
                  onChange={updateContentConfig}
                />
              </TabsContent>

              <TabsContent value="style" className="space-y-6">
                <StyleConfigTab
                  data={formData}
                  onChange={updateFormData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialSectionEditor;