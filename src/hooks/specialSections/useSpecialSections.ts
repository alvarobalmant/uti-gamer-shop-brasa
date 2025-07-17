import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type {
  SpecialSection,
  CreateSectionRequest,
  UpdateSectionRequest,
  UseSectionsOptions,
  UseSectionsReturn,
  DragDropItem,
  SectionTypeValue
} from '@/types/specialSections/core';

export const useSpecialSections = (options: UseSectionsOptions = {}): UseSectionsReturn => {
  const {
    page = 1,
    limit = 20,
    type,
    visibility
  } = options;

  // Estado principal
  const [sections, setSections] = useState<SpecialSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Função para buscar seções com filtros
  const fetchSections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('special_sections')
        .select('*', { count: 'exact' })
        .order('order', { ascending: true })
        .range((page - 1) * limit, page * limit - 1);

      // Aplicar filtros
      if (type) {
        query = query.eq('type', type);
      }
      
      if (visibility) {
        query = query.eq('visibility', visibility);
      }

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transformar dados para o formato correto
      const transformedSections: SpecialSection[] = (data || []).map(section => ({
        ...section,
        createdAt: new Date(section.created_at),
        updatedAt: new Date(section.updated_at),
        isVisible: section.is_visible,
        config: section.content_config || {}
      }));

      setSections(transformedSections);
      setTotal(count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar seções';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao buscar seções:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, type, visibility]);

  // Função para criar nova seção
  const createSection = useCallback(async (data: CreateSectionRequest): Promise<SpecialSection> => {
    try {
      // Buscar próxima ordem disponível
      const { data: lastSection } = await supabase
        .from('special_sections')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)
        .single();

      const nextOrder = (lastSection?.order || 0) + 1;

      const sectionData = {
        type: data.type,
        title: data.title,
        content_config: data.config,
        order: data.order ?? nextOrder,
        is_visible: data.isVisible ?? true,
        visibility: data.visibility ?? 'both'
      };

      const { data: newSection, error: createError } = await supabase
        .from('special_sections')
        .insert(sectionData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      const transformedSection: SpecialSection = {
        ...newSection,
        createdAt: new Date(newSection.created_at),
        updatedAt: new Date(newSection.updated_at),
        isVisible: newSection.is_visible,
        config: newSection.content_config || {}
      };

      // Atualizar estado local
      setSections(prev => [...prev, transformedSection].sort((a, b) => a.order - b.order));
      setTotal(prev => prev + 1);

      toast.success('Seção criada com sucesso!');
      return transformedSection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar seção';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para atualizar seção
  const updateSection = useCallback(async (data: UpdateSectionRequest): Promise<SpecialSection> => {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.config !== undefined) updateData.content_config = data.config;
      if (data.order !== undefined) updateData.order = data.order;
      if (data.isVisible !== undefined) updateData.is_visible = data.isVisible;
      if (data.visibility !== undefined) updateData.visibility = data.visibility;

      const { data: updatedSection, error: updateError } = await supabase
        .from('special_sections')
        .update(updateData)
        .eq('id', data.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      const transformedSection: SpecialSection = {
        ...updatedSection,
        createdAt: new Date(updatedSection.created_at),
        updatedAt: new Date(updatedSection.updated_at),
        isVisible: updatedSection.is_visible,
        config: updatedSection.content_config || {}
      };

      // Atualizar estado local
      setSections(prev => 
        prev.map(section => 
          section.id === data.id ? transformedSection : section
        ).sort((a, b) => a.order - b.order)
      );

      toast.success('Seção atualizada com sucesso!');
      return transformedSection;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar seção';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para deletar seção
  const deleteSection = useCallback(async (id: string): Promise<void> => {
    try {
      const { error: deleteError } = await supabase
        .from('special_sections')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Atualizar estado local
      setSections(prev => prev.filter(section => section.id !== id));
      setTotal(prev => prev - 1);

      toast.success('Seção removida com sucesso!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover seção';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para reordenar seções
  const reorderSections = useCallback(async (items: DragDropItem[]): Promise<void> => {
    try {
      // Atualizar ordem no banco de dados
      const updates = items.map(item => ({
        id: item.id,
        order: item.order
      }));

      const { error: updateError } = await supabase
        .from('special_sections')
        .upsert(updates);

      if (updateError) {
        throw updateError;
      }

      // Atualizar estado local
      setSections(prev => {
        const updated = prev.map(section => {
          const newOrder = items.find(item => item.id === section.id)?.order;
          return newOrder !== undefined ? { ...section, order: newOrder } : section;
        });
        return updated.sort((a, b) => a.order - b.order);
      });

      toast.success('Ordem das seções atualizada!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reordenar seções';
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para refetch (invalidação reativa)
  const refetch = useCallback(async () => {
    await fetchSections();
  }, [fetchSections]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  // Memoizar resultado para evitar re-renders desnecessários
  const result = useMemo((): UseSectionsReturn => ({
    sections,
    loading,
    error,
    total,
    page,
    limit,
    refetch,
    createSection,
    updateSection,
    deleteSection,
    reorderSections
  }), [
    sections,
    loading,
    error,
    total,
    page,
    limit,
    refetch,
    createSection,
    updateSection,
    deleteSection,
    reorderSections
  ]);

  return result;
};

// Hook especializado para seções visíveis (frontend)
export const useVisibleSections = (type?: SectionTypeValue) => {
  return useSpecialSections({
    visibility: 'both',
    type,
    limit: 100 // Carregar todas as seções visíveis
  });
};

// Hook para preview em tempo real
export const useSectionPreview = () => {
  const [previewSection, setPreviewSection] = useState<SpecialSection | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const startPreview = useCallback((section: SpecialSection) => {
    setPreviewSection(section);
    setIsPreviewMode(true);
  }, []);

  const stopPreview = useCallback(() => {
    setPreviewSection(null);
    setIsPreviewMode(false);
  }, []);

  const updatePreview = useCallback((config: Partial<SpecialSection>) => {
    setPreviewSection(prev => prev ? { ...prev, ...config } : null);
  }, []);

  return {
    previewSection,
    isPreviewMode,
    startPreview,
    stopPreview,
    updatePreview
  };
};

