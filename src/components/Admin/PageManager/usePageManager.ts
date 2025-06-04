import { useState, useEffect, useCallback } from 'react';
import { usePages, Page } from '@/hooks/usePages';
import { useToast } from '@/hooks/use-toast';
import { PageFormData } from './types';

export const usePageManager = () => {
  const { toast } = useToast();
  const { 
    pages, 
    loading, 
    error, 
    createPage, 
    updatePage, 
    deletePage 
  } = usePages();
  
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  
  const [formData, setFormData] = useState<Partial<PageFormData>>({
    title: '',
    slug: '',
    description: '',
    isActive: true,
    theme: {
      primaryColor: '#107C10',
      secondaryColor: '#3A3A3A',
    },
    filters: {
      tagIds: [],
      categoryIds: []
    }
  });

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      isActive: true,
      theme: {
        primaryColor: '#107C10',
        secondaryColor: '#3A3A3A',
      },
      filters: {
        tagIds: [],
        categoryIds: []
      }
    });
  }, []);

  // Reset form when switching tabs or closing edit mode
  useEffect(() => {
    if (activeTab === 'create' || !isEditing) {
      resetForm();
    }
  }, [activeTab, isEditing, resetForm]);

  // Set form data when editing a page
  useEffect(() => {
    if (isEditing && selectedPage) {
      setFormData({
        title: selectedPage.title,
        slug: selectedPage.slug,
        description: selectedPage.description || '',
        isActive: selectedPage.isActive,
        theme: selectedPage.theme ? { ...selectedPage.theme } : {
          primaryColor: '#107C10',
          secondaryColor: '#3A3A3A',
        },
        filters: {
          tagIds: selectedPage.filters?.tagIds || [],
          categoryIds: selectedPage.filters?.categoryIds || []
        }
      });
    }
  }, [isEditing, selectedPage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleSwitchChange = useCallback((checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  }, []);

  const handleCreatePage = useCallback(async () => {
    try {
      if (!formData.title || !formData.slug) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e slug são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const normalizedSlug = formData.slug
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const newPage = await createPage({
        title: formData.title,
        slug: normalizedSlug,
        description: formData.description,
        isActive: formData.isActive ?? true,
        theme: formData.theme as Page['theme'],
        filters: {
          tagIds: formData.filters?.tagIds || [],
          categoryIds: formData.filters?.categoryIds || []
        }
      });

      toast({
        title: "Página criada",
        description: `A página "${newPage.title}" foi criada com sucesso.`
      });

      setActiveTab('list');
    } catch (err) {
      toast({
        title: "Erro ao criar página",
        description: "Ocorreu um erro ao criar a página. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [formData, createPage, toast]);

  const handleUpdatePage = useCallback(async () => {
    if (!selectedPage) return;

    try {
      if (!formData.title || !formData.slug) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e slug são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      const normalizedSlug = formData.slug
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      await updatePage(selectedPage.id, {
        title: formData.title,
        slug: normalizedSlug,
        description: formData.description,
        isActive: formData.isActive,
        theme: formData.theme,
        filters: {
          tagIds: formData.filters?.tagIds || [],
          categoryIds: formData.filters?.categoryIds || []
        }
      });

      toast({
        title: "Página atualizada",
        description: `A página "${formData.title}" foi atualizada com sucesso.`
      });

      setIsEditing(false);
      setSelectedPage(null);
    } catch (err) {
      toast({
        title: "Erro ao atualizar página",
        description: "Ocorreu um erro ao atualizar a página. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [selectedPage, formData, updatePage, toast]);

  const handleDeletePage = useCallback(async (page: Page) => {
    try {
      await deletePage(page.id);
      
      toast({
        title: "Página excluída",
        description: `A página "${page.title}" foi excluída com sucesso.`
      });
      
      if (selectedPage?.id === page.id) {
        setSelectedPage(null);
        setIsEditing(false);
      }
    } catch (err) {
      toast({
        title: "Erro ao excluir página",
        description: "Ocorreu um erro ao excluir a página. Tente novamente.",
        variant: "destructive"
      });
    }
  }, [deletePage, toast, selectedPage]);

  const handleEditPage = useCallback((page: Page) => {
    setSelectedPage(page);
    setIsEditing(true);
  }, []);

  const handleOpenLayout = useCallback((page: Page) => {
    setSelectedPage(page);
    setIsLayoutOpen(true);
  }, []);

  return {
    // State
    pages,
    loading,
    error,
    activeTab,
    selectedPage,
    isEditing,
    isLayoutOpen,
    formData,
    
    // Actions
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
  };
};
