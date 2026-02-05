// Stub: product_faqs table removed - returning mock data

export interface ProductFAQ {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  helpful_count: number;
  active: boolean;
  order_index: number;
  created_at: string;
}

export interface FAQCategory {
  category: string;
  faqs: ProductFAQ[];
}

const getMockFAQs = (productId: string): ProductFAQ[] => [
  {
    id: '1',
    product_id: productId,
    question: 'O jogo vem lacrado e original?',
    answer: 'Sim! Todos os nossos jogos são 100% originais e lacrados de fábrica.',
    category: 'Geral',
    tags: [],
    helpful_count: 0,
    active: true,
    order_index: 0,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    product_id: productId,
    question: 'Qual o prazo de entrega?',
    answer: 'O prazo de entrega varia de 2 a 5 dias úteis.',
    category: 'Entrega',
    tags: [],
    helpful_count: 0,
    active: true,
    order_index: 1,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    product_id: productId,
    question: 'Como funciona a garantia?',
    answer: 'Oferecemos garantia de 30 dias contra defeitos de fabricação.',
    category: 'Garantia',
    tags: [],
    helpful_count: 0,
    active: true,
    order_index: 2,
    created_at: new Date().toISOString()
  }
];

export const useProductFAQs = (productId: string) => {
  const faqs = getMockFAQs(productId);
  const categorizedFaqs: FAQCategory[] = [{ category: 'Geral', faqs }];

  return {
    faqs,
    categorizedFaqs,
    loading: false,
    addFAQ: async () => ({ success: false, error: 'CRUD desativado - gestão via ERP' }),
    updateFAQ: async () => ({ success: false, error: 'CRUD desativado - gestão via ERP' }),
    deleteFAQ: async () => ({ success: false, error: 'CRUD desativado - gestão via ERP' }),
    incrementHelpfulCount: async () => ({ success: false, error: 'CRUD desativado - gestão via ERP' }),
    refreshFAQs: async () => {}
  };
};