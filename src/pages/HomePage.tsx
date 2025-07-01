
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
