import React, { useState, useEffect } from 'react';
import { useQuickLinks, QuickLink } from '@/hooks/useQuickLinks';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Edit, Plus, MoveUp, MoveDown, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QuickLinksManager = () => {
  const { quickLinks, loading, fetchAllQuickLinksForAdmin, addQuickLink, updateQuickLink, deleteQuickLink } = useQuickLinks();
  const { uploadImage, uploading } = useImageUpload();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<Partial<QuickLink> | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch all quick links on component mount
  useEffect(() => {
    fetchAllQuickLinksForAdmin();
  }, [fetchAllQuickLinksForAdmin]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setCurrentLink(null);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isDialogOpen]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentLink(prev => ({ ...prev, [name]: value }));
  };

  // Handle switch toggle for is_active
  const handleActiveToggle = (checked: boolean) => {
    setCurrentLink(prev => ({ ...prev, is_active: checked }));
  };

  // Open dialog for adding new link
  const handleAddNew = () => {
    setCurrentLink({
      label: '',
      path: '',
      icon_url: '',
      position: quickLinks.length + 1,
      is_active: true
    });
    setIsDialogOpen(true);
  };

  // Open dialog for editing existing link
  const handleEdit = (link: QuickLink) => {
    setCurrentLink(link);
    setPreviewUrl(link.icon_url);
    setIsDialogOpen(true);
  };

  // Handle position change (move up/down)
  const handleMovePosition = async (link: QuickLink, direction: 'up' | 'down') => {
    const currentIndex = quickLinks.findIndex(l => l.id === link.id);
    const newPosition = direction === 'up' ? link.position - 1 : link.position + 1;
    
    // Don't move if already at top/bottom
    if (newPosition < 1 || newPosition > quickLinks.length) return;
    
    // Find the link that needs to swap positions
    const swapLink = quickLinks.find(l => l.position === newPosition);
    if (!swapLink) return;
    
    try {
      // Update both links with new positions
      await updateQuickLink(link.id, { position: newPosition });
      await updateQuickLink(swapLink.id, { position: link.position });
      
      // Refresh the list
      await fetchAllQuickLinksForAdmin();
    } catch (error) {
      console.error('Error changing position:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLink || !currentLink.label || !currentLink.path) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o link do card.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      let iconUrl = currentLink.icon_url || '';
      
      // Upload new image if selected
      if (selectedFile) {
        const uploadResult = await uploadImage(selectedFile);
        if (uploadResult?.url) {
          iconUrl = uploadResult.url;
        }
      }
      
      const linkData = {
        ...currentLink,
        icon_url: iconUrl
      };
      
      if (currentLink.id) {
        // Update existing link
        await updateQuickLink(currentLink.id, linkData);
      } else {
        // Add new link
        await addQuickLink(linkData as Omit<QuickLink, 'id' | 'created_at' | 'updated_at'>);
      }
      
      setIsDialogOpen(false);
      await fetchAllQuickLinksForAdmin();
    } catch (error) {
      console.error('Error saving quick link:', error);
    }
  };

  // Handle link deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este link rápido?')) {
      try {
        await deleteQuickLink(id);
        await fetchAllQuickLinksForAdmin();
      } catch (error) {
        console.error('Error deleting quick link:', error);
      }
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Gerenciamento de Links Rápidos</span>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Link
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : quickLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhum link rápido cadastrado.</p>
            <p className="mt-2">Clique em "Adicionar Link" para criar o primeiro.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Posição</TableHead>
                <TableHead className="w-16">Imagem</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-32 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quickLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <span>{link.position}</span>
                      <div className="flex flex-col ml-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => handleMovePosition(link, 'up')}
                          disabled={link.position === 1}
                        >
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5" 
                          onClick={() => handleMovePosition(link, 'down')}
                          disabled={link.position === quickLinks.length}
                        >
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {link.icon_url ? (
                      <img 
                        src={link.icon_url} 
                        alt={link.label} 
                        className="h-10 w-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                        <span className="text-xs">Sem imagem</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{link.label}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-400">{link.path}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${link.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {link.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(link)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Dialog for adding/editing quick links */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentLink?.id ? 'Editar Link Rápido' : 'Adicionar Link Rápido'}</DialogTitle>
            <DialogDescription>
              Configure as informações do link rápido que aparecerá na página inicial.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="label">Título</Label>
              <Input
                id="label"
                name="label"
                value={currentLink?.label || ''}
                onChange={handleInputChange}
                placeholder="Ex: Xbox"
                className="bg-gray-900 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="path">Link (URL)</Label>
              <Input
                id="path"
                name="path"
                value={currentLink?.path || ''}
                onChange={handleInputChange}
                placeholder="Ex: /xbox"
                className="bg-gray-900 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Posição</Label>
              <Input
                id="position"
                name="position"
                type="number"
                min="1"
                value={currentLink?.position || ''}
                onChange={handleInputChange}
                className="bg-gray-900 border-gray-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Imagem</Label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 border border-dashed border-gray-600 rounded-md flex items-center justify-center overflow-hidden">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xs text-center p-2">
                      Sem imagem
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <Label htmlFor="icon" className="cursor-pointer">
                    <div className="flex items-center gap-2 p-2 border border-gray-700 rounded-md hover:bg-gray-700/50 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>{selectedFile ? selectedFile.name : 'Escolher arquivo'}</span>
                    </div>
                    <Input
                      id="icon"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={currentLink?.is_active || false}
                onCheckedChange={handleActiveToggle}
              />
              <Label htmlFor="is_active">Ativo</Label>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="border-gray-600"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentLink?.id ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuickLinksManager;
