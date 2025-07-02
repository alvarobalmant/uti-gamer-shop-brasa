
import React from 'react';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';
import { SectionRenderer } from '@/components/HomePage/SectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';

const HomePage = () => {
  const { layout, loading, error } = useHomepageLayout();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* DIAGNÓSTICO: Link direto para teste */}
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'red', color: 'white', padding: '10px' }}>
        <a href="/produto/737a4bca-540d-4c55-9296-47e0496177fb" style={{ color: 'white', textDecoration: 'none' }}>
          🔍 TESTE PRODUTO
        </a>
      </div>
      
      {layout.map((section) => (
        <SectionRenderer 
          key={section.section_key} 
          section={section} 
        />
      ))}
    </div>
  );
};

export default HomePage;
