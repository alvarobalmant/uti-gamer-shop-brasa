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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Buscando estatísticas de storage...')

    // Listar todos os arquivos no bucket site-images
    const { data: files, error: listError } = await supabase.storage
      .from('site-images')
      .list('', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (listError) {
      console.error('Erro ao listar arquivos:', listError)
      throw new Error(`Erro ao listar arquivos: ${listError.message}`)
    }

    // Calcular tamanho total usado
    let totalSize = 0
    let imageCount = 0
    let webpCount = 0
    let nonWebpCount = 0

    const calculateFolderSize = async (folderPath = '') => {
      const { data: folderFiles, error } = await supabase.storage
        .from('site-images')
        .list(folderPath, { limit: 1000 })

      if (error) {
        console.warn(`Erro ao acessar pasta ${folderPath}:`, error)
        return
      }

      for (const file of folderFiles || []) {
        if (file.metadata?.size) {
          totalSize += file.metadata.size
          imageCount++
          
          // Verificar se é WebP
          if (file.name.toLowerCase().endsWith('.webp')) {
            webpCount++
          } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
            nonWebpCount++
          }
        }
      }
    }

    // Verificar pasta raiz e subpastas comuns
    await calculateFolderSize('')
    await calculateFolderSize('products')
    await calculateFolderSize('banners')
    await calculateFolderSize('general')

    // Limites do Supabase (free tier = 1GB, pro = 100GB)
    const freeLimit = 1024 * 1024 * 1024 // 1GB em bytes
    const proLimit = 100 * 1024 * 1024 * 1024 // 100GB em bytes
    
    // Para este exemplo, vou assumir free tier, mas pode ser ajustado
    const storageLimit = freeLimit
    const usedPercentage = (totalSize / storageLimit) * 100

    // Converter para MB para exibição
    const totalSizeMB = totalSize / (1024 * 1024)
    const storageLimitMB = storageLimit / (1024 * 1024)
    const availableMB = storageLimitMB - totalSizeMB

    console.log(`Storage stats calculadas:
      - Total usado: ${totalSizeMB.toFixed(2)} MB
      - Limite: ${storageLimitMB.toFixed(2)} MB
      - Disponível: ${availableMB.toFixed(2)} MB
      - Percentual usado: ${usedPercentage.toFixed(2)}%
      - Total de imagens: ${imageCount}
      - WebP: ${webpCount}
      - Não-WebP: ${nonWebpCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          totalSizeBytes: totalSize,
          totalSizeMB: Math.round(totalSizeMB * 100) / 100,
          storageLimitMB: Math.round(storageLimitMB * 100) / 100,
          availableMB: Math.round(availableMB * 100) / 100,
          usedPercentage: Math.round(usedPercentage * 100) / 100,
          imageCount,
          webpCount,
          nonWebpCount,
          compressionPotential: nonWebpCount > 0 ? `${nonWebpCount} imagens podem ser otimizadas` : 'Todas as imagens já estão otimizadas'
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erro ao obter estatísticas de storage:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Erro interno do servidor',
        error: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})