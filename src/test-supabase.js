// Script para testar diretamente a conexão com o Supabase
// e validar as políticas RLS para as tabelas principais
import { createClient } from '@supabase/supabase-js';

// Usar as mesmas credenciais do cliente.ts
const SUPABASE_URL = "https://pmxnfpnnvtuuiedoxuxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBteG5mcG5udnR1dWllZG94dXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwOTY3MTYsImV4cCI6MjA2MzY3MjcxNn0.mc3shTLqOg_Iifd1TVXg49SdVITdmsTENw5e3_TJmi4";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Função para testar cada tabela e registrar resultados
async function testSupabaseTables() {
  console.log('=== TESTE DE CONEXÃO SUPABASE ===');
  
  // Testar tabela homepage_layout
  console.log('\n1. Testando tabela homepage_layout:');
  const { data: layoutData, error: layoutError } = await supabase
    .from('homepage_layout')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !layoutError,
    erro: layoutError,
    dados: layoutData,
    quantidade: layoutData?.length || 0
  });
  
  // Testar tabela product_sections
  console.log('\n2. Testando tabela product_sections:');
  const { data: sectionsData, error: sectionsError } = await supabase
    .from('product_sections')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !sectionsError,
    erro: sectionsError,
    dados: sectionsData,
    quantidade: sectionsData?.length || 0
  });
  
  // Testar tabela product_section_items
  console.log('\n3. Testando tabela product_section_items:');
  const { data: sectionItemsData, error: sectionItemsError } = await supabase
    .from('product_section_items')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !sectionItemsError,
    erro: sectionItemsError,
    dados: sectionItemsData,
    quantidade: sectionItemsData?.length || 0
  });
  
  // Testar tabela products
  console.log('\n4. Testando tabela products:');
  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !productsError,
    erro: productsError,
    dados: productsData,
    quantidade: productsData?.length || 0
  });
  
  // Testar tabela banners
  console.log('\n5. Testando tabela banners:');
  const { data: bannersData, error: bannersError } = await supabase
    .from('banners')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !bannersError,
    erro: bannersError,
    dados: bannersData,
    quantidade: bannersData?.length || 0
  });
  
  // Testar tabela quick_links
  console.log('\n6. Testando tabela quick_links:');
  const { data: quickLinksData, error: quickLinksError } = await supabase
    .from('quick_links')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !quickLinksError,
    erro: quickLinksError,
    dados: quickLinksData,
    quantidade: quickLinksData?.length || 0
  });
  
  // Testar tabela service_cards
  console.log('\n7. Testando tabela service_cards:');
  const { data: serviceCardsData, error: serviceCardsError } = await supabase
    .from('service_cards')
    .select('*');
  
  console.log('Resultado:', {
    sucesso: !serviceCardsError,
    erro: serviceCardsError,
    dados: serviceCardsData,
    quantidade: serviceCardsData?.length || 0
  });
  
  console.log('\n=== RESUMO DO TESTE ===');
  console.log('homepage_layout:', layoutData?.length || 0, 'registros');
  console.log('product_sections:', sectionsData?.length || 0, 'registros');
  console.log('product_section_items:', sectionItemsData?.length || 0, 'registros');
  console.log('products:', productsData?.length || 0, 'registros');
  console.log('banners:', bannersData?.length || 0, 'registros');
  console.log('quick_links:', quickLinksData?.length || 0, 'registros');
  console.log('service_cards:', serviceCardsData?.length || 0, 'registros');
}

// Executar o teste
testSupabaseTables()
  .catch(error => {
    console.error('Erro ao executar testes:', error);
  });
