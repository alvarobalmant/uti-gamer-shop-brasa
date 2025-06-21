
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { PageFormData } from './types';

interface PageFormProps {
  formData: Partial<PageFormData>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSwitchChange: (checked: boolean) => void;
}

const PageForm: React.FC<PageFormProps> = ({
  formData,
  onInputChange,
  onSwitchChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da Página *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={onInputChange}
            placeholder="Ex: Xbox"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL da Página *</Label>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">/</span>
            <Input
              id="slug"
              name="slug"
              value={formData.slug || ''}
              onChange={onInputChange}
              placeholder="Ex: xbox"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={onInputChange}
          placeholder="Descreva brevemente o conteúdo desta página"
          rows={3}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tema da Página</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="theme.primaryColor">Cor Primária</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="theme.primaryColor"
                name="theme.primaryColor"
                type="color"
                value={formData.theme?.primaryColor || '#107C10'}
                onChange={onInputChange}
                className="w-12 h-8 p-1"
              />
              <Input
                value={formData.theme?.primaryColor || '#107C10'}
                onChange={onInputChange}
                name="theme.primaryColor"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="theme.secondaryColor">Cor Secundária</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="theme.secondaryColor"
                name="theme.secondaryColor"
                type="color"
                value={formData.theme?.secondaryColor || '#3A3A3A'}
                onChange={onInputChange}
                className="w-12 h-8 p-1"
              />
              <Input
                value={formData.theme?.secondaryColor || '#3A3A3A'}
                onChange={onInputChange}
                name="theme.secondaryColor"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4">
        <Switch
          id="isActive"
          checked={formData.isActive ?? true}
          onCheckedChange={onSwitchChange}
        />
        <Label htmlFor="isActive">Página Ativa</Label>
      </div>
    </div>
  );
};

export default PageForm;
