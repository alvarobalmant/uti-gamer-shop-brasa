// Tags hook - uses integra_tags table
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  name: string;
  category?: string;
  weight?: number;
}

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integra_tags')
        .select('*')
        .order('name');

      if (error) throw error;

      const mappedTags: Tag[] = (data || []).map(row => ({
        id: row.id,
        name: row.name,
        category: row.category,
      }));

      setTags(mappedTags);
    } catch (error) {
      console.error('[useTags] Error:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  // Stub functions - tags managed via ERP
  const addTag = async () => ({ success: false });
  const updateTag = async () => ({ success: false });
  const deleteTag = async () => ({ success: false });

  return {
    tags,
    loading,
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
};