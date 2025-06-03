export const sendToWhatsApp = (cartItems: any[], phoneNumber: string = '5527996882090') => {
  const itemsList = cartItems.map(item => 
    `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\nAguardo retorno! 🎮`;
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};

export const formatWhatsAppMessage = (cartItems: any[]) => {
  const itemsList = cartItems.map(item => 
    `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\nAguardo retorno! 🎮`;
};

// Nova função para abrir WhatsApp com mensagem personalizada
export const openWhatsApp = ({ 
  phone = '5527996882090', 
  message = 'Olá! Gostaria de falar com a UTI DOS GAMES.'
}: {
  phone?: string;
  message?: string;
}) => {
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};
