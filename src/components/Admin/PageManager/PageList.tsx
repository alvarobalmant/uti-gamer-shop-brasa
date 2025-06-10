
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Eye, EyeOff, Edit, Trash2, Plus, Layout, ExternalLink } from 'lucide-react';
import { Page } from '@/hooks/usePages';

interface PageListProps {
  pages: Page[];
  loading: boolean;
  error: string | null;
  onCreatePage: () => void;
  onEditPage: (page: Page) => void;
  onDeletePage: (page: Page) => void;
  onOpenLayout: (page: Page) => void;
}

const PageList: React.FC<PageListProps> = ({
  pages,
  loading,
  error,
  onCreatePage,
  onEditPage,
  onDeletePage,
  onOpenLayout
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (pages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Nenhuma página encontrada.</p>
        <Button onClick={onCreatePage}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Página
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>
            <TableCell className="font-medium">{page.title}</TableCell>
            <TableCell>/{page.slug}</TableCell>
            <TableCell>
              {page.is_active ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Eye className="mr-1 h-3 w-3" />
                  Ativo
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                  <EyeOff className="mr-1 h-3 w-3" />
                  Inativo
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="ghost" size="sm" onClick={() => onOpenLayout(page)}>
                <Layout className="h-4 w-4" />
                <span className="sr-only">Layout</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditPage(page)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Visualizar</span>
                </a>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Excluir</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir página</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir a página "{page.title}"? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => onDeletePage(page)}>
                      Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PageList;
