import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast'; // Assuming toast is set up

// Define the structure for a section
interface ProductSection {
  id: string;
  title: string;
  tag: string; // Tag used for filtering products
  viewAllLink: string;
}

// Mock function to generate unique IDs (replace with actual ID generation)
const generateId = () => `section_${Math.random().toString(36).substr(2, 9)}`;

const AdminSections: React.FC = () => {
  const { toast } = useToast();
  // Initial state mirroring Index.tsx (will be replaced by fetch/context later)
  const [sections, setSections] = useState<ProductSection[]>([
    { id: 'destaques', title: 'Destaques da Semana', tag: 'featured', viewAllLink: '/categoria/destaques' },
    { id: 'novidades', title: 'Novidades', tag: 'new', viewAllLink: '/categoria/novidades' },
    { id: 'mais_vendidos', title: 'Mais Vendidos', tag: 'bestseller', viewAllLink: '/categoria/mais-vendidos' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<ProductSection | null>(null);
  const [formData, setFormData] = useState({ title: '', tag: '', viewAllLink: '' });

  // Effect to load sections from storage/API in the future
  // useEffect(() => {
  //   // Fetch sections
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (section: ProductSection) => {
    setCurrentSection(section);
    setFormData({ title: section.title, tag: section.tag, viewAllLink: section.viewAllLink });
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setCurrentSection(null);
    setFormData({ title: '', tag: '', viewAllLink: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    // Add confirmation dialog here in a real app
    setSections(prev => prev.filter(section => section.id !== id));
    toast({ title: 'Seção removida com sucesso!' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.tag || !formData.viewAllLink) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }

    if (currentSection) {
      // Edit existing section
      setSections(prev => 
        prev.map(section => 
          section.id === currentSection.id ? { ...section, ...formData } : section
        )
      );
      toast({ title: 'Seção atualizada com sucesso!' });
    } else {
      // Add new section
      const newSection: ProductSection = { id: generateId(), ...formData };
      setSections(prev => [...prev, newSection]);
      toast({ title: 'Seção adicionada com sucesso!' });
    }
    setIsModalOpen(false);
  };

  // TODO: Add reordering functionality (e.g., drag and drop)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gerenciar Seções de Produtos da Home</CardTitle>
        <Button size="sm" onClick={handleAddNewClick}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tag (Filtro)</TableHead>
              <TableHead>Link "Ver Todos"</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.length > 0 ? (
              sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell>{section.tag}</TableCell>
                  <TableCell>{section.viewAllLink}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(section)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(section.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhuma seção cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSection ? 'Editar Seção' : 'Adicionar Nova Seção'}</DialogTitle>
            <DialogDescription>
              Preencha as informações da seção de produtos.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título
                </Label>
                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tag" className="text-right">
                  Tag (Filtro)
                </Label>
                <Input id="tag" name="tag" value={formData.tag} onChange={handleInputChange} className="col-span-3" placeholder="Ex: featured, new, bestseller" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="viewAllLink" className="text-right">
                  Link "Ver Todos"
                </Label>
                <Input id="viewAllLink" name="viewAllLink" value={formData.viewAllLink} onChange={handleInputChange} className="col-span-3" placeholder="Ex: /categoria/destaques" required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">{currentSection ? 'Salvar Alterações' : 'Adicionar Seção'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminSections;

