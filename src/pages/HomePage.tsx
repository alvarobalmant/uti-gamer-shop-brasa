import React from 'react';
import { useOptimizedHomepageLayout } from '@/hooks/useOptimizedHomepageLayout';
import { SectionRenderer } from '@/components/HomePage/SectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';

const HomePage = () => {
  const { layoutItems: layout, isLoading, error } = useOptimizedHomepageLayout();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error?.message || 'Erro ao carregar layout'} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DIAGNÓSTICO: Link direto para teste */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '10px' }}>
        <a href="/produto/737a4bca-540d-4c55-9296-47e0496177fb" style={{ color: 'white', textDecoration: 'none' }}>
          🔍 TESTE PRODUTO
        </a>
      </div>
      
      {layout.map((layoutItem) => (
        <SectionRenderer 
          key={layoutItem.section_key} 
          sectionKey={layoutItem.section_key}
          bannerData={{
            imageUrl: '',
            title: '',
            description: '',
            buttonText: '',
            buttonLink: '',
            targetBlank: false
          }}
          products={[]}
          sections={[]}
          productsLoading={false}
          sectionsLoading={false}
          onAddToCart={() => {}}
        />
      ))}
    </div>
  );
};

export default HomePage;