// Utility para corrigir especificações existentes que foram mal categorizadas
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SpecificationFixResult {
  success: boolean;
  message: string;
  details: {
    totalSpecs: number;
    fixedSpecs: number;
    categoriesUpdated: string[];
    errors?: string[];
  };
}

// Função melhorada de validação de categoria
function validateAndFixCategory(category: string): string {
  if (!category || typeof category !== 'string') {
    return 'Informações Gerais';
  }
  
  const cleanCategory = category.trim().slice(0, 50);
  
  if (!cleanCategory) {
    return 'Informações Gerais';
  }
  
  // Regex completa incluindo TODOS os emojis das categorias específicas
  const validPattern = /^[\p{L}\p{N}\p{M}\s\-_()&📋⚙️💾🌐🎮📺🔧🎯⚡💻🎨🔊🎧📱⭐✨🚀💎🏆🔥]+$/u;
  
  if (validPattern.test(cleanCategory)) {
    return cleanCategory;
  }
  
  // Se não passou na validação, usar categoria padrão
  console.log(`[SPEC FIXER] Categoria inválida "${category}" convertida para "Informações Gerais"`);
  return 'Informações Gerais';
}

// Função para mapear categorias comuns mal categorizadas
function mapLegacyCategory(category: string): string {
  const categoryMappings: Record<string, string> = {
    'custom': 'Informações Gerais',
    'general': 'Informações Gerais',
    'geral': 'Informações Gerais',
    'basic': 'Informações Gerais',
    'info': 'Informações Gerais',
    'technical': 'Especificações Técnicas',
    'tech': 'Especificações Técnicas',
    'hardware': 'Hardware',
    'performance': 'Performance',
    'connectivity': 'Conectividade',
    'audio': 'Áudio/Vídeo',
    'video': 'Áudio/Vídeo',
    'storage': 'Armazenamento',
    'multiplayer': 'Multiplayer',
    'gameplay': 'Gameplay'
  };

  const lowerCategory = category.toLowerCase().trim();
  return categoryMappings[lowerCategory] || category;
}

