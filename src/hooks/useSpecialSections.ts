
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  SpecialSection, 
  SpecialSectionElement,
  CreateSpecialSectionInput,
  UpdateSpecialSectionInput,
  CreateSpecialSectionElementInput,
  UpdateSpecialSectionElementInput
} from '@/types/specialSections';

export const useSpecialSections = () => {
  const queryClient = useQueryClient();

  // Fetch all special sections
  const { data: sections, isLoading, error } = useQuery({
    queryKey: ['special-sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_sections')
        .select(`
          *,
          elements:special_section_elements(*)
        `)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as (SpecialSection & { elements: SpecialSectionElement[] })[];
    },
  });

  // Create special section
  const createSectionMutation = useMutation({
    mutationFn: async (input: CreateSpecialSectionInput) => {
      const { data, error } = await supabase
        .from('special_sections')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Seção especial criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating special section:', error);
      toast.error('Erro ao criar seção especial');
    },
  });

  // Update special section
  const updateSectionMutation = useMutation({
    mutationFn: async (input: UpdateSpecialSectionInput) => {
      const { id, ...updateData } = input;
      const { data, error } = await supabase
        .from('special_sections')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Seção especial atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating special section:', error);
      toast.error('Erro ao atualizar seção especial');
    },
  });

  // Delete special section
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('special_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Seção especial removida com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting special section:', error);
      toast.error('Erro ao remover seção especial');
    },
  });

  // Create element
  const createElementMutation = useMutation({
    mutationFn: async (input: CreateSpecialSectionElementInput) => {
      const { data, error } = await supabase
        .from('special_section_elements')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Elemento criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating element:', error);
      toast.error('Erro ao criar elemento');
    },
  });

  // Update element
  const updateElementMutation = useMutation({
    mutationFn: async (input: UpdateSpecialSectionElementInput) => {
      const { id, ...updateData } = input;
      const { data, error } = await supabase
        .from('special_section_elements')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Elemento atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating element:', error);
      toast.error('Erro ao atualizar elemento');
    },
  });

  // Delete element
  const deleteElementMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('special_section_elements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-sections'] });
      toast.success('Elemento removido com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting element:', error);
      toast.error('Erro ao remover elemento');
    },
  });

  return {
    sections,
    isLoading,
    error,
    createSection: createSectionMutation.mutateAsync,
    updateSection: updateSectionMutation.mutateAsync,
    deleteSection: deleteSectionMutation.mutateAsync,
    createElement: createElementMutation.mutateAsync,
    updateElement: updateElementMutation.mutateAsync,
    deleteElement: deleteElementMutation.mutateAsync,
    isCreating: createSectionMutation.isPending,
    isUpdating: updateSectionMutation.isPending,
    isDeleting: deleteSectionMutation.isPending,
  };
};
