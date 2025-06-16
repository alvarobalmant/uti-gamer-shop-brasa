
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  link: string;
  category: string;
  tags: string[];
  image_url: string;
  read_time: string;
  publish_date: string;
}

export const useXboxNews = (limit: number = 3) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchXboxNews = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .contains('tags', ['xbox'])
          .order('publish_date', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Erro ao buscar notícias Xbox:', error);
          setError('Erro ao carregar notícias');
          return;
        }

        setArticles(data || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar notícias Xbox:', err);
        setError('Erro ao carregar notícias');
      } finally {
        setLoading(false);
      }
    };

    fetchXboxNews();
  }, [limit]);

  return { articles, loading, error };
};
