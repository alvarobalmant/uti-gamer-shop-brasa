
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Função para converter imagem para WebP
  const convertToWebP = (file: File, quality: number = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Definir dimensões do canvas
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Desenhar imagem no canvas
        ctx?.drawImage(img, 0, 0);

        // Converter para WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(webpFile);
            } else {
              reject(new Error('Falha na conversão para WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = URL.createObjectURL(file);
    });
  };

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    setUploading(true);
    
    try {
      let processedFile = file;

      // Converter para WebP se não for WebP
      if (file.type !== 'image/webp') {
        try {
          processedFile = await convertToWebP(file);
          console.log(`Imagem convertida para WebP: ${file.size} bytes → ${processedFile.size} bytes`);
        } catch (conversionError) {
          console.warn('Falha na conversão para WebP, usando arquivo original:', conversionError);
          // Continua com o arquivo original se a conversão falhar
        }
      }

      const fileExt = processedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Determinar bucket baseado na pasta
      const bucketName = folder === 'navigation-icons' ? 'navigation-icons' : 'site-images';
      const filePath = folder === 'navigation-icons' ? fileName : `${folder}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      toast({
        title: "Upload realizado com sucesso!",
        description: `Imagem otimizada e carregada como ${processedFile.type}.`,
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading };
};
