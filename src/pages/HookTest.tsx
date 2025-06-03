import React, { useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useProductSections } from '@/hooks/useProductSections';
import { useHomepageLayout } from '@/hooks/useHomepageLayout';

const HookTest: React.FC = () => {
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { sections, loading: sectionsLoading, error: sectionsError } = useProductSections();
  const { layoutItems, loading: layoutLoading, error: layoutError } = useHomepageLayout();

  useEffect(() => {
    console.log('--- TESTE useProducts ---');
    console.log('Loading:', productsLoading);
    console.log('Error:', productsError);
    console.log('Products Data:', products);
    console.log('Products Count:', products.length);
    console.log('------------------------');
  }, [products, productsLoading, productsError]);

  useEffect(() => {
    console.log('--- TESTE useProductSections ---');
    console.log('Loading:', sectionsLoading);
    console.log('Error:', sectionsError);
    console.log('Sections Data:', sections);
    console.log('Sections Count:', sections.length);
    console.log('-----------------------------');
  }, [sections, sectionsLoading, sectionsError]);

  useEffect(() => {
    console.log('--- TESTE useHomepageLayout ---');
    console.log('Loading:', layoutLoading);
    console.log('Error:', layoutError);
    console.log('Layout Data:', layoutItems);
    console.log('Layout Count:', layoutItems.length);
    console.log('----------------------------');
  }, [layoutItems, layoutLoading, layoutError]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Página de Teste de Hooks</h1>
      <p>Verifique o console do navegador para ver os resultados dos hooks.</p>
      
      <h2>useProducts</h2>
      <pre>Loading: {String(productsLoading)}</pre>
      <pre>Error: {productsError || 'null'}</pre>
      <pre>Count: {products.length}</pre>
      {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}

      <h2>useProductSections</h2>
      <pre>Loading: {String(sectionsLoading)}</pre>
      <pre>Error: {sectionsError || 'null'}</pre>
      <pre>Count: {sections.length}</pre>
      {/* <pre>{JSON.stringify(sections, null, 2)}</pre> */}

      <h2>useHomepageLayout</h2>
      <pre>Loading: {String(layoutLoading)}</pre>
      <pre>Error: {layoutError || 'null'}</pre>
      <pre>Count: {layoutItems.length}</pre>
      {/* <pre>{JSON.stringify(layoutItems, null, 2)}</pre> */}
    </div>
  );
};

export default HookTest;

