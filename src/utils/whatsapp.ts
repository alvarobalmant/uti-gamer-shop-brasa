
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sendOrderCreatedEmail } from './orderEmailService';

export const generateOrderVerificationCode = async (cartItems: any[], total: number) => {
  try {
    // Preparar dados dos itens
    const items = cartItems.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
      total: item.product.price * item.quantity
    }));

    // Preparar dados do cliente
    const customerInfo = {
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent
    };

    // Obter dados do usuário se logado
    const { data: { user } } = await supabase.auth.getUser();

    // Chamar função do Supabase
    const { data, error } = await supabase.rpc('create_order_verification_code', {
      p_user_id: user?.id || null,
      p_items: items,
      p_total_amount: total,
      p_customer_info: customerInfo,
      p_browser_info: { userAgent: navigator.userAgent }
    });

    if (error) throw error;

    const result = data as any;
    if (result?.success) {
      return result.code;
    } else {
      throw new Error(result?.message || 'Erro ao gerar código');
    }
  } catch (err) {
    console.error('Erro ao gerar código de verificação:', err);
    return null;
  }
};

export const sendToWhatsApp = async (cartItems: any[], phoneNumber: string = '5527996882090') => {
  return new Promise<string | null>((resolve) => {
    const processOrder = async () => {
      const itemsList = cartItems.map(item => 
        `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
      ).join('\n');
      
      const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      // Gerar código de verificação do pedido
      const orderCode = await generateOrderVerificationCode(cartItems, total);
      
      if (!orderCode) {
        console.error('Erro ao gerar código de verificação');
        resolve(null);
        return;
      }

      // Enviar email de confirmação se o usuário estiver logado
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          await sendOrderCreatedEmail(
            user.email,
            user.user_metadata?.name || 'Cliente',
            orderCode
          );
        }
      } catch (err) {
        console.warn('Não foi possível enviar email de confirmação:', err);
      }

      // Função para abrir WhatsApp
      const openWhatsApp = () => {
        const message = `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\n🔐 *Código de Verificação:*\n${orderCode}\n\n📋 *Copie o código:*\n${orderCode}\n\nAguardo retorno! 🎮`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        resolve(orderCode);
      };

      // Importar e mostrar dialog
      import('@/components/dialogs/VerificationCodeDialog').then(({ VerificationCodeDialog }) => {
        import('react-dom').then(ReactDOM => {
          // Criar container para o modal
          const modalContainer = document.createElement('div');
          document.body.appendChild(modalContainer);

          const handleClose = () => {
            ReactDOM.unmountComponentAtNode(modalContainer);
            document.body.removeChild(modalContainer);
            resolve(orderCode);
          };

          const handleContinue = () => {
            openWhatsApp();
            handleClose();
          };

          // Renderizar modal
          ReactDOM.render(
            React.createElement(VerificationCodeDialog, {
              isOpen: true,
              onClose: handleClose,
              verificationCode: orderCode,
              onContinueToWhatsApp: handleContinue
            }),
            modalContainer
          );
        });
      });
    };

    processOrder();
  });
};

export const formatWhatsAppMessage = (cartItems: any[]) => {
  const itemsList = cartItems.map(item => 
    `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\nAguardo retorno! 🎮`;
};
