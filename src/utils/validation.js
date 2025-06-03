// Validação de entrada com Zod
import { z } from 'zod';
import { sanitizeHtml } from '@/utils/sanitize';

// Esquema para validação de usuário
export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
    .regex(/[^A-Za-z0-9]/, 'A senha deve conter pelo menos um caractere especial'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone deve estar no formato (99) 99999-9999').optional(),
});

// Esquema para validação de produto
export const productSchema = z.object({
  name: z.string().min(3, 'Nome do produto deve ter pelo menos 3 caracteres').max(100, 'Nome do produto muito longo'),
  description: z.string().max(2000, 'Descrição muito longa').transform(sanitizeHtml),
  price: z.number().positive('Preço deve ser positivo'),
  stock: z.number().int('Estoque deve ser um número inteiro').nonnegative('Estoque não pode ser negativo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  images: z.array(z.string().url('URL de imagem inválida')).min(1, 'Pelo menos uma imagem é necessária'),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  discount: z.number().min(0, 'Desconto não pode ser negativo').max(100, 'Desconto não pode exceder 100%').optional(),
});

// Esquema para validação de código UTI PRO
export const proCodeSchema = z.object({
  code: z.string().regex(/^UTI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/, 'Código UTI PRO inválido'),
  duration_months: z.number().int().positive('Duração deve ser um número positivo'),
  expires_at: z.string().datetime().optional(),
  is_active: z.boolean().default(true),
});

// Esquema para validação de endereço
export const addressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipcode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP deve estar no formato 99999-999'),
});

// Esquema para validação de cartão de crédito
export const creditCardSchema = z.object({
  number: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Número de cartão inválido'),
  name: z.string().min(3, 'Nome no cartão deve ter pelo menos 3 caracteres'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Data de expiração deve estar no formato MM/AA'),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
});

// Middleware para validação de requisições
export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Validar corpo da requisição
      const validatedData = schema.parse(req.body);
      
      // Substituir dados originais pelos validados
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error.errors) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      
      return res.status(400).json({ error: 'Invalid input data' });
    }
  };
};

// Função para validar e sanitizar entrada de texto
export const validateAndSanitizeText = (text, maxLength = 1000) => {
  if (!text) return '';
  
  // Truncar texto se exceder o tamanho máximo
  const truncated = text.length > maxLength ? text.substring(0, maxLength) : text;
  
  // Sanitizar HTML para prevenir XSS
  return sanitizeHtml(truncated);
};
