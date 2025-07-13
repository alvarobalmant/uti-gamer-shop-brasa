import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js para usar modelos remotos
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;
const MIN_IMAGE_DIMENSION = 256;

// Modelos públicos disponíveis para diferentes tipos de conteúdo
const SEGMENTATION_MODELS = {
  general: 'Xenova/segformer-b0-finetuned-ade-512-512',
  portrait: 'Xenova/segformer-b0-finetuned-ade-512-512',
  object: 'Xenova/segformer-b0-finetuned-ade-512-512'
};

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  let width = image.naturalWidth;
  let height = image.naturalHeight;
  let resized = false;

  // Garantir dimensões mínimas
  if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
    const scale = Math.max(MIN_IMAGE_DIMENSION / width, MIN_IMAGE_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    resized = true;
  }

  // Garantir dimensões máximas
  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    const scale = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    resized = true;
  }

  // Garantir dimensões sejam múltiplos de 32 (otimização para IA)
  width = Math.round(width / 32) * 32;
  height = Math.round(height / 32) * 32;

  canvas.width = width;
  canvas.height = height;
  
  if (resized) {
    // Usar filtro de alta qualidade para redimensionamento
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  
  ctx.drawImage(image, 0, 0, width, height);
  return resized;
}

function detectContentType(imageElement: HTMLImageElement): 'portrait' | 'object' | 'general' {
  const { naturalWidth, naturalHeight } = imageElement;
  const aspectRatio = naturalWidth / naturalHeight;
  
  // Heurística simples para detectar tipo de conteúdo
  if (aspectRatio > 0.7 && aspectRatio < 1.3) {
    return 'portrait'; // Quadrado ou próximo, provavelmente retrato
  } else if (aspectRatio > 1.5 || aspectRatio < 0.6) {
    return 'object'; // Muito retangular, provavelmente objeto/produto
  }
  
  return 'general';
}

function enhanceMask(imageData: ImageData, threshold: number = 128): ImageData {
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    
    // Aplicar threshold mais inteligente
    if (alpha < threshold) {
      data[i + 3] = 0; // Totalmente transparente
    } else if (alpha < threshold + 50) {
      // Suavizar bordas
      data[i + 3] = Math.min(255, alpha * 1.5);
    }
  }
  
  return imageData;
}

function applySmoothEdges(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const width = canvas.width;
  const height = canvas.height;
  
  // Aplicar filtro de suavização nas bordas
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const alpha = data[idx + 3];
      
      if (alpha > 0 && alpha < 255) {
        // Calcular média dos pixels vizinhos
        const neighbors = [
          data[((y-1) * width + x) * 4 + 3],
          data[((y+1) * width + x) * 4 + 3],
          data[(y * width + (x-1)) * 4 + 3],
          data[(y * width + (x+1)) * 4 + 3]
        ];
        
        const avgAlpha = neighbors.reduce((sum, a) => sum + a, 0) / 4;
        data[idx + 3] = Math.round((alpha + avgAlpha) / 2);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

export const removeBackground = async (
  imageElement: HTMLImageElement, 
  options: {
    model?: 'general' | 'portrait' | 'object' | 'auto';
    quality?: 'fast' | 'balanced' | 'high';
    smoothEdges?: boolean;
    threshold?: number;
  } = {}
): Promise<Blob> => {
  try {
    console.log('🎨 Iniciando processo avançado de remoção de fundo...');
    
    const {
      model = 'auto',
      quality = 'balanced',
      smoothEdges = true,
      threshold = 128
    } = options;
    
    // Detectar tipo de conteúdo automaticamente
    const contentType = model === 'auto' ? detectContentType(imageElement) : model;
    const modelName = SEGMENTATION_MODELS[contentType] || SEGMENTATION_MODELS.general;
    
    console.log(`📋 Detectado como: ${contentType}, usando modelo: ${modelName}`);
    
    // Configurar dispositivo baseado na qualidade
    const device = quality === 'fast' ? 'cpu' : 'webgpu';
    
    // Criar pipeline de segmentação
    const segmenter = await pipeline('image-segmentation', modelName, { device });
    
    // Converter HTMLImageElement para canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Não foi possível obter contexto do canvas');
    
    // Redimensionar imagem se necessário
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`🖼️ Imagem ${wasResized ? 'otimizada' : 'mantida'}. Dimensões: ${canvas.width}x${canvas.height}`);
    
    // Obter dados da imagem
    const imageData = canvas.toDataURL('image/jpeg', quality === 'high' ? 0.95 : 0.85);
    
    // Processar com modelo de segmentação
    console.log('🤖 Processando com IA...');
    const result = await segmenter(imageData);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Resultado de segmentação inválido');
    }
    
    console.log(`✅ Segmentação concluída: ${result.length} máscaras encontradas`);
    
    // Criar canvas de saída
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Não foi possível obter contexto do canvas de saída');
    
    // Desenhar imagem original
    outputCtx.drawImage(canvas, 0, 0);
    
    // Aplicar múltiplas máscaras se disponíveis
    const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    const data = outputImageData.data;
    
    // Processar cada máscara
    for (const maskResult of result) {
      if (!maskResult.mask) continue;
      
      const maskData = maskResult.mask.data;
      
      for (let i = 0; i < maskData.length; i++) {
        const currentAlpha = data[i * 4 + 3];
        // Combinar máscaras usando máximo
        const maskAlpha = Math.round((1 - maskData[i]) * 255);
        data[i * 4 + 3] = Math.max(currentAlpha, maskAlpha);
      }
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    
    // Aplicar melhorias pós-processamento
    if (smoothEdges) {
      console.log('✨ Aplicando suavização de bordas...');
      applySmoothEdges(outputCanvas, outputCtx);
    }
    
    // Aplicar threshold personalizado
    if (threshold !== 128) {
      const finalImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const enhancedImageData = enhanceMask(finalImageData, threshold);
      outputCtx.putImageData(enhancedImageData, 0, 0);
    }
    
    console.log('💫 Processamento concluído com sucesso!');
    
    // Converter canvas para blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Falha ao criar blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('❌ Erro na remoção de fundo:', error);
    throw error;
  }
};

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const loadImageFromUrl = async (url: string): Promise<HTMLImageElement> => {
  try {
    // Primeiro tentar carregamento direto com CORS
    const directImage = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    return directImage;
  } catch (error) {
    console.log('Falha no carregamento direto, convertendo para blob...');
    
    // Se falhar, converter para blob primeiro
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Falha ao carregar imagem do blob'));
      };
      img.src = blobUrl;
    });
  }
};

