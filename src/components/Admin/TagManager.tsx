
import { useState } from 'react';
import { useTags } from '@/hooks/useTags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Tag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const TagManager = () => {
  const { tags, loading, addTag, deleteTag } = useTags();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTagName.trim()) return;

    try {
      await addTag(newTagName.trim());
      setNewTagName('');
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

  return (
    <Card className="bg-white border-2 border-red-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Gerenciar Tags
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-1" />
                Nova Tag
              </Button>
            </DialogTrigger>
            
            <DialogContent className="bg-white border-2 border-red-200 text-gray-800">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600">
                  Adicionar Nova Tag
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tagName" className="font-medium text-gray-700">
                    Nome da Tag
                  </Label>
                  <Input
                    id="tagName"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="border-2 border-gray-200 focus:border-red-500 rounded-lg"
                    placeholder="Ex: Ação, RPG, etc."
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg"
                  >
                    Adicionar
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-3 rounded-lg"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando tags...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhuma tag encontrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge variant="secondary" className="bg-red-100 text-red-700 font-medium">
                  {tag.name}
                </Badge>
                
                <Button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  size="sm"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
