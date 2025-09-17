
import { supabase } from '@/integrations/supabase/client';
import { sendOrderCreatedEmail } from './orderEmailService';

export const generateOrderVerificationCode = async (cartItems: any[], total: number) => {
  console.log('🔐 generateOrderVerificationCode called with items:', cartItems.length, 'total:', total);
  
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
    console.log('📦 Items prepared:', items);

    // Preparar dados do cliente
    const customerInfo = {
      timestamp: new Date().toISOString(),
      browser: navigator.userAgent
    };
    console.log('👤 Customer info prepared:', customerInfo);

    // Obter dados do usuário se logado
    console.log('🔍 Getting user data...');
    const { data: { user } } = await supabase.auth.getUser();
    console.log('👤 User:', user?.id || 'not logged in');

    // Chamar função do Supabase
    console.log('📞 Calling supabase RPC create_order_verification_code...');
    const { data, error } = await supabase.rpc('create_order_verification_code', {
      p_user_id: user?.id || null,
      p_items: items,
      p_total_amount: total,
      p_customer_info: customerInfo,
      p_browser_info: { userAgent: navigator.userAgent }
    });

    if (error) {
      console.error('❌ Supabase RPC error:', error);
      throw error;
    }
    console.log('✅ Supabase RPC response:', data);

    const result = data as any;
    if (result?.success) {
      console.log('✅ Code generated successfully:', result.code);
      return result.code;
    } else {
      console.error('❌ RPC returned error:', result?.message);
      throw new Error(result?.message || 'Erro ao gerar código');
    }
  } catch (err) {
    console.error('❌ Error in generateOrderVerificationCode:', err);
    return null;
  }
};

