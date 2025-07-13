import { useState } from 'react';
import { toast } from 'sonner';
import { removeBackground, loadImage, loadImageFromUrl } from '@/utils/backgroundRemoval';
import { useImageUpload } from './useImageUpload';

export const useBackgroundRemoval = () => {
  const [processing, setProcessing] = useState(false);
  const { uploadImage } = useImageUpload();

  const processImageFromUrl = async (imageUrl: string): Promise<string | null> => {
    setProcessing(true);
    
    try {
      console.log('Processando imagem da URL:', imageUrl);
      
      // Carregar imagem da URL
      const imageElement = await loadImageFromUrl(imageUrl);
      
      // Remover fundo
      const processedBlob = await removeBackground(imageElement);
      
      // Converter blob para arquivo
      const processedFile = new File([processedBlob], 'processed.png', { type: 'image/png' });
      
      // Fazer upload da imagem processada
      const uploadedUrl = await uploadImage(processedFile, 'products');
      
      if (uploadedUrl) {
        toast.success('Fundo removido com sucesso!');
        return uploadedUrl;
      } else {
        throw new Error('Falha no upload da imagem processada');
      }
      
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      toast.error('Erro ao remover fundo da imagem');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const processImageFromFile = async (file: File): Promise<string | null> => {
    setProcessing(true);
    
    try {
      console.log('Processando arquivo:', file.name);
      
      // Carregar imagem do arquivo
      const imageElement = await loadImage(file);
      
      // Remover fundo
      const processedBlob = await removeBackground(imageElement);
      
      // Converter blob para arquivo
      const processedFile = new File([processedBlob], `${file.name.split('.')[0]}_no_bg.png`, { 
        type: 'image/png' 
      });
      
      // Fazer upload da imagem processada
      const uploadedUrl = await uploadImage(processedFile, 'products');
      
      if (uploadedUrl) {
        toast.success('Fundo removido com sucesso!');
        return uploadedUrl;
      } else {
        throw new Error('Falha no upload da imagem processada');
      }
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error('Erro ao remover fundo da imagem');
      return null;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processImageFromUrl,
    processImageFromFile,
    processing
  };
};