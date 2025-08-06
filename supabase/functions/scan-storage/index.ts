import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Iniciando scan do storage real ===')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis de ambiente não encontradas')
      throw new Error('Configuração do Supabase não encontrada')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log('Cliente Supabase criado com sucesso')

    // Listar todos os arquivos no bucket site-images
    console.log('Escaneando bucket site-images...')
    const { data: files, error: listError } = await supabase.storage
      .from('site-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (listError) {
      console.error('Erro ao listar arquivos:', listError)
      throw new Error(`Erro ao listar arquivos: ${listError.message}`)
    }

    console.log(`Encontrados ${files?.length || 0} arquivos no storage`)

    // Processar arquivos recursivamente com melhor detecção de arquivos vs pastas
    const getAllFiles = async (path = '', allFiles: any[] = [], visitedPaths = new Set()): Promise<any[]> => {
      const currentPath = path || '/'
      
      // Evitar loops infinitos
      if (visitedPaths.has(currentPath)) {
        console.log(`Caminho já visitado, pulando: ${currentPath}`)
        return allFiles
      }
      visitedPaths.add(currentPath)
      
      console.log(`Escaneando pasta: ${currentPath}`)
      
      const { data: items, error } = await supabase.storage
        .from('site-images')
        .list(path, { 
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (error) {
        console.error(`Erro ao escanear ${currentPath}:`, error)
        return allFiles
      }

      if (!items || items.length === 0) {
        console.log(`Nenhum item encontrado em: ${currentPath}`)
        return allFiles
      }

      console.log(`Encontrados ${items.length} itens em ${currentPath}`)

      for (const item of items) {
        const fullPath = path ? `${path}/${item.name}` : item.name
        
        // Verificar se é arquivo baseado em extensão E metadata
        const hasExtension = item.name.includes('.')
        const hasMetadata = item.metadata && Object.keys(item.metadata).length > 0
        
        if (hasExtension && hasMetadata) {
          // É um arquivo real
          allFiles.push({
            ...item,
            fullPath,
            isFile: true
          })
          console.log(`Arquivo encontrado: ${fullPath} (${item.metadata?.size || 0} bytes)`)
        } else if (!hasExtension) {
          // É uma pasta, escanear recursivamente
          console.log(`Pasta encontrada: ${fullPath}, escaneando...`)
          await getAllFiles(fullPath, allFiles, visitedPaths)
        } else {
          // Caso ambíguo - log para investigação
          console.log(`Item ambíguo: ${fullPath} - extensão: ${hasExtension}, metadata: ${hasMetadata}`)
        }
      }

      return allFiles
    }

    const allFiles = await getAllFiles()
    console.log(`Total de arquivos encontrados: ${allFiles.length}`)

    // Calcular estatísticas com validação rigorosa
    let totalSizeBytes = 0
    let totalImages = 0
    let webpImages = 0
    let nonWebpImages = 0
    let invalidFiles = 0

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']
    
    console.log(`\n=== ANÁLISE DE ${allFiles.length} ARQUIVOS ===`)
    
    allFiles.forEach((file, index) => {
      const fileName = file.name.toLowerCase()
      const fileSize = file.metadata?.size || 0
      const isImage = imageExtensions.some(ext => fileName.endsWith(ext))
      
      if (isImage && fileSize > 0) {
        totalImages++
        totalSizeBytes += fileSize
        
        if (fileName.endsWith('.webp')) {
          webpImages++
          console.log(`${index + 1}. WebP: ${file.fullPath} (${(fileSize / 1024).toFixed(1)} KB)`)
        } else {
          nonWebpImages++
          console.log(`${index + 1}. Não-WebP: ${file.fullPath} (${(fileSize / 1024).toFixed(1)} KB)`)
        }
      } else if (isImage && fileSize === 0) {
        invalidFiles++
        console.log(`${index + 1}. INVÁLIDO: ${file.fullPath} (0 bytes - arquivo corrompido)`)
      } else {
        console.log(`${index + 1}. Ignorado: ${file.fullPath} (não é imagem)`)
      }
    })
    
    console.log(`\n=== RESUMO ===`)
    console.log(`Total de arquivos escaneados: ${allFiles.length}`)
    console.log(`Imagens válidas: ${totalImages}`)
    console.log(`Imagens WebP: ${webpImages}`)
    console.log(`Imagens não-WebP: ${nonWebpImages}`)
    console.log(`Arquivos inválidos/corrompidos: ${invalidFiles}`)
    console.log(`Tamanho total: ${(totalSizeBytes / 1024 / 1024).toFixed(2)} MB`)

    const totalSizeMB = totalSizeBytes / (1024 * 1024)

    console.log('Estatísticas calculadas:', {
      totalSizeMB: totalSizeMB.toFixed(2),
      totalImages,
      webpImages,
      nonWebpImages
    })

    // Atualizar tabela storage_stats
    const { data: currentStats, error: fetchError } = await supabase
      .from('storage_stats')
      .select('*')
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erro ao buscar stats atuais:', fetchError)
      throw new Error(`Erro ao buscar stats: ${fetchError.message}`)
    }

    const statsData = {
      total_size_mb: Math.round(totalSizeMB * 100) / 100,
      total_images: totalImages,
      webp_images: webpImages,
      non_webp_images: nonWebpImages,
      last_scan: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (currentStats) {
      // Atualizar registro existente
      const { error: updateError } = await supabase
        .from('storage_stats')
        .update(statsData)
        .eq('id', currentStats.id)

      if (updateError) {
        console.error('Erro ao atualizar stats:', updateError)
        throw new Error(`Erro ao atualizar stats: ${updateError.message}`)
      }

      console.log('Stats atualizadas com sucesso')
    } else {
      // Criar novo registro
      const { error: insertError } = await supabase
        .from('storage_stats')
        .insert([{
          ...statsData,
          created_at: new Date().toISOString()
        }])

      if (insertError) {
        console.error('Erro ao inserir stats:', insertError)
        throw new Error(`Erro ao inserir stats: ${insertError.message}`)
      }

      console.log('Stats criadas com sucesso')
    }

    const response = {
      success: true,
      data: {
        ...statsData,
        scannedFiles: allFiles.length,
        lastScan: new Date().toISOString(),
        message: `Scan concluído: ${totalImages} imagens encontradas (${webpImages} WebP, ${nonWebpImages} não otimizadas)`
      }
    }

    console.log('Scan completo:', response)

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('ERRO COMPLETO:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Erro interno do servidor',
        details: 'Verifique os logs da função para mais detalhes'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})