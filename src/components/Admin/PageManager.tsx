
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { usePageManager } from './PageManager/usePageManager';
import PageForm from './PageManager/PageForm';
import PageList from './PageManager/PageList';
import PageLayoutManager from './PageLayoutManager';

const PageManager: React.FC = () => {
  const {
    pages,
    loading,
    error,
    activeTab,
    selectedPage,
    isEditing,
    isLayoutOpen,
    formData,
    setActiveTab,
    setIsEditing,
    setIsLayoutOpen,
    handleInputChange,
    handleSwitchChange,
    handleCreatePage,
    handleUpdatePage,
    handleDeletePage,
    handleEditPage,
    handleOpenLayout
  } = usePageManager();

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciador de Páginas</CardTitle>
              <CardDescription>
                Crie e gerencie páginas personalizadas para categorias e plataformas específicas
              </CardDescription>
            </div>
            {activeTab === 'list' && !isEditing && (
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Página
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Editar Página</h2>
              <PageForm
                formData={formData}
                onInputChange={handleInputChange}
                onSwitchChange={handleSwitchChange}
              />
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'create')}>
              <TabsList className="mb-4">
                <TabsTrigger value="list">Lista de Páginas</TabsTrigger>
                <TabsTrigger value="create">Criar Página</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                <PageList
                  pages={pages}
                  loading={loading}
                  error={error}
                  onCreatePage={() => setActiveTab('create')}
                  onEditPage={handleEditPage}
                  onDeletePage={handleDeletePage}
                  onOpenLayout={handleOpenLayout}
                />
              </TabsContent>
              <TabsContent value="create">
                <h2 className="text-xl font-semibold mb-4">Nova Página</h2>
                <PageForm
                  formData={formData}
                  onInputChange={handleInputChange}
                  onSwitchChange={handleSwitchChange}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePage}>
                Salvar Alterações
              </Button>
            </>
          ) : activeTab === 'create' ? (
            <>
              <Button variant="outline" onClick={() => setActiveTab('list')}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePage}>
                Criar Página
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>

      {/* Layout Manager Dialog */}
      {selectedPage && (
        <Dialog open={isLayoutOpen} onOpenChange={setIsLayoutOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Layout da Página: {selectedPage.title}</DialogTitle>
              <DialogDescription>
                Organize as seções e configure o conteúdo da página
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <PageLayoutManager page={selectedPage} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PageManager;
