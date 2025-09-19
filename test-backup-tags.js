// Test script to verify tag weights and categories are included in backup
import { fetchAllProductsForBackupFixed } from './src/hooks/useProducts/productApiFixed.js';
import { convertProductsToExcelData } from './src/components/Admin/BulkProductUpload/backupUtilsFixed.js';

async function testBackupTags() {
  console.log('🧪 Testando backup de tags com pesos e categorias...');
  
  try {
    // Buscar produtos usando a função corrigida
    const products = await fetchAllProductsForBackupFixed();
    console.log(`✅ ${products.length} produtos encontrados`);
    
    // Verificar produtos com tags
    const productsWithTags = products.filter(p => p.tags && p.tags.length > 0);
    console.log(`📋 ${productsWithTags.length} produtos têm tags`);
    
    if (productsWithTags.length > 0) {
      // Examinar as tags do primeiro produto
      const firstProduct = productsWithTags[0];
      console.log(`🔍 Examinando produto: ${firstProduct.name}`);
      console.log('Tags encontradas:');
      
      firstProduct.tags?.forEach(tag => {
        console.log(`  - ${tag.name} (peso: ${tag.weight || 'N/A'}, categoria: ${tag.category || 'N/A'})`);
      });
      
      // Converter para Excel e verificar formato das tags
      const excelData = convertProductsToExcelData([firstProduct]);
      const tagsField = excelData[0].tags;
      
      console.log(`\n📊 Campo tags no Excel: ${tagsField}`);
      
      if (tagsField && tagsField.includes(':')) {
        console.log('✅ SUCESSO: Tags incluem pesos e categorias no formato correto!');
      } else {
        console.log('❌ PROBLEMA: Tags não incluem pesos e categorias!');
      }
    } else {
      console.log('⚠️ Nenhum produto com tags encontrado para testar');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

// Executar teste
testBackupTags();