// Função principal para corrigir especificações
export async function fixExistingSpecifications(): Promise<SpecificationFixResult> {
  console.log('[SPEC FIXER] Iniciando correção de especificações...');
  
  try {
    // Buscar todas as especificações existentes
    const { data: allSpecs, error: fetchError } = await supabase
      .from('product_specifications')
      .select('*')
      .order('product_id', { ascending: true })
      .order('order_index', { ascending: true });

    if (fetchError) {
      throw new Error(`Erro ao buscar especificações: ${fetchError.message}`);
    }

    if (!allSpecs || allSpecs.length === 0) {
      return {
        success: true,
        message: 'Nenhuma especificação encontrada para corrigir',
        details: {
          totalSpecs: 0,
          fixedSpecs: 0,
          categoriesUpdated: []
        }
      };
    }

    console.log(`[SPEC FIXER] Encontradas ${allSpecs.length} especificações para análise`);

    const specsToUpdate: any[] = [];
    const categoriesUpdated = new Set<string>();
    const errors: string[] = [];

    // Processar cada especificação
    allSpecs.forEach((spec) => {
      const originalCategory = spec.category;
      
      // Primeiro, mapear categorias legadas conhecidas
      const mappedCategory = mapLegacyCategory(originalCategory);
      
      // Depois, validar e corrigir a categoria
      const fixedCategory = validateAndFixCategory(mappedCategory);
      
      // Se a categoria mudou, adicionar à lista de atualizações
      if (fixedCategory !== originalCategory) {
        specsToUpdate.push({
          id: spec.id,
          category: fixedCategory,
          original_category: originalCategory
        });
        
        categoriesUpdated.add(`${originalCategory} → ${fixedCategory}`);
        
        console.log(`[SPEC FIXER] Spec ${spec.id}: "${originalCategory}" → "${fixedCategory}"`);
      }
    });

    console.log(`[SPEC FIXER] ${specsToUpdate.length} especificações precisam de correção`);

    // Atualizar especificações em lotes
    let fixedCount = 0;
    const batchSize = 50;

    for (let i = 0; i < specsToUpdate.length; i += batchSize) {
      const batch = specsToUpdate.slice(i, i + batchSize);
      
      try {
        // Atualizar cada especificação individualmente para garantir precisão
        for (const specUpdate of batch) {
          const { error: updateError } = await supabase
            .from('product_specifications')
            .update({ category: specUpdate.category })
            .eq('id', specUpdate.id);

          if (updateError) {
            errors.push(`Erro ao atualizar spec ${specUpdate.id}: ${updateError.message}`);
            console.error(`[SPEC FIXER] Erro ao atualizar spec ${specUpdate.id}:`, updateError);
          } else {
            fixedCount++;
          }
        }
        
        console.log(`[SPEC FIXER] Lote ${Math.ceil((i + batchSize) / batchSize)} processado`);
      } catch (batchError) {
        const errorMsg = `Erro no lote ${Math.ceil((i + batchSize) / batchSize)}: ${batchError}`;
        errors.push(errorMsg);
        console.error('[SPEC FIXER]', errorMsg);
      }
    }

    const result: SpecificationFixResult = {
      success: fixedCount > 0 || specsToUpdate.length === 0,
      message: fixedCount > 0 
        ? `Corrigidas ${fixedCount} de ${specsToUpdate.length} especificações`
        : specsToUpdate.length === 0 
          ? 'Todas as especificações já estão corretamente categorizadas'
          : 'Erro ao corrigir especificações',
      details: {
        totalSpecs: allSpecs.length,
        fixedSpecs: fixedCount,
        categoriesUpdated: Array.from(categoriesUpdated),
        errors: errors.length > 0 ? errors : undefined
      }
    };

    console.log('[SPEC FIXER] Resultado final:', result);
    return result;

  } catch (error) {
    console.error('[SPEC FIXER] Erro na correção:', error);
    return {
      success: false,
      message: `Erro durante correção: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: {
        totalSpecs: 0,
        fixedSpecs: 0,
        categoriesUpdated: [],
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      }
    };
  }
}

// Função para executar correção com feedback visual
export async function runSpecificationFix(): Promise<SpecificationFixResult> {
  try {
    toast({
      title: "Iniciando correção",
      description: "Corrigindo categorias de especificações...",
    });

    const result = await fixExistingSpecifications();

    if (result.success) {
      toast({
        title: "Correção concluída",
        description: result.message,
      });
      
      if (result.details.categoriesUpdated.length > 0) {
        console.log('Categorias atualizadas:', result.details.categoriesUpdated);
      }
    } else {
      toast({
        title: "Erro na correção",
        description: result.message,
        variant: "destructive"
      });
    }

    return result;
  } catch (error) {
    console.error('Erro ao executar correção:', error);
    toast({
      title: "Erro",
      description: "Erro inesperado durante a correção",
      variant: "destructive"
    });
    
    return {
      success: false,
      message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      details: {
        totalSpecs: 0,
        fixedSpecs: 0,
        categoriesUpdated: [],
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      }
    };
  }
}

// Função para validar uma categoria específica (para uso em formulários)
export function validateSpecificationCategoryUI(category: string): {
  isValid: boolean;
  fixedCategory: string;
  message?: string;
} {
  if (!category || typeof category !== 'string') {
    return {
      isValid: false,
      fixedCategory: 'Informações Gerais',
      message: 'Categoria deve ser um texto válido'
    };
  }

  const cleanCategory = category.trim().slice(0, 50);
  
  if (!cleanCategory) {
    return {
      isValid: false,
      fixedCategory: 'Informações Gerais',
      message: 'Categoria não pode estar vazia'
    };
  }

  const validPattern = /^[\p{L}\p{N}\p{M}\s\-_()&🎮📺🔧💾🎯⚡🌐💻🎨🔊🎧📱⭐✨🚀💎🏆🔥]+$/u;
  const isValid = validPattern.test(cleanCategory);

  if (isValid) {
    return {
      isValid: true,
      fixedCategory: cleanCategory
    };
  } else {
    return {
      isValid: false,
      fixedCategory: 'Informações Gerais',
      message: 'Categoria contém caracteres inválidos. Use apenas letras, números, espaços, hífens e emojis básicos.'
    };
  }
}