// Utilitários para edição manual
export const createCanvasFromImage = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Não foi possível criar contexto do canvas');
  
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  ctx.drawImage(image, 0, 0);
  
  return canvas;
};

// Converter imagem para blob URL seguro para canvas
export const convertImageToBlobUrl = async (image: HTMLImageElement): Promise<HTMLImageElement> => {
  try {
    // Tentar criar canvas temporário para converter a imagem
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) throw new Error('Não foi possível criar contexto temporário');
    
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    tempCtx.drawImage(image, 0, 0);
    
    // Converter para blob
    return new Promise((resolve, reject) => {
      tempCanvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Falha ao criar blob da imagem'));
          return;
        }
        
        const blobUrl = URL.createObjectURL(blob);
        const newImg = new Image();
        
        newImg.onload = () => resolve(newImg);
        newImg.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Falha ao carregar imagem do blob'));
        };
        newImg.src = blobUrl;
      }, 'image/png');
    });
  } catch (error) {
    console.error('Erro ao converter imagem para blob:', error);
    // Se falhar, retornar a imagem original (pode causar CORS mas é fallback)
    return image;
  }
};

export const applyManualMask = (
  originalCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement
): HTMLCanvasElement => {
  const resultCanvas = document.createElement('canvas');
  const ctx = resultCanvas.getContext('2d');
  
  if (!ctx) throw new Error('Não foi possível criar contexto do canvas');
  
  resultCanvas.width = originalCanvas.width;
  resultCanvas.height = originalCanvas.height;
  
  // Desenhar imagem original
  ctx.drawImage(originalCanvas, 0, 0);
  
  // Aplicar máscara manual
  const originalData = ctx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
  const maskCtx = maskCanvas.getContext('2d');
  
  if (!maskCtx) throw new Error('Não foi possível obter contexto da máscara');
  
  const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  
  for (let i = 0; i < originalData.data.length; i += 4) {
    const maskIndex = i;
    const maskAlpha = maskData.data[maskIndex + 3];
    
    // Aplicar transparência baseada na máscara
    originalData.data[i + 3] = maskAlpha;
  }
  
  ctx.putImageData(originalData, 0, 0);
  return resultCanvas;
};

export const downloadCanvas = (canvas: HTMLCanvasElement, filename: string = 'image.png') => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
};