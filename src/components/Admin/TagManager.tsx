
import { useState } from 'react';
import { useTags } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Tag, Type, Info, Pencil, Weight, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const TagManager = () => {
  const { tags, loading, addTag, updateTag, deleteTag } = useTags();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState('generic');
  const [newTagWeight, setNewTagWeight] = useState(1);

  const categories = [
    { value: 'platform', label: 'Plataforma', color: 'bg-red-600', weight: 5 },
    { value: 'game_title', label: 'Título do Jogo', color: 'bg-orange-600', weight: 4 },
    { value: 'product_type', label: 'Tipo de Produto', color: 'bg-purple-600', weight: 4 },
    { value: 'brand', label: 'Marca', color: 'bg-blue-600', weight: 3 },
    { value: 'genre', label: 'Gênero', color: 'bg-green-600', weight: 2 },
    { value: 'condition', label: 'Condição', color: 'bg-gray-600', weight: 1 },
    { value: 'physical_attribute', label: 'Atributo Físico', color: 'bg-yellow-600', weight: 1 },
    { value: 'generic', label: 'Genérica', color: 'bg-gray-500', weight: 1 },
  ];

  const getCategoryInfo = (category: string | null | undefined) => {
    return categories.find(c => c.value === category) || categories[categories.length - 1];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;

    try {
      await addTag(newTagName.trim(), newTagCategory, newTagWeight);
      setNewTagName('');
      setNewTagCategory('generic');
      setNewTagWeight(1);
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in useTags
    }
  };

  const handleEdit = (tag: any) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagCategory(tag.category || 'generic');
    setNewTagWeight(tag.weight || 1);
    setIsDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTag || !newTagName.trim()) return;

    try {
      await updateTag(editingTag.id, {
        name: newTagName.trim(),
        category: newTagCategory,
        weight: newTagWeight
      });
      setEditingTag(null);
      setNewTagName('');
      setNewTagCategory('generic');
      setNewTagWeight(1);
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in useTags
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a tag "${name}"?`)) {
      await deleteTag(id);
    }
  };

  const resetDialog = () => {
    setEditingTag(null);
    setNewTagName('');
    setNewTagCategory('generic');
    setNewTagWeight(1);
    setIsDialogOpen(false);
  };

  // Agrupar tags por categoria
  const groupedTags = categories.map(category => ({
    ...category,
    tags: tags.filter(tag => (tag.category || 'generic') === category.value)
  })).filter(group => group.tags.length > 0);

  return (
    <Card className="bg-[#2C2C44] border-[#343A40]">
      <CardHeader className="border-b border-[#343A40] pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Tag className="w-6 h-6 text-[#007BFF]" />
              Gerenciar Tags
            </CardTitle>
            <Alert className="mt-3 bg-[#1A1A2E] border-[#343A40] text-gray-300">
              <Info className="h-4 w-4 text-[#007BFF]" />
              <AlertDescription>
                Tags são usadas para categorizar produtos e criar seções dinâmicas. Exemplos: Ação, RPG, Aventura, Promoção.
              </AlertDescription>
            </Alert>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="bg-[#007BFF] hover:bg-[#0056B3] text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Tag
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-[#2C2C44] border-[#343A40] text-white max-w-md">
              <DialogHeader className="border-b border-[#343A40] pb-4 mb-4">
                <DialogTitle className="text-white">
                  {editingTag ? 'Editar Tag' : 'Adicionar Nova Tag'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={editingTag ? handleUpdate : handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tagName" className="text-gray-300 flex items-center">
                    <Type className="mr-2 h-4 w-4" />
                    Nome da Tag *
                  </Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="bg-[#1A1A2E] border-[#343A40] text-white placeholder:text-gray-500"
                    placeholder="Ex: PS3, Minecraft, Xbox"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagCategory" className="text-gray-300 flex items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    Categoria
                  </Label>
                  <Select value={newTagCategory} onValueChange={setNewTagCategory}>
                    <SelectTrigger className="bg-[#1A1A2E] border-[#343A40] text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A2E] border-[#343A40] text-white">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded ${category.color}`}></div>
                            {category.label} (Peso: {category.weight})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagWeight" className="text-gray-300 flex items-center">
                    <Weight className="mr-2 h-4 w-4" />
                    Peso (1-5)
                  </Label>
                  <Input
                    id="tagWeight"
                    type="number"
                    min="1"
                    max="5"
                    value={newTagWeight}
                    onChange={(e) => setNewTagWeight(Number(e.target.value))}
                    className="bg-[#1A1A2E] border-[#343A40] text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Maior peso = maior relevância na busca
                  </p>
                </div>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetDialog}
                      className="border-[#6C757D] text-[#6C757D] hover:bg-[#6C757D] hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-[#007BFF] hover:bg-[#0056B3] text-white"
                  >
                    {editingTag ? 'Atualizar Tag' : 'Adicionar Tag'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-[#007BFF] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Nenhuma tag encontrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedTags.map((group) => (
              <div key={group.value} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${group.color}`}></div>
                  <h3 className="text-lg font-medium text-white">
                    {group.label} <span className="text-sm text-gray-400">(Peso: {group.weight})</span>
                  </h3>
                  <span className="text-sm text-gray-500">
                    {group.tags.length} tag{group.tags.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-3 bg-[#343A40] rounded-lg border border-[#495057] hover:bg-[#3A3A50] transition-colors">
                      <div className="flex items-center gap-2 flex-1">
                        <Badge className={`${group.color} text-white font-medium`}>
                          <Tag className="w-3 h-3 mr-1" />
                          {tag.name}
                        </Badge>
                        {tag.weight && (
                          <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                            {tag.weight}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleEdit(tag)}
                          size="sm"
                          className="bg-[#007BFF] hover:bg-[#0056B3] text-white h-6 w-6 p-0"
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(tag.id, tag.name)}
                          size="sm"
                          className="bg-[#DC3545] hover:bg-[#C82333] text-white h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Mostrar informação sobre busca ponderada */}
            <div className="mt-6 p-4 bg-[#1A1A2E] rounded-lg border border-[#343A40]">
              <h4 className="text-md font-medium text-white mb-2">💡 Como funciona a busca ponderada:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• <strong>Plataforma (peso 5):</strong> PS3, Xbox, Nintendo - máxima prioridade</li>
                <li>• <strong>Jogo/Produto (peso 4):</strong> Minecraft, FIFA - alta prioridade</li>
                <li>• <strong>Marca (peso 3):</strong> Sony, Microsoft - prioridade média</li>
                <li>• <strong>Gênero (peso 2):</strong> Ação, RPG - prioridade baixa</li>
                <li>• <strong>Condição/Atributos (peso 1):</strong> Usado, Cor - menor prioridade</li>
              </ul>
              <p className="text-xs text-gray-400 mt-3">
                Exemplo: "minecraft ps3" = Minecraft (4) + PS3 (5) + boost jogo+plataforma (x2) = score alto
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
