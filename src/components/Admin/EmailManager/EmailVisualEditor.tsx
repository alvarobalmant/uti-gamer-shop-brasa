import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Type, 
  Image, 
  Square as ButtonIcon, 
  Trash2, 
  Settings, 
  Plus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Move
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SortableEmailBlock } from './SortableEmailBlock';

export interface EmailBlock {
  id: string;
  type: 'text' | 'image' | 'button' | 'spacer' | 'divider';
  content: any;
  styles: any;
}

interface EmailVisualEditorProps {
  initialBlocks?: EmailBlock[];
  onChange: (blocks: EmailBlock[], html: string) => void;
  emailConfig?: any;
}

export const EmailVisualEditor: React.FC<EmailVisualEditorProps> = ({
  initialBlocks = [],
  onChange,
  emailConfig
}) => {
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const generateId = () => `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const blockTemplates = [
    {
      type: 'text',
      icon: Type,
      label: 'Texto',
      defaultContent: {
        text: 'Digite seu texto aqui...',
        variables: []
      },
      defaultStyles: {
        fontSize: '16px',
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#333333',
        backgroundColor: 'transparent',
        padding: '16px',
        marginBottom: '16px'
      }
    },
    {
      type: 'image',
      icon: Image,
      label: 'Imagem',
      defaultContent: {
        src: 'https://via.placeholder.com/400x200',
        alt: 'Imagem',
        href: ''
      },
      defaultStyles: {
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        textAlign: 'center',
        marginBottom: '16px'
      }
    },
    {
      type: 'button',
      icon: ButtonIcon,
      label: 'Botão',
      defaultContent: {
        text: 'Clique aqui',
        href: '#',
        variables: []
      },
      defaultStyles: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }
    },
    {
      type: 'spacer',
      icon: Move,
      label: 'Espaçador',
      defaultContent: {},
      defaultStyles: {
        height: '32px',
        backgroundColor: 'transparent'
      }
    },
    {
      type: 'divider',
      icon: Separator,
      label: 'Divisor',
      defaultContent: {},
      defaultStyles: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        marginTop: '16px',
        marginBottom: '16px'
      }
    }
  ];

  const addBlock = (type: string) => {
    const template = blockTemplates.find(t => t.type === type);
    if (!template) return;

    const newBlock: EmailBlock = {
      id: generateId(),
      type: type as EmailBlock['type'],
      content: { ...template.defaultContent },
      styles: { ...template.defaultStyles }
    };

    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlock(newBlock.id);
    updateOutput(newBlocks);
  };

  const updateBlock = (id: string, updates: Partial<EmailBlock>) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    );
    setBlocks(newBlocks);
    updateOutput(newBlocks);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    setSelectedBlock(null);
    updateOutput(newBlocks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over?.id);
      
      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);
      updateOutput(newBlocks);
    }
  };

  const updateOutput = useCallback((currentBlocks: EmailBlock[]) => {
    const html = generateHTML(currentBlocks);
    onChange(currentBlocks, html);
  }, [onChange]);

  const generateHTML = (currentBlocks: EmailBlock[]) => {
    const blocksHTML = currentBlocks.map(block => {
      switch (block.type) {
        case 'text':
          return `
            <div style="${stylesToCSS(block.styles)}">
              ${block.content.text}
            </div>
          `;
        case 'image':
          const imgContent = block.content.href 
            ? `<a href="${block.content.href}"><img src="${block.content.src}" alt="${block.content.alt}" style="width: 100%; max-width: ${block.styles.maxWidth}; height: auto;" /></a>`
            : `<img src="${block.content.src}" alt="${block.content.alt}" style="width: 100%; max-width: ${block.styles.maxWidth}; height: auto;" />`;
          
          return `
            <div style="${stylesToCSS(block.styles)}">
              ${imgContent}
            </div>
          `;
        case 'button':
          return `
            <div style="text-align: ${block.styles.textAlign}; margin-bottom: ${block.styles.marginBottom};">
              <a href="${block.content.href}" style="${stylesToCSS(block.styles)}">
                ${block.content.text}
              </a>
            </div>
          `;
        case 'spacer':
          return `<div style="${stylesToCSS(block.styles)}"></div>`;
        case 'divider':
          return `<div style="${stylesToCSS(block.styles)}"></div>`;
        default:
          return '';
      }
    }).join('');

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
    ${emailConfig?.logo_url ? `
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="${emailConfig.logo_url}" alt="Logo" style="max-height: 80px; height: auto;" />
      </div>
    ` : ''}
    ${blocksHTML}
    ${emailConfig?.company_address ? `
      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
        ${emailConfig.company_address}
      </div>
    ` : ''}
  </div>
</body>
</html>
    `.trim();
  };

  const stylesToCSS = (styles: any) => {
    return Object.entries(styles)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  };

  const selectedBlockData = selectedBlock ? blocks.find(b => b.id === selectedBlock) : null;

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="w-64 bg-muted/30 border-r p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Adicionar Elementos</h4>
            <div className="grid grid-cols-1 gap-2">
              {blockTemplates.map((template) => (
                <Button
                  key={template.type}
                  variant="outline"
                  size="sm"
                  onClick={() => addBlock(template.type)}
                  className="justify-start h-auto p-2"
                >
                  <template.icon className="w-4 h-4 mr-2" />
                  {template.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <Switch 
              checked={previewMode}
              onCheckedChange={setPreviewMode}
            />
            <Label>Modo Preview</Label>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-4 overflow-y-auto">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Email Template</CardTitle>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: generateHTML(blocks) 
                  }} 
                />
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2 min-h-[200px]">
                      {blocks.map((block) => (
                        <SortableEmailBlock
                          key={block.id}
                          block={block}
                          isSelected={selectedBlock === block.id}
                          onSelect={() => setSelectedBlock(block.id)}
                          onDelete={() => deleteBlock(block.id)}
                        />
                      ))}
                      
                      {blocks.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <Plus className="w-8 h-8 mx-auto mb-2" />
                          <p>Adicione elementos ao seu email usando a barra lateral</p>
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Properties Panel */}
        {selectedBlockData && !previewMode && (
          <div className="w-80 bg-muted/30 border-l p-4 overflow-y-auto">
            <EmailBlockProperties
              block={selectedBlockData}
              onChange={(updates) => updateBlock(selectedBlockData.id, updates)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Properties panel for editing block properties
const EmailBlockProperties: React.FC<{
  block: EmailBlock;
  onChange: (updates: Partial<EmailBlock>) => void;
}> = ({ block, onChange }) => {
  const updateContent = (key: string, value: any) => {
    onChange({
      content: { ...block.content, [key]: value }
    });
  };

  const updateStyle = (key: string, value: any) => {
    onChange({
      styles: { ...block.styles, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        <h4 className="font-medium">Propriedades</h4>
      </div>

      {/* Content Properties */}
      {block.type === 'text' && (
        <div className="space-y-3">
          <div>
            <Label>Texto</Label>
            <Textarea
              value={block.content.text}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Digite o texto..."
            />
          </div>
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-3">
          <div>
            <Label>URL da Imagem</Label>
            <Input
              value={block.content.src}
              onChange={(e) => updateContent('src', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Texto Alternativo</Label>
            <Input
              value={block.content.alt}
              onChange={(e) => updateContent('alt', e.target.value)}
              placeholder="Descrição da imagem"
            />
          </div>
          <div>
            <Label>Link (opcional)</Label>
            <Input
              value={block.content.href || ''}
              onChange={(e) => updateContent('href', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      {block.type === 'button' && (
        <div className="space-y-3">
          <div>
            <Label>Texto do Botão</Label>
            <Input
              value={block.content.text}
              onChange={(e) => updateContent('text', e.target.value)}
              placeholder="Texto do botão"
            />
          </div>
          <div>
            <Label>Link</Label>
            <Input
              value={block.content.href}
              onChange={(e) => updateContent('href', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Style Properties */}
      <div className="space-y-3">
        <h5 className="font-medium">Estilos</h5>
        
        {['text', 'button'].includes(block.type) && (
          <>
            <div>
              <Label>Alinhamento</Label>
              <Select
                value={block.styles.textAlign}
                onValueChange={(value) => updateStyle('textAlign', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Cor do Texto</Label>
              <Input
                type="color"
                value={block.styles.color}
                onChange={(e) => updateStyle('color', e.target.value)}
              />
            </div>
          </>
        )}

        {block.type === 'button' && (
          <div>
            <Label>Cor de Fundo</Label>
            <Input
              type="color"
              value={block.styles.backgroundColor}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            />
          </div>
        )}

        {block.type === 'spacer' && (
          <div>
            <Label>Altura (px)</Label>
            <Input
              type="number"
              value={parseInt(block.styles.height)}
              onChange={(e) => updateStyle('height', `${e.target.value}px`)}
            />
          </div>
        )}
      </div>
    </div>
  );
};