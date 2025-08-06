import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  HardDrive, 
  Zap, 
  Image, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Minimize2,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface StorageStats {
  totalSizeMB: number;
  storageLimitMB: number;
  availableMB: number;
  usedPercentage: number;
  imageCount: number;
  webpCount: number;
  nonWebpCount: number;
  compressionPotential: string;
  lastScan?: string;
}

interface CompressionResult {
  processedCount: number;
  savedMB: number;
  errors: string[];
  message: string;
}

interface CompressionProgress {
  currentFile: string;
  processedCount: number;
  totalCount: number;
  isActive: boolean;
}

const StorageManager: React.FC = () => {
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [scanning, setScanning] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgress | null>(null);

  // Escanear storage usando a nova função unificada
  const scanRealStorage = async () => {
    if (scanning) return;
    
    setScanning(true);
    try {
      console.log('🔍 Iniciando scan completo do storage...');
      
      const { data, error } = await supabase.functions.invoke('storage-manager', {
        body: JSON.stringify({ action: 'scan' })
      });
      
      console.log('📨 Resposta do scan:', { data, error });
      
      if (error) {
        console.error('❌ Erro na função storage-manager:', error);
        toast.error('Erro ao escanear storage: ' + error.message);
        return;
      }

      if (!data || !data.success) {
        console.error('❌ Resposta inválida:', data);
        toast.error(data?.error || 'Erro desconhecido ao escanear storage');
        return;
      }

      console.log('✅ Scan concluído:', data.data);
      setStorageStats(data.data);
      toast.success(data.data.message || `Scan concluído: ${data.data?.total_images || 0} imagens encontradas`);
      
    } catch (error: any) {
      console.error('❌ Erro ao escanear storage:', error);
      toast.error('Erro inesperado ao escanear storage');
    } finally {
      setScanning(false);
    }
  };

  // Carregar estatísticas de storage usando a nova função unificada
  const loadStorageStats = async () => {
    setLoadingStats(true);
    try {
      console.log('📊 Carregando estatísticas de storage...');
      
      const { data, error } = await supabase.functions.invoke('storage-manager', {
        body: JSON.stringify({ action: 'stats' })
      });
      
      console.log('📨 Resposta recebida:', { data, error });
      
      if (error) {
        console.error('❌ Erro na função storage-manager:', error);
        toast.error('Erro ao carregar estatísticas: ' + error.message);
        return;
      }

      if (!data || !data.success) {
        console.error('❌ Resposta inválida:', data);
        toast.error(data?.error || 'Erro desconhecido ao carregar estatísticas');
        return;
      }

      console.log('✅ Dados recebidos:', data.data);
      setStorageStats(data.data);
      
    } catch (error: any) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      toast.error('Erro inesperado ao carregar estatísticas');
    } finally {
      setLoadingStats(false);
    }
  };

  // Comprimir todas as imagens usando a nova função unificada
  const compressAllImages = async () => {
    if (compressing) return;
    
    if (!storageStats || storageStats.nonWebpCount === 0) {
      toast.info('Não há imagens para comprimir! Todas já estão otimizadas.');
      return;
    }

    setCompressing(true);
    setCompressionResult(null);
    setCompressionProgress({ currentFile: '', processedCount: 0, totalCount: storageStats.nonWebpCount, isActive: true });
    
    try {
      console.log(`🗜️ Iniciando compressão de ${storageStats.nonWebpCount} imagens...`);
      toast.info('Compressão iniciada... Isso pode levar alguns minutos.');
      
      const { data, error } = await supabase.functions.invoke('storage-manager', {
        body: JSON.stringify({ action: 'compress' })
      });
      
      console.log('📨 Resposta da compressão:', { data, error });
      
      if (error) {
        console.error('❌ Erro na função storage-manager:', error);
        toast.error('Erro ao comprimir imagens: ' + error.message);
        return;
      }

      if (!data || !data.success) {
        console.error('❌ Resposta inválida:', data);
        toast.error(data?.error || 'Erro desconhecido ao comprimir imagens');
        return;
      }

      console.log('✅ Compressão concluída:', data.data);
      
      // Atualizar dados com resultados da compressão
      setStorageStats(data.data);
      setCompressionResult(data.data.compressionResults);
      
      if (data.data.compressionResults) {
        const { processedCount, savedMB } = data.data.compressionResults;
        if (processedCount > 0) {
          toast.success(`${processedCount} imagens comprimidas! Economizou ${savedMB} MB de espaço.`);
        } else {
          toast.info('Nenhuma imagem foi comprimida.');
        }
      }
      
    } catch (error: any) {
      console.error('❌ Erro na compressão:', error);
      toast.error('Erro inesperado ao comprimir imagens');
    } finally {
      setCompressing(false);
      setCompressionProgress(null);
    }
  };

  // Carregar estatísticas ao montar o componente
  useEffect(() => {
    // Carregar estatísticas primeiro, deixando o scan manual
    loadStorageStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciamento de Storage</h2>
          <p className="text-gray-400 mt-1">
            Monitore o uso de armazenamento e otimize suas imagens
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={scanRealStorage}
            disabled={scanning}
            variant="outline"
            className="text-white border-green-600 hover:bg-green-700 bg-green-600/10"
          >
            {scanning ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Escanear
          </Button>
          <Button
            onClick={loadStorageStats}
            disabled={loadingStats}
            variant="outline"
            className="text-white border-gray-600 hover:bg-gray-700"
          >
            {loadingStats ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <BarChart3 className="w-4 h-4 mr-2" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Storage Statistics Cards */}
      {storageStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-[#2C2C44] border-[#343A40]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <HardDrive className="w-4 h-4 mr-2" />
                Espaço Usado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {storageStats.totalSizeMB} MB
              </div>
              <p className="text-xs text-gray-400">
                de {storageStats.storageLimitMB} MB
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#2C2C44] border-[#343A40]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Total de Imagens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {storageStats.imageCount}
              </div>
              <p className="text-xs text-gray-400">
                arquivos de imagem
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#2C2C44] border-[#343A40]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Imagens WebP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {storageStats.webpCount}
              </div>
              <p className="text-xs text-gray-400">
                otimizadas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#2C2C44] border-[#343A40]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Não Otimizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {storageStats.nonWebpCount}
              </div>
              <p className="text-xs text-gray-400">
                podem ser otimizadas
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-[#2C2C44] border-[#343A40]">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-8 bg-gray-600 rounded mb-1"></div>
                  <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Storage Usage Chart */}
      {storageStats && (
        <Card className="bg-[#2C2C44] border-[#343A40]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Uso do Armazenamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Espaço utilizado</span>
                <span className="text-white font-medium">
                  {storageStats.usedPercentage}%
                </span>
              </div>
              <Progress 
                value={storageStats.usedPercentage} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>{storageStats.totalSizeMB} MB usados</span>
                <span>{storageStats.availableMB} MB disponíveis</span>
              </div>
            </div>

            {storageStats.usedPercentage > 80 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-400 text-sm font-medium">
                    Aviso: Você está usando mais de 80% do armazenamento disponível
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compression Section */}
      {storageStats && (
        <Card className="bg-[#2C2C44] border-[#343A40]">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Minimize2 className="w-5 h-5 mr-2" />
              Compressão de Imagens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">Potencial de Otimização</h4>
                  <p className="text-gray-300 text-sm mb-3">
                    {storageStats.compressionPotential}
                  </p>
                  {storageStats.nonWebpCount > 0 && (
                    <p className="text-gray-400 text-xs">
                      A compressão pode economizar entre 20-50% do espaço das imagens não otimizadas.
                    </p>
                  )}
                </div>
                <Button
                  onClick={compressAllImages}
                  disabled={compressing || storageStats.nonWebpCount === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {compressing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Comprimindo...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Comprimir Todas
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Compression Result */}
            {compressionResult && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="text-green-400 font-medium">Compressão Concluída!</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    ✅ {compressionResult.processedCount} imagens processadas
                  </p>
                  <p className="text-gray-300">
                    💾 {compressionResult.savedMB} MB economizados
                  </p>
                  {compressionResult.errors.length > 0 && (
                    <p className="text-yellow-400">
                      ⚠️ {compressionResult.errors.length} erros encontrados
                    </p>
                  )}
                </div>
              </div>
            )}

            {compressing && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Loader2 className="w-5 h-5 animate-spin text-yellow-400 mr-3" />
                  <div>
                    <h4 className="text-yellow-400 font-medium">Processando Imagens</h4>
                    <p className="text-gray-400 text-sm">
                      Aguarde enquanto otimizamos suas imagens...
                    </p>
                  </div>
                </div>
                
                {compressionProgress && compressionProgress.isActive && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Progresso</span>
                      <span className="text-yellow-400 font-medium">
                        {compressionProgress.processedCount}/{compressionProgress.totalCount}
                      </span>
                    </div>
                    <Progress 
                      value={(compressionProgress.processedCount / compressionProgress.totalCount) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-gray-400 truncate">
                      Processando: {compressionProgress.currentFile}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StorageManager;