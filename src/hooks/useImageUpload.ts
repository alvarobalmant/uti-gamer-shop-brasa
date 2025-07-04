
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
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('site-images')
        .upload(fileName, processedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);

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

  // Nova função para baixar imagem de URL e fazer upload
  const downloadAndUploadFromUrl = async (imageUrl: string, folder: string = 'products'): Promise<string | null> => {
    setUploading(true);
    
    try {
      console.log('Baixando imagem da URL:', imageUrl);
      
      // Converter URLs do Imgur para formato direto da imagem
      let directImageUrl = imageUrl;
      if (imageUrl.includes('imgur.com/') && !imageUrl.includes('i.imgur.com')) {
        const imgurId = imageUrl.split('/').pop()?.split('.')[0];
        if (imgurId) {
          directImageUrl = `https://i.imgur.com/${imgurId}.jpg`;
          console.log('URL do Imgur convertida para:', directImageUrl);
        }
      }
      
      // Baixar a imagem da URL
      const response = await fetch(directImageUrl);
      if (!response.ok) {
        throw new Error(`Erro ao baixar imagem: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Verificar se é uma imagem
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL não aponta para uma imagem válida');
      }

      // Converter blob para File
      const fileName = `downloaded-${Date.now()}.${blob.type.split('/')[1]}`;
      const file = new File([blob], fileName, { type: blob.type });

      // Fazer upload usando a função existente
      const uploadedUrl = await uploadImage(file, folder);
      
      if (uploadedUrl) {
        toast({
          title: "Imagem baixada e salva!",
          description: "A imagem foi baixada da URL e convertida para WebP.",
        });
      }

      return uploadedUrl;
    } catch (error: any) {
      console.error('Erro ao baixar e fazer upload da imagem:', error);
      toast({
        title: "Erro ao processar imagem",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Nova função para deletar imagem do storage
  const deleteImage = async (imageUrl: string): Promise<boolean> => {
    try {
      // Verificar se é uma URL do nosso storage
      if (!imageUrl.includes('supabase') || !imageUrl.includes('site-images')) {
        console.log('URL não é do storage interno, não precisa deletar:', imageUrl);
        return true;
      }

      // Extrair o caminho do arquivo da URL
      const urlParts = imageUrl.split('/storage/v1/object/public/site-images/');
      if (urlParts.length !== 2) {
        console.warn('Não foi possível extrair caminho do arquivo da URL:', imageUrl);
        return false;
      }

      const filePath = urlParts[1];
      console.log('Deletando arquivo do storage:', filePath);

      const { error } = await supabase.storage
        .from('site-images')
        .remove([filePath]);

      if (error) {
        console.error('Erro ao deletar arquivo do storage:', error);
        return false;
      }

      console.log('Arquivo deletado com sucesso:', filePath);
      return true;
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      return false;
    }
  };

  return { uploadImage, downloadAndUploadFromUrl, deleteImage, uploading };
};
