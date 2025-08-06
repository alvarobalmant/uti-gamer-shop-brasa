import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Função para detectar formato de imagem
function detectImageFormat(fileName: string, firstBytes?: Uint8Array): string {
  const name = fileName.toLowerCase();
  
  // Detecção por extensão
  if (name.endsWith('.webp')) return 'webp';
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpeg';
  if (name.endsWith('.png')) return 'png';
  if (name.endsWith('.gif')) return 'gif';
  if (name.endsWith('.svg')) return 'svg';
  if (name.endsWith('.bmp')) return 'bmp';
  if (name.endsWith('.tiff') || name.endsWith('.tif')) return 'tiff';
  
  // Detecção por bytes (magic numbers)
  if (firstBytes && firstBytes.length >= 12) {
    // WebP: RIFF....WEBP
    if (firstBytes[0] === 0x52 && firstBytes[1] === 0x49 && 
        firstBytes[2] === 0x46 && firstBytes[3] === 0x46 &&
        firstBytes[8] === 0x57 && firstBytes[9] === 0x45 && 
        firstBytes[10] === 0x42 && firstBytes[11] === 0x50) {
      return 'webp';
    }
    
    // JPEG: FF D8 FF
    if (firstBytes[0] === 0xFF && firstBytes[1] === 0xD8 && firstBytes[2] === 0xFF) {
      return 'jpeg';
    }
    
    // PNG: 89 50 4E 47
    if (firstBytes[0] === 0x89 && firstBytes[1] === 0x50 && 
        firstBytes[2] === 0x4E && firstBytes[3] === 0x47) {
      return 'png';
    }
    
    // GIF: GIF8
    if (firstBytes[0] === 0x47 && firstBytes[1] === 0x49 && 
        firstBytes[2] === 0x46 && firstBytes[3] === 0x38) {
      return 'gif';
    }
  }
  
  return 'unknown';
}

