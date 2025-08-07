
import React from 'react';
import { useHomepageUltraCache } from '@/hooks/useHomepageUltraCache';
import { SectionRenderer } from '@/components/HomePage/SectionRenderer';
import LoadingState from '@/components/HomePage/LoadingState';
import ErrorState from '@/components/HomePage/ErrorState';

const HomePage = () => {
  const { getHomepageLayout, getCacheStats } = useHomepageUltraCache();
  const { data: layout, loading, error, isFromCache } = getHomepageLayout();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cache status indicator (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: '10px', left: '10px', zIndex: 9999, background: isFromCache ? 'green' : 'orange', color: 'white', padding: '8px', fontSize: '12px', borderRadius: '4px' }}>
          {isFromCache ? '⚡ ULTRA CACHE' : '🔄 LIVE DATA'}
        </div>
      )}
      
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
