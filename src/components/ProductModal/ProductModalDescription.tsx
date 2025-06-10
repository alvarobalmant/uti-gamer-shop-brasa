import React from 'react';
import { Product } from '@/hooks/useProducts';

interface ProductModalDescriptionProps {
  product: Product;
}

const ProductModalDescription: React.FC<ProductModalDescriptionProps> = ({ product }) => {
  // Generate a rich description if the product doesn't have one
  const getProductDescription = () => {
    if (product.description && product.description.trim().length > 50) {
      return product.description;
    }

    // Generate description based on product name and tags
    const productName = product.name.toLowerCase();
    let description = '';

    if (productName.includes('controller') || productName.includes('controle')) {
      description = `Leve sua experiência de gaming para o próximo nível com o ${product.name}. 
      Desfrute de precisão aprimorada com controles de movimento intuitivos que dão vida aos seus jogos. 
      A funcionalidade integrada permite uma integração perfeita com seus personagens favoritos, 
      enquanto o botão de captura permite compartilhar seus momentos épicos sem esforço. 
      Com botões programáveis, você pode personalizar sua jogabilidade para se adequar ao seu estilo.`;
    } else if (productName.includes('headset') || productName.includes('fone')) {
      description = `Mergulhe completamente no mundo dos games com o ${product.name}. 
      Experimente áudio de alta qualidade com som surround que coloca você no centro da ação. 
      O design confortável permite longas sessões de jogo, enquanto o microfone de alta qualidade 
      garante comunicação cristalina com sua equipe. Compatível com múltiplas plataformas.`;
    } else if (productName.includes('console')) {
      description = `Descubra uma nova geração de gaming com o ${product.name}. 
      Gráficos impressionantes, carregamento ultrarrápido e uma biblioteca vasta de jogos 
      aguardam por você. Com retrocompatibilidade e recursos de streaming integrados, 
      este console oferece entretenimento ilimitado para toda a família.`;
    } else {
      description = `O ${product.name} representa o que há de melhor em tecnologia gaming. 
      Desenvolvido com materiais premium e tecnologia de ponta, oferece desempenho excepcional 
      e durabilidade incomparável. Ideal para gamers que exigem o máximo de qualidade e performance.`;
    }

    return description;
  };

  const description = getProductDescription();

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Descrição do Produto</h3>
      <div className="text-gray-700 leading-relaxed">
        <p>{description}</p>
      </div>
      
      {/* Additional product info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-medium text-gray-900">Informações Adicionais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>• Produto original e lacrado</div>
          <div>• Garantia de 90 dias</div>
          <div>• Suporte técnico especializado</div>
          <div>• Entrega rápida e segura</div>
        </div>
      </div>
    </div>
  );
};

export default ProductModalDescription;