// Função para detectar se é mobile
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Função para detectar se é iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Função robusta para redirecionamento WhatsApp
const openWhatsApp = (url: string, onLoadingStart?: () => void) => {
  const mobile = isMobile();
  const ios = isIOS();
  
  console.log('Abrindo WhatsApp:', { mobile, ios, url });
  
  // Ativar loading se callback fornecido
  if (onLoadingStart) {
    onLoadingStart();
  }
  
  if (mobile) {
    // Em mobile, usar window.location.href é mais confiável
    try {
      // Tentar abrir diretamente
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao abrir WhatsApp via location.href:', error);
      // Fallback: tentar window.open
      try {
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          // Se window.open falhou, mostrar link para o usuário
          showWhatsAppFallback(url);
        }
      } catch (error2) {
        console.error('Erro ao abrir WhatsApp via window.open:', error2);
        // Fallback simples sem popup
        window.location.href = url;
      }
    }
  } else {
    // Em desktop, tentar window.open primeiro
    try {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Verificar se o popup foi bloqueado
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.warn('Popup bloqueado, usando fallback');
        showWhatsAppFallback(url);
      } else {
        // Verificar se a janela ainda está aberta após um tempo
        setTimeout(() => {
          try {
            if (newWindow.closed) {
              console.log('Janela foi fechada pelo usuário');
            }
          } catch (e) {
            // Ignorar erros de cross-origin
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao abrir WhatsApp via window.open:', error);
      showWhatsAppFallback(url);
    }
  }
};

// Função para mostrar fallback profissional quando o redirecionamento automático falha
const showWhatsAppFallback = (url: string) => {
  // Criar overlay escuro
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    backdrop-filter: blur(2px);
  `;
  
  // Criar modal profissional
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid #e0e0e0;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    text-align: center;
    max-width: 420px;
    width: 90%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: modalSlideIn 0.3s ease-out;
  `;
  
  // Adicionar animação CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
  `;
  document.head.appendChild(style);
  
  modal.innerHTML = `
    <div style="margin-bottom: 24px;">
      <div style="
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        border-radius: 50%;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
      ">
        🎮
      </div>
      <h3 style="
        color: #1f2937;
        font-size: 20px;
        font-weight: 600;
        margin: 0 0 8px 0;
        line-height: 1.3;
      ">Não foi redirecionado?</h3>
      <p style="
        color: #6b7280;
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
      ">Clique no botão abaixo para finalizar seu pedido no WhatsApp</p>
    </div>
    
    <div style="margin-bottom: 24px;">
      <a href="${url}" target="_blank" style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 16px;
        transition: all 0.2s ease;
        box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
        border: none;
        cursor: pointer;
        width: 100%;
        max-width: 280px;
      " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 38, 38, 0.4)'" 
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 16px rgba(220, 38, 38, 0.3)'">
        <span style="font-size: 20px;">💬</span>
        Abrir WhatsApp
      </a>
    </div>
    
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 16px;
      padding: 12px;
      background: #f3f4f6;
      border-radius: 8px;
      font-size: 12px;
      color: #6b7280;
    ">
      <span style="color: #dc2626;">🔒</span>
      <span>Conexão segura • UTI dos Games</span>
    </div>
    
    <button onclick="this.closest('.whatsapp-fallback-overlay').remove()" style="
      background: transparent;
      border: 1px solid #d1d5db;
      color: #6b7280;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='transparent'">
      Fechar
    </button>
  `;
  
  // Adicionar classes para identificação
  overlay.className = 'whatsapp-fallback-overlay';
  modal.className = 'whatsapp-fallback-modal';
  
  // Adicionar ao DOM
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Fechar ao clicar no overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  // Remover automaticamente após 15 segundos
  setTimeout(() => {
    if (overlay.parentElement) {
      overlay.remove();
    }
  }, 15000);
  
  // Cleanup do style quando remover
  overlay.addEventListener('remove', () => {
    if (style.parentElement) {
      style.remove();
    }
  });
};

export const sendToWhatsApp = async (cartItems: any[], phoneNumber: string = '5527999771112', trackWhatsAppClick?: (context?: string) => void, onLoadingStart?: () => void, cartTotals?: any, utiCoinsUsed?: boolean, userCoinsBalance?: number) => {
  console.log('📦 sendToWhatsApp utils called with:', cartItems.length, 'items');
  
  // Calcular informações dos produtos com detalhes de preços e UTI Coins
  const itemsDetails = cartItems.map(item => {
    const originalPrice = item.product.price * item.quantity;
    const discountPercentage = item.product.discount_percentage || 0;
    const regularDiscount = originalPrice * (discountPercentage / 100);
    const discountedPrice = originalPrice - regularDiscount;
    
    // UTI Coins - Cashback
    const cashbackPercentage = item.product.uti_coins_cashback_percentage || 2;
    const coinsEarned = Math.round((Math.ceil(discountedPrice) * cashbackPercentage) / 100 * 100);
    
    // UTI Coins - Desconto aplicado
    const maxDiscountPercentage = item.product.uti_coins_discount_percentage || 0;
    const maxCoinsDiscount = Math.floor((Math.ceil(discountedPrice) * maxDiscountPercentage) / 100 * 100);
    let appliedCoinsDiscount = 0;
    
    if (utiCoinsUsed && maxCoinsDiscount > 0 && userCoinsBalance) {
      const coinsToUse = Math.min(maxCoinsDiscount, userCoinsBalance);
      appliedCoinsDiscount = coinsToUse / 100;
    }
    
    const finalPrice = discountedPrice - appliedCoinsDiscount;
    
    let itemText = `📦 *${item.product.name}*`;
    if (item.size) itemText += ` - Tamanho: ${item.size}`;
    if (item.color) itemText += ` - Cor: ${item.color}`;
    itemText += `\n   📊 Quantidade: ${item.quantity}`;
    
    if (discountPercentage > 0) {
      itemText += `\n   💰 Preço original: R$ ${originalPrice.toFixed(2).replace('.', ',')}`;
      itemText += `\n   🏷️ Desconto (${discountPercentage}%): -R$ ${regularDiscount.toFixed(2).replace('.', ',')}`;
    }
    
    if (appliedCoinsDiscount > 0) {
      itemText += `\n   🪙 Desconto UTI Coins: -R$ ${appliedCoinsDiscount.toFixed(2).replace('.', ',')}`;
    }
    
    itemText += `\n   💵 *Valor final: R$ ${finalPrice.toFixed(2).replace('.', ',')}*`;
    
    if (!utiCoinsUsed && coinsEarned > 0) {
      itemText += `\n   ✨ Você ganhará: ${coinsEarned.toLocaleString()} UTI Coins`;
    }
    
    return {
      text: itemText,
      finalPrice,
      coinsEarned: utiCoinsUsed ? 0 : coinsEarned,
      appliedCoinsDiscount
    };
  });
  
  const itemsList = itemsDetails.map(item => item.text).join('\n\n');
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalRegularDiscount = itemsDetails.reduce((sum, item) => sum + ((item.finalPrice + item.appliedCoinsDiscount) - item.finalPrice), 0);
  const totalCoinsDiscount = itemsDetails.reduce((sum, item) => sum + item.appliedCoinsDiscount, 0);
  const finalTotal = itemsDetails.reduce((sum, item) => sum + item.finalPrice, 0);
  const totalCoinsEarned = itemsDetails.reduce((sum, item) => sum + item.coinsEarned, 0);
  
  // Frete
  const shippingCost = finalTotal >= 150 ? 0 : 15;
  const totalWithShipping = finalTotal + shippingCost;
  
  console.log('💰 Total calculated:', totalWithShipping);
  
  // Gerar código de verificação do pedido
  console.log('🔐 Generating order code...');
  const orderCode = await generateOrderVerificationCode(cartItems, totalWithShipping);
  
  if (!orderCode) {
    console.error('❌ Failed to generate order code');
    return null;
  }
  console.log('✅ Order code generated:', orderCode);

  // Enviar email de confirmação se o usuário estiver logado
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      console.log('📧 Sending email to:', user.email);
      await sendOrderCreatedEmail(
        user.email,
        user.user_metadata?.name || 'Cliente',
        orderCode
      );
    }
  } catch (err) {
    console.warn('📧 Email sending failed:', err);
  }
  
  // Montar mensagem detalhada
  let message = `🎮 *PEDIDO UTI DOS GAMES* 🎮\n\n`;
  message += `═════════════════════════\n`;
  message += `📋 *PRODUTOS*\n`;
  message += `═════════════════════════\n\n`;
  message += itemsList;
  
  message += `\n\n═════════════════════════\n`;
  message += `💰 *RESUMO FINANCEIRO*\n`;
  message += `═════════════════════════\n`;
  message += `💵 Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
  
  if (totalRegularDiscount > 0) {
    message += `🏷️ Desconto produtos: -R$ ${totalRegularDiscount.toFixed(2).replace('.', ',')}\n`;
  }
  
  if (totalCoinsDiscount > 0) {
    message += `🪙 Desconto UTI Coins: -R$ ${totalCoinsDiscount.toFixed(2).replace('.', ',')}\n`;
  }
  
  message += `🚚 Frete: ${shippingCost === 0 ? 'GRÁTIS' : 'R$ ' + shippingCost.toFixed(2).replace('.', ',')}\n`;
  message += `💸 *TOTAL FINAL: R$ ${totalWithShipping.toFixed(2).replace('.', ',')}*\n`;
  
  // Informações UTI Coins
  if (utiCoinsUsed || totalCoinsEarned > 0) {
    message += `\n═════════════════════════\n`;
    message += `🪙 *UTI COINS*\n`;
    message += `═════════════════════════\n`;
    
    if (userCoinsBalance !== undefined) {
      message += `💰 Seu saldo atual: ${userCoinsBalance.toLocaleString()} coins\n`;
    }
    
    if (utiCoinsUsed && totalCoinsDiscount > 0) {
      const coinsUsed = totalCoinsDiscount * 100;
      message += `🎯 Coins utilizados: ${coinsUsed.toLocaleString()} coins\n`;
      message += `💲 Desconto aplicado: R$ ${totalCoinsDiscount.toFixed(2).replace('.', ',')}\n`;
      if (userCoinsBalance !== undefined) {
        const remainingBalance = userCoinsBalance - coinsUsed;
        message += `🔄 Saldo restante: ${remainingBalance.toLocaleString()} coins\n`;
      }
    }
    
    if (!utiCoinsUsed && totalCoinsEarned > 0) {
      message += `✨ Coins que você ganhará: ${totalCoinsEarned.toLocaleString()} coins\n`;
      message += `💰 Equivale a: R$ ${(totalCoinsEarned * 0.01).toFixed(2).replace('.', ',')} em futuras compras\n`;
    }
  }
  
  message += `\n═════════════════════════\n`;
  message += `🔐 *CÓDIGO DE VERIFICAÇÃO*\n`;
  message += `═════════════════════════\n`;
  message += `${orderCode}\n\n`;
  message += `📋 *Copie o código acima*\n\n`;
  message += `Aguardo confirmação! 🎮`;
  
  // Track WhatsApp click if tracking function is provided
  if (trackWhatsAppClick) {
    console.log('📊 Tracking WhatsApp click');
    trackWhatsAppClick('cart_checkout');
  }

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  console.log('🚀 Opening WhatsApp with URL length:', whatsappUrl.length);
  
  // Usar função robusta para abrir WhatsApp com loading
  openWhatsApp(whatsappUrl, onLoadingStart);
  
  console.log('✅ WhatsApp process completed, returning code:', orderCode);
  return orderCode;
};

// Função para gerar código de um único produto
export const generateSingleProductCode = async (product: any, quantity: number = 1, additionalInfo?: any) => {
  console.log('🔑 [MOBILE DEBUG] generateSingleProductCode called:', {
    productName: product.name,
    quantity: quantity,
    additionalInfo: additionalInfo
  });
  
  const cartItems = [{
    product: product,
    quantity: quantity,
    size: additionalInfo?.size,
    color: additionalInfo?.color,
    // Incluir informações de UTI Coins se disponíveis
    useCoins: additionalInfo?.useCoins || false,
    coinsDiscount: additionalInfo?.coinsDiscount || 0,
    coinsEarned: additionalInfo?.coinsEarned || 0,
    finalPrice: additionalInfo?.finalPrice || (product.price * quantity)
  }];
  
  // Usar o preço final (com desconto de coins se aplicável)
  const total = additionalInfo?.finalPrice || (product.price * quantity);
  console.log('📊 [MOBILE DEBUG] Cart items prepared:', cartItems);
  console.log('💰 [MOBILE DEBUG] Total calculated:', total);
  
  return await generateOrderVerificationCode(cartItems, total);
};

// Função para compra direta com código de verificação
export const sendSingleProductToWhatsApp = async (product: any, quantity: number = 1, additionalInfo?: any, trackWhatsAppClick?: (context?: string) => void, onLoadingStart?: () => void) => {
  console.log('🛍️ [MOBILE DEBUG] sendSingleProductToWhatsApp called:', {
    productName: product.name,
    quantity: quantity,
    additionalInfo: additionalInfo,
    isMobile: isMobile(),
    isIOS: isIOS()
  });
  
  const total = product.price * quantity;
  
  // Gerar código de verificação
  console.log('🔐 [MOBILE DEBUG] Generating single product code...');
  const orderCode = await generateSingleProductCode(product, quantity, additionalInfo);
  
  if (!orderCode) {
    console.error('❌ [MOBILE DEBUG] Failed to generate order code for single product');
    return false;
  }
  console.log('✅ [MOBILE DEBUG] Single product code generated:', orderCode);

  // Enviar email de confirmação se o usuário estiver logado
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      console.log('📧 Sending single product email to:', user.email);
      await sendOrderCreatedEmail(
        user.email,
        user.user_metadata?.name || 'Cliente',
        orderCode
      );
    }
  } catch (err) {
    console.warn('📧 Single product email failed:', err);
  }
  
  // Calcular informações detalhadas do produto
  const originalPrice = product.price * quantity;
  const discountPercentage = product.discount_percentage || 0;
  const regularDiscount = originalPrice * (discountPercentage / 100);
  let discountedPrice = originalPrice - regularDiscount;
  
  // UTI Coins - usar informações do modal se disponíveis
  let coinsEarned, coinsDiscount = 0, finalPrice;
  
  if (additionalInfo?.finalPrice !== undefined) {
    // Usar cálculos do modal
    finalPrice = additionalInfo.finalPrice;
    coinsDiscount = additionalInfo.coinsDiscount || 0;
    coinsEarned = additionalInfo.coinsEarned || 0;
    discountedPrice = additionalInfo.originalSubtotal || discountedPrice;
  } else {
    // Fallback para cálculos antigos
    const cashbackPercentage = product.uti_coins_cashback_percentage || 2;
    coinsEarned = Math.round((Math.ceil(discountedPrice) * cashbackPercentage) / 100 * 100);
    finalPrice = discountedPrice;
  }
  
  // Frete baseado no preço final (com desconto de coins se aplicável)
  const shippingCost = finalPrice >= 150 ? 0 : 15;
  const totalWithShipping = finalPrice + shippingCost;
  
  let message = `🎮 *COMPRA UTI DOS GAMES* 🎮\n\n`;
  message += `═════════════════════════\n`;
  message += `📦 *PRODUTO*\n`;
  message += `═════════════════════════\n`;
  message += `🎮 *${product.name}*\n`;
  message += `📊 Quantidade: ${quantity}\n\n`;
  
  if (additionalInfo?.size) {
    message += `📏 Tamanho: ${additionalInfo.size}\n`;
  }
  if (additionalInfo?.color) {
    message += `🎨 Cor: ${additionalInfo.color}\n`;
  }
  
  message += `═════════════════════════\n`;
  message += `💰 *VALORES*\n`;
  message += `═════════════════════════\n`;
  
  if (discountPercentage > 0) {
    message += `💰 Preço original: R$ ${originalPrice.toFixed(2).replace('.', ',')}\n`;
    message += `🏷️ Desconto (${discountPercentage}%): -R$ ${regularDiscount.toFixed(2).replace('.', ',')}\n`;
    message += `💵 Preço com desconto: R$ ${discountedPrice.toFixed(2).replace('.', ',')}\n`;
  } else {
    message += `💰 Preço: R$ ${originalPrice.toFixed(2).replace('.', ',')}\n`;
  }
  
  // Mostrar desconto de UTI Coins se aplicado
  if (coinsDiscount > 0) {
    message += `🪙 Desconto UTI Coins: -R$ ${coinsDiscount.toFixed(2).replace('.', ',')}\n`;
  }
  
  message += `🚚 Frete: ${shippingCost === 0 ? 'GRÁTIS' : 'R$ ' + shippingCost.toFixed(2).replace('.', ',')}\n`;
  message += `💸 *TOTAL: R$ ${totalWithShipping.toFixed(2).replace('.', ',')}*\n`;
  
  // UTI Coins info
  if (coinsEarned > 0 || coinsDiscount > 0 || (additionalInfo?.useCoins !== undefined)) {
    message += `\n═════════════════════════\n`;
    message += `🪙 *UTI COINS*\n`;
    message += `═════════════════════════\n`;
    
    if (additionalInfo?.useCoins) {
      // Cliente escolheu usar coins
      const coinsUsed = additionalInfo.coinsToUse || 0;
      if (coinsUsed > 0) {
        message += `🪙 Coins utilizados: ${coinsUsed.toLocaleString()}\n`;
        message += `💰 Desconto aplicado: R$ ${coinsDiscount.toFixed(2).replace('.', ',')}\n`;
        message += `💳 Saldo restante: ${(additionalInfo.coinsBalance - coinsUsed).toLocaleString()} coins\n`;
      }
    } else {
      // Cliente não usou coins, mostrar cashback
      if (coinsEarned > 0) {
        message += `✨ Você ganhará: ${coinsEarned.toLocaleString()} coins\n`;
        message += `💰 Equivale a: R$ ${(coinsEarned / 100).toFixed(2).replace('.', ',')} em futuras compras\n`;
      }
    }
    
    if (additionalInfo?.coinsBalance !== undefined) {
      message += `💼 Saldo atual: ${additionalInfo.coinsBalance.toLocaleString()} coins\n`;
    }
  }
  
  message += `\n═════════════════════════\n`;
  message += `🔐 *CÓDIGO DE VERIFICAÇÃO*\n`;
  message += `═════════════════════════\n`;
  message += `${orderCode}\n\n`;
  message += `📋 *Copie o código acima*\n\n`;
  message += `Aguardo confirmação! 🎮`;
  
  // Track WhatsApp click if tracking function is provided
  if (trackWhatsAppClick) {
    console.log('📊 Tracking single product WhatsApp click');
    trackWhatsAppClick('single_product_purchase');
  }

  const whatsappUrl = `https://wa.me/5527999771112?text=${encodeURIComponent(message)}`;
  
  // Usar função robusta para abrir WhatsApp com loading
  openWhatsApp(whatsappUrl, onLoadingStart);
  
  console.log('✅ [MOBILE DEBUG] Single product WhatsApp process completed');
  return orderCode;
};

// Função simples para redirecionamento direto (para casos específicos - SEM código)
// NUNCA usa window.open() - funciona como link normal
export const openWhatsAppDirect = (phoneNumber: string, message: string) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  // Usar apenas location.href - funciona como clicar em um link
  // Nunca causa popup bloqueado
  window.location.href = whatsappUrl;
};

export const formatWhatsAppMessage = (cartItems: any[]) => {
  const itemsList = cartItems.map(item => 
    `• ${item.product.name} (${item.size}${item.color ? `, ${item.color}` : ''}) - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
  ).join('\n');
  
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  return `Olá! Gostaria de pedir os seguintes itens da UTI DOS GAMES:\n\n${itemsList}\n\n*Total: R$ ${total.toFixed(2)}*\n\nAguardo retorno! 🎮`;
};
