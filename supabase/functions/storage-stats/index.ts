import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Calculando estatísticas de storage...')

    // Buscar dados reais do banco de dados
    const { data: statsData, error: fetchError } = await supabase
      .from('storage_stats')
      .select('*')
      .single()
    
    if (fetchError) {
      console.error('Erro ao buscar stats:', fetchError)
      throw new Error('Erro ao buscar dados de storage')
    }

    if (!statsData) {
      throw new Error('Nenhum dado de storage encontrado')
    }
    
    // Usar dados reais do banco
    const totalSizeMB = statsData.total_size_bytes / (1024 * 1024)
    const storageLimitMB = 1024 // 1GB limite
    const imageCount = statsData.total_images
    const webpCount = statsData.webp_images
    const nonWebpCount = statsData.non_webp_images
    
    const availableMB = storageLimitMB - totalSizeMB
    const usedPercentage = (totalSizeMB / storageLimitMB) * 100

    // Atualizar última consulta
    const { error: updateError } = await supabase
      .from('storage_stats')
      .update({
        last_updated: new Date().toISOString()
      })
      .eq('id', statsData.id)

    if (updateError) {
      console.warn('Erro ao atualizar tabela de stats:', updateError)
    }

    console.log(`Storage stats calculadas:
      - Total usado: ${totalSizeMB} MB
      - Limite: ${storageLimitMB} MB
      - Disponível: ${availableMB} MB
      - Percentual usado: ${usedPercentage.toFixed(2)}%
      - Total de imagens: ${imageCount}
      - WebP: ${webpCount}
      - Não-WebP: ${nonWebpCount}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
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
        message: 'Erro ao carregar estatísticas de storage'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})