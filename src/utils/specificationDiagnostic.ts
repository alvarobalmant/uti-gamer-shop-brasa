// Utility para testar e diagnosticar o processamento de especificações customizadas

import { supabase } from '@/integrations/supabase/client';

export interface TestSpecification {
  category: string;
  label: string;
  value: string;
  icon?: string;
  highlight?: boolean;
}

export interface DiagnosticResult {
  success: boolean;
  message: string;
  details: any;
  specificationsSaved?: any[];
  categoriesFound?: string[];
}

export const runSpecificationDiagnostic = async (): Promise<DiagnosticResult> => {
  console.log('[DIAGNOSTIC TEST] Iniciando teste de especificações...');
  
  // Dados de teste que deveriam funcionar
  const testSpecs: TestSpecification[] = [
    {
      category: "Informações Gerais",
      label: "Desenvolvedora",
      value: "Test Studio",
      icon: "🎮",
      highlight: false
    },
    {
      category: "Especificações Técnicas", 
      label: "Resolução",
      value: "4K",
      icon: "📺",
      highlight: true
    },
    {
      category: "Multiplayer",
      label: "Máximo de Jogadores",
      value: "4 jogadores",
      icon: "👥",
      highlight: false
    }
  ];

  try {
    // Criar produto de teste
    const productData = {
      name: `TESTE ESPECIFICAÇÕES - ${Date.now()}`,
      description: 'Produto para teste de especificações customizadas',
      price: 99.99,
      product_type: 'simple' as const,
      technical_specs: {
        custom_specifications: testSpecs as any
      } as any
    };

    console.log('[DIAGNOSTIC TEST] Criando produto de teste:', productData);

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (productError) {
      return {
        success: false,
        message: 'Erro ao criar produto de teste',
        details: productError
      };
    }

    console.log('[DIAGNOSTIC TEST] Produto criado:', product);

    // Aguardar processamento das especificações
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verificar especificações salvas
    const { data: specs, error: specsError } = await supabase
      .from('product_specifications')
      .select('*')
      .eq('product_id', product.id)
      .order('category', { ascending: true })
      .order('order_index', { ascending: true });

    if (specsError) {
      return {
        success: false,
        message: 'Erro ao buscar especificações salvas',
        details: specsError
      };
    }

    console.log('[DIAGNOSTIC TEST] Especificações encontradas:', specs);

    // Analisar resultados
    const categoriesFound = specs ? [...new Set(specs.map(s => s.category))] : [];
    const expectedCategories = testSpecs.map(s => s.category);
    
    const analysis = {
      expectedSpecs: testSpecs.length,
      foundSpecs: specs?.length || 0,
      expectedCategories,
      categoriesFound,
      categoriesMatch: categoriesFound.length === new Set(expectedCategories).size,
      allSpecsFound: testSpecs.every(testSpec => 
        specs?.some(savedSpec => 
          savedSpec.label === testSpec.label && 
          savedSpec.value === testSpec.value
        )
      )
    };

    // Limpar produto de teste
    await supabase
      .from('products')
      .delete()
      .eq('id', product.id);

    return {
      success: analysis.allSpecsFound && analysis.categoriesMatch,
      message: analysis.allSpecsFound && analysis.categoriesMatch 
        ? 'Teste passou! Especificações estão sendo processadas corretamente.'
        : 'Teste falhou! Há problemas no processamento das especificações.',
      details: analysis,
      specificationsSaved: specs,
      categoriesFound
    };

  } catch (error) {
    console.error('[DIAGNOSTIC TEST] Erro durante teste:', error);
    return {
      success: false,
      message: 'Erro interno durante teste',
      details: error
    };
  }
};

export const testSpecificationValidation = () => {
  console.log('[DIAGNOSTIC TEST] Testando validação de categorias...');
  
  // Simular a função de validação para teste local
  const testCategories = [
    "Informações Gerais",
    "Especificações Técnicas", 
    "Multiplayer",
    "Hardware 🔧",
    "Storage & Memory",
    "invalid@category!",
    "",
    null,
    undefined
  ];

  const results = testCategories.map(category => {
    // Replicar lógica de validação atualizada
    if (!category || typeof category !== 'string') {
      return { input: category, output: null, reason: 'null or not string' };
    }
    
    const cleanCategory = category.trim().slice(0, 50);
    const validPattern = /^[\p{L}\p{N}\p{M}\s\-_()&🎮📺🔧💾🎯⚡🌐💻🎨🔊🎧📱⭐✨🚀💎🏆🔥]+$/u;
    const isValid = validPattern.test(cleanCategory);
    
    return {
      input: category,
      cleaned: cleanCategory,
      output: isValid ? cleanCategory : null,
      reason: isValid ? 'valid' : 'invalid pattern'
    };
  });

  console.log('[DIAGNOSTIC TEST] Resultados da validação:', results);
  return results;
};