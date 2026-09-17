import React, { Suspense } from 'react';
import { useAdminImport } from '@/hooks/useConditionalImport';
import { AdminErrorBoundary } from './AdminErrorBoundary';

// Tipos para as funcionalidades admin
interface BackgroundRemovalModule {
  removeBackground: (imageElement: HTMLImageElement) => Promise<Blob>;
  loadImage: (file: Blob) => Promise<HTMLImageElement>;
}


// Component para carregar remoção de background apenas para admins
export const LazyBackgroundRemoval: React.FC<{
  onModuleLoad?: (module: BackgroundRemovalModule) => void;
  children: (module: BackgroundRemovalModule | null, loading: boolean) => React.ReactNode;
}> = ({ onModuleLoad, children }) => {
  const { module, loading, error } = useAdminImport<BackgroundRemovalModule>(
    () => import('@/utils/backgroundRemoval'),
    2000 // Delay para não afetar carregamento inicial
  );

  React.useEffect(() => {
    if (module && onModuleLoad) {
      onModuleLoad(module);
    }
  }, [module, onModuleLoad]);

  if (error) {
    console.warn('Failed to load background removal:', error);
    return null;
  }

  return (
    <AdminErrorBoundary fallback={() => <div>Erro ao carregar ferramenta de imagem</div>}>
      {children(module, loading)}
    </AdminErrorBoundary>
  );
};


// Component para carregar transformers AI apenas para admins
export const LazyAIFeatures: React.FC<{
  onModuleLoad?: (module: any) => void;
  children: (module: any | null, loading: boolean) => React.ReactNode;
}> = ({ onModuleLoad, children }) => {
  const { module, loading, error } = useAdminImport(
    () => import('@huggingface/transformers'),
    3000 // Maior delay por ser muito pesado
  );

  React.useEffect(() => {
    if (module && onModuleLoad) {
      onModuleLoad(module);
    }
  }, [module, onModuleLoad]);

  if (error) {
    console.warn('Failed to load AI features:', error);
    return null;
  }

  return (
    <AdminErrorBoundary fallback={() => <div>Erro ao carregar funcionalidades de IA</div>}>
      {children(module, loading)}
    </AdminErrorBoundary>
  );
};

// Loading placeholder para features admin
export const AdminFeatureLoader: React.FC<{ feature: string }> = ({ feature }) => (
  <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
      <span className="text-sm text-gray-600">Carregando {feature}...</span>
    </div>
  </div>
);