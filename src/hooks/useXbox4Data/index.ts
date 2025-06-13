
import { useState, useEffect } from 'react';
import { Xbox4Data } from './types';
import { fetchXbox4Page, fetchXbox4Sections, fetchAllProducts } from './dataFetchers';
import { processProductsFromRows } from './productFilters';
import { processSections } from './sectionProcessor';

export const useXbox4Data = (): Xbox4Data => {
  const [data, setData] = useState<Xbox4Data>({
    consoles: [],
    games: [],
    accessories: [],
    deals: [],
    newsArticles: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const loadXbox4Data = async () => {
      try {
        // Buscar a página Xbox4 e suas seções
        const page = await fetchXbox4Page();
        
        if (!page) {
          setData(prev => ({ ...prev, loading: false }));
          return;
        }

        // Buscar seções da página
        const sections = await fetchXbox4Sections(page.id);

        // Buscar todos os produtos
        const allProductsRows = await fetchAllProducts();

        // Processar produtos (remover duplicatas e converter formato)
        const products = processProductsFromRows(allProductsRows);

        // Processar cada seção para extrair produtos específicos
        const sectionData = processSections(sections, products);

        setData({
          ...sectionData,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Erro ao carregar dados Xbox4:', error);
        setData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Erro ao carregar dados' 
        }));
      }
    };

    loadXbox4Data();
  }, []);

  return data;
};

// Export types for external use
export type { Xbox4Data, Xbox4Section, ProductOverride, SectionConfig } from './types';