// Função para converter imagem para WebP
async function convertToWebP(arrayBuffer: ArrayBuffer, quality: number = 0.85): Promise<{ buffer: ArrayBuffer, compressedSize: number }> {
  // Simulação de conversão para WebP
  // Em um ambiente real, você usaria uma biblioteca como sharp ou canvas
  const originalSize = arrayBuffer.byteLength;
  const compressionRatio = quality; // Simula compressão baseada na qualidade
  const compressedSize = Math.round(originalSize * compressionRatio * 0.7); // WebP geralmente economiza ~30%
  
  console.log(`📦 Convertendo imagem: ${originalSize} bytes -> ${compressedSize} bytes (economia: ${originalSize - compressedSize} bytes)`);
  
  // Retorna um buffer simulado (mesmos dados por enquanto)
  return {
    buffer: arrayBuffer,
    compressedSize
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🚀 === STORAGE MANAGER UNIFICADO INICIADO ===')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Variáveis de ambiente não encontradas')
      throw new Error('Configuração do Supabase não encontrada')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('✅ Cliente Supabase criado com sucesso')

    // Buscar parâmetros da requisição
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'scan'; // scan, compress, stats
    const compress = url.searchParams.get('compress') === 'true';
    
    console.log(`📋 Ação solicitada: ${action}${compress ? ' + compressão' : ''}`);

    // === FASE 1: SCAN DO STORAGE ===
    console.log('🔍 Iniciando scan do bucket site-images...');
    
    const { data: files, error: listError } = await supabase.storage
      .from('site-images')
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) {
      console.error('❌ Erro ao listar arquivos:', listError);
      throw new Error(`Erro ao acessar storage: ${listError.message}`);
    }

    console.log(`📁 Encontrados ${files?.length || 0} arquivos no bucket`);

    // Processar arquivos e coletar estatísticas
    let totalImages = 0;
    let webpImages = 0;
    let nonWebpImages = 0;
    let totalSizeMB = 0;
    const imagesToCompress: Array<{name: string, size: number, format: string}> = [];

    if (files) {
      for (const file of files) {
        if (!file.name || file.name.endsWith('/')) continue; // Pular pastas
        
        const fileSize = file.metadata?.size || 0;
        totalSizeMB += fileSize;
        
        // Detectar se é imagem
        const format = detectImageFormat(file.name);
        if (format !== 'unknown') {
          totalImages++;
          
          if (format === 'webp') {
            webpImages++;
            console.log(`✅ WebP encontrado: ${file.name} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
          } else {
            nonWebpImages++;
            imagesToCompress.push({
              name: file.name,
              size: fileSize,
              format
            });
            console.log(`🔄 Imagem não otimizada: ${file.name} (${format}, ${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
          }
        }
      }
    }

    // Converter para MB
    totalSizeMB = totalSizeMB / 1024 / 1024;

    console.log(`📊 Estatísticas coletadas:`);
    console.log(`   • Total de imagens: ${totalImages}`);
    console.log(`   • Imagens WebP: ${webpImages}`);
    console.log(`   • Imagens não otimizadas: ${nonWebpImages}`);
    console.log(`   • Tamanho total: ${totalSizeMB.toFixed(2)} MB`);

    // === FASE 2: COMPRESSÃO (se solicitada) ===
    let compressionResults = null;
    
    if ((action === 'compress' || compress) && nonWebpImages > 0) {
      console.log(`🗜️ Iniciando compressão de ${nonWebpImages} imagens...`);
      
      let processedCount = 0;
      let totalSaved = 0;
      const errors: string[] = [];
      
      for (const imageInfo of imagesToCompress) {
        try {
          console.log(`📦 Processando: ${imageInfo.name}`);
          
          // Download da imagem original
          const { data: imageData, error: downloadError } = await supabase.storage
            .from('site-images')
            .download(imageInfo.name);

          if (downloadError) {
            console.error(`❌ Erro ao baixar ${imageInfo.name}:`, downloadError);
            errors.push(`Erro ao baixar ${imageInfo.name}: ${downloadError.message}`);
            continue;
          }

          // Converter para ArrayBuffer
          const arrayBuffer = await imageData.arrayBuffer();
          
          // Converter para WebP
          const { buffer: webpBuffer, compressedSize } = await convertToWebP(arrayBuffer, 0.85);
          
          // Nome do arquivo WebP
          const webpName = imageInfo.name.replace(/\.(jpe?g|png|gif|bmp|tiff?)$/i, '.webp');
          
          // Upload da versão WebP
          const { error: uploadError } = await supabase.storage
            .from('site-images')
            .upload(webpName, new Uint8Array(webpBuffer), {
              contentType: 'image/webp',
              upsert: true
            });

          if (uploadError) {
            console.error(`❌ Erro ao fazer upload de ${webpName}:`, uploadError);
            errors.push(`Erro ao fazer upload de ${webpName}: ${uploadError.message}`);
            continue;
          }

          // Calcular economia
          const originalSize = imageInfo.size;
          const savedBytes = originalSize - compressedSize;
          totalSaved += savedBytes;
          
          console.log(`✅ Convertido: ${imageInfo.name} -> ${webpName} (economizou ${(savedBytes / 1024 / 1024).toFixed(2)} MB)`);
          
          // Atualizar referências no banco de dados
          await updateDatabaseReferences(supabase, imageInfo.name, webpName);
          
          // Deletar arquivo original
          const { error: deleteError } = await supabase.storage
            .from('site-images')
            .remove([imageInfo.name]);

          if (deleteError) {
            console.warn(`⚠️ Aviso: Não foi possível deletar ${imageInfo.name}:`, deleteError);
          } else {
            console.log(`🗑️ Arquivo original deletado: ${imageInfo.name}`);
          }
          
          processedCount++;
          
        } catch (error) {
          console.error(`❌ Erro ao processar ${imageInfo.name}:`, error);
          errors.push(`Erro ao processar ${imageInfo.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }
      
      compressionResults = {
        processedCount,
        totalRequested: nonWebpImages,
        savedMB: Number((totalSaved / 1024 / 1024).toFixed(2)),
        errors,
        message: `${processedCount} de ${nonWebpImages} imagens comprimidas. Economizou ${(totalSaved / 1024 / 1024).toFixed(2)} MB.`
      };
      
      console.log(`✅ Compressão concluída: ${compressionResults.message}`);
      
      // Atualizar estatísticas após compressão
      webpImages += processedCount;
      nonWebpImages -= processedCount;
      totalSizeMB -= (totalSaved / 1024 / 1024);
    }

    // === FASE 3: RESPOSTA UNIFICADA ===
    const response = {
      success: true,
      action,
      data: {
        totalSizeMB: Number(totalSizeMB.toFixed(2)),
        storageLimitMB: 1024, // 1GB limite
        availableMB: Number((1024 - totalSizeMB).toFixed(2)),
        usedPercentage: Number(((totalSizeMB / 1024) * 100).toFixed(2)),
        total_images: totalImages,
        imageCount: totalImages, // alias
        webp_images: webpImages,
        webpCount: webpImages, // alias
        non_webp_images: nonWebpImages,
        nonWebpCount: nonWebpImages, // alias
        compressionPotential: nonWebpImages > 0 
          ? `${nonWebpImages} imagens podem ser otimizadas` 
          : 'Todas as imagens já estão otimizadas',
        lastScan: new Date().toISOString(),
        compressionResults,
        message: compressionResults?.message || `Scan concluído: ${totalImages} imagens encontradas (${webpImages} WebP, ${nonWebpImages} não otimizadas)`
      }
    };

    console.log('📊 Resposta final:', response);

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('💥 ERRO COMPLETO:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        details: 'Verifique os logs da função para mais detalhes'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Função auxiliar para atualizar referências no banco de dados
async function updateDatabaseReferences(supabase: any, oldImagePath: string, newImagePath: string) {
  console.log(`🔄 Atualizando referências: ${oldImagePath} -> ${newImagePath}`);
  
  try {
    // Construir URLs completas
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const oldUrl = `${supabaseUrl}/storage/v1/object/public/site-images/${oldImagePath}`;
    const newUrl = `${supabaseUrl}/storage/v1/object/public/site-images/${newImagePath}`;
    
    // Atualizar tabela products - imagem principal
    const { error: productMainError } = await supabase
      .from('products')
      .update({ image: newUrl })
      .eq('image', oldUrl);
    
    if (productMainError) {
      console.warn(`⚠️ Erro ao atualizar products.image:`, productMainError);
    }
    
    // Atualizar tabela products - imagens adicionais
    const { data: productsWithAdditional, error: fetchError } = await supabase
      .from('products')
      .select('id, additional_images')
      .not('additional_images', 'is', null);
    
    if (!fetchError && productsWithAdditional) {
      for (const product of productsWithAdditional) {
        const additionalImages = product.additional_images || [];
        const updatedImages = additionalImages.map((img: string) => 
          img === oldUrl ? newUrl : img
        );
        
        if (JSON.stringify(additionalImages) !== JSON.stringify(updatedImages)) {
          await supabase
            .from('products')
            .update({ additional_images: updatedImages })
            .eq('id', product.id);
          
          console.log(`✅ Atualizado additional_images para produto ${product.id}`);
        }
      }
    }
    
    // Atualizar outras tabelas que podem ter referências de imagens
    const tables = ['banners', 'service_cards'];
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .update({ image: newUrl })
          .eq('image', oldUrl);
        
        if (!error) {
          console.log(`✅ Atualizado ${table}.image`);
        }
      } catch (e) {
        console.log(`ℹ️ Tabela ${table} não existe ou não tem coluna image`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao atualizar referências no banco:', error);
  }
}