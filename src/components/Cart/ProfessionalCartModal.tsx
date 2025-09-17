import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  Coins, 
  CreditCard, 
  Truck,
  Tag,
  Gift
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useUTICoins } from '@/hooks/useUTICoins';
import { useAuth } from '@/hooks/useAuth';
import { CartItem } from '@/types/cart';

interface ProfessionalCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CartItemWithCalculations extends CartItem {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  coinsEarned: number;
  maxCoinsDiscount: number;
  appliedCoinsDiscount: number;
}

const ProfessionalCartModal: React.FC<ProfessionalCartModalProps> = ({
  isOpen,
  onClose
}) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    sendToWhatsApp 
  } = useCart();
  const { balance: coinsBalance } = useUTICoins();
  const { user } = useAuth();
  
  const [useCoins, setUseCoins] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Bloquear scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      setScrollPosition(window.pageYOffset);
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen, scrollPosition]);

  // Calcular itens do carrinho com descontos e UTI Coins
  const cartItemsWithCalculations: CartItemWithCalculations[] = useMemo(() => {
    return cart.map((item) => {
      const product = item.product;
      const originalPrice = product.price * item.quantity;
      
      // Desconto regular do produto (se houver)
      const regularDiscountPercentage = product.discount_percentage || 0;
      const regularDiscountAmount = originalPrice * (regularDiscountPercentage / 100);
      const discountedPrice = originalPrice - regularDiscountAmount;
      
      // UTI Coins - Cashback (1 coin = 1 centavo)
      const cashbackPercentage = product.uti_coins_cashback_percentage || 2;
      const roundedPrice = Math.ceil(discountedPrice); // Arredondar para cima
      const cashbackAmount = (roundedPrice * cashbackPercentage) / 100;
      const coinsEarned = Math.round(cashbackAmount * 100); // Converter para coins (1 real = 100 coins)
      
      // UTI Coins - Desconto máximo permitido
      const maxDiscountPercentage = product.uti_coins_discount_percentage || 0;
      const roundedDiscountedPrice = Math.ceil(discountedPrice); // Arredondar para cima
      const maxDiscountAmount = (roundedDiscountedPrice * maxDiscountPercentage) / 100;
      const maxCoinsDiscount = Math.floor(maxDiscountAmount * 100); // Converter para coins (1 coin = 1 centavo)
      
      // UTI Coins - Desconto aplicado (baseado no saldo do usuário)
      let appliedCoinsDiscount = 0;
      if (useCoins && maxCoinsDiscount > 0) {
        const availableCoins = coinsBalance || 0;
        const coinsToUse = Math.min(maxCoinsDiscount, availableCoins);
        appliedCoinsDiscount = coinsToUse / 100; // Converter coins para reais (1 coin = R$ 0.01)
      }

      return {
        ...item,
        originalPrice,
        discountedPrice,
        discountAmount: regularDiscountAmount,
        discountPercentage: regularDiscountPercentage,
        coinsEarned,
        maxCoinsDiscount,
        appliedCoinsDiscount
      };
    });
  }, [cart, useCoins, coinsBalance]);

  // Calcular totais
  const totals = useMemo(() => {
    const subtotal = cartItemsWithCalculations.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalRegularDiscount = cartItemsWithCalculations.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalCoinsDiscount = cartItemsWithCalculations.reduce((sum, item) => sum + item.appliedCoinsDiscount, 0);
    const totalCoinsEarned = cartItemsWithCalculations.reduce((sum, item) => sum + item.coinsEarned, 0);
    const totalCoinsNeeded = cartItemsWithCalculations.reduce((sum, item) => sum + (item.maxCoinsDiscount || 0), 0);
    
    const finalPrice = subtotal - totalRegularDiscount - totalCoinsDiscount;
    const shippingCost = finalPrice >= 150 ? 0 : 15; // Frete grátis acima de R$ 150
    const totalWithShipping = finalPrice + shippingCost;
    
    return {
      subtotal,
      totalRegularDiscount,
      totalCoinsDiscount,
      totalCoinsEarned,
      totalCoinsNeeded,
      finalPrice,
      shippingCost,
      totalWithShipping,
      itemsCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [cartItemsWithCalculations, cart]);

  const handleQuantityChange = useCallback((item: CartItem, change: number) => {
    const newQuantity = Math.max(0, item.quantity + change);
    updateQuantity(item.product.id, item.size, item.color, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeFromCart(itemId);
  }, [removeFromCart]);

  const handleCheckout = useCallback(async () => {
    // Importar função detalhada do WhatsApp
    const { sendToWhatsApp: sendToWhatsAppDetailed } = await import('@/utils/whatsapp');
    
    // Passar informações detalhadas dos totais e UTI Coins
    await sendToWhatsAppDetailed(
      cart, 
      '5527999771112', 
      (context) => console.log('📊 Tracking context:', context),
      undefined, // onLoadingStart
      totals, // totais calculados
      useCoins, // se está usando UTI Coins
      coinsBalance // saldo atual do usuário
    );
    
    onClose();
  }, [cart, totals, useCoins, coinsBalance, onClose]);

  if (cart.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Carrinho Vazio</DialogTitle>
            <DialogDescription>
              Adicione produtos para começar suas compras
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Carrinho Vazio</h3>
            <p className="text-muted-foreground mb-4">
              Adicione produtos para começar suas compras
            </p>
            <Button onClick={onClose} className="w-full">
              Continuar Comprando
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-4xl w-[calc(100vw-32px)] sm:w-auto max-h-[95vh] sm:max-h-[85vh] p-0 overflow-hidden rounded-xl">
        <DialogDescription className="sr-only">
          Carrinho de compras com {totals.itemsCount} {totals.itemsCount === 1 ? 'item' : 'itens'}
        </DialogDescription>
        <div className="flex flex-col h-full max-h-[95vh] sm:max-h-[85vh]">
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b bg-background rounded-t-xl">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 sm:gap-3">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <div>
                  <span className="text-base sm:text-lg font-semibold">Seu Carrinho</span>
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                    {totals.itemsCount} {totals.itemsCount === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </DialogTitle>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {cart.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => clearCart()}
                    className="text-muted-foreground hover:text-destructive text-xs sm:text-sm p-1 sm:p-2"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Limpar</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground p-1 sm:p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row flex-1 overflow-hidden min-h-0">
            {/* Lista de Produtos - Mobile: área scrollável limitada */}
            <div className="flex-1 flex flex-col min-h-0 sm:min-h-full relative">
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 max-h-[30vh] sm:max-h-full relative z-10">
                <div className="space-y-3 sm:space-y-4">
                  {cartItemsWithCalculations.map((item) => (
                    <div key={item.id} className="bg-card rounded-lg border p-3 sm:p-4 shadow-sm">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Imagem do Produto */}
                        <div className="relative flex-shrink-0">
                          <img 
                            src={item.product.additional_images?.[0] || item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                          />
                          {item.discountPercentage > 0 && (
                            <Badge className="absolute -top-1 -left-1 sm:-top-2 sm:-left-2 bg-destructive text-destructive-foreground text-xs px-1 py-0">
                              -{item.discountPercentage}%
                            </Badge>
                          )}
                        </div>

                        {/* Informações do Produto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <h4 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2">
                                {item.product.name}
                              </h4>
                              <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                {item.size && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {item.size}
                                  </Badge>
                                )}
                                {item.color && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {item.color}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1 h-auto flex-shrink-0"
                            >
                              <X className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>

                          {/* Preços */}
                          <div className="mb-2 sm:mb-3">
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              {item.discountAmount > 0 ? (
                                <>
                                  <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                    R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                                  </span>
                                  <span className="font-semibold text-sm sm:text-base text-primary">
                                    R$ {(item.discountedPrice - item.appliedCoinsDiscount).toFixed(2).replace('.', ',')}
                                  </span>
                                </>
                              ) : (
                                <span className="font-semibold text-sm sm:text-base">
                                  R$ {(item.originalPrice - item.appliedCoinsDiscount).toFixed(2).replace('.', ',')}
                                </span>
                              )}
                              {item.appliedCoinsDiscount > 0 && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  <Coins className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                                  -R$ {item.appliedCoinsDiscount.toFixed(2).replace('.', ',')}
                                </Badge>
                              )}
                            </div>
                            
                            {/* Parcelamento */}
                            <p className="text-xs text-muted-foreground mt-1">
                              ou 12x de R$ {((item.discountedPrice - item.appliedCoinsDiscount) / 12).toFixed(2).replace('.', ',')} sem juros
                            </p>
                            
                            {/* UTI Coins Info */}
                            {item.coinsEarned > 0 && !useCoins && (
                              <div className="flex items-center gap-1 mt-1">
                                <Coins className="w-3 h-3 text-yellow-600" />
                                <span className="text-xs text-yellow-700">
                                  Ganhe {item.coinsEarned.toLocaleString()} coins
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Controles de Quantidade */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item, -1)}
                                disabled={item.quantity <= 1}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-medium text-sm w-6 sm:w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item, 1)}
                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo do Pedido - Mobile: área scrollável separada */}
            <div className="w-full sm:w-80 border-t sm:border-t-0 sm:border-l bg-muted/20 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-h-[35vh] sm:max-h-full">
                <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resumo do Pedido</h3>
                
                 {/* UTI Coins Toggle */}
                {user && (
                  <div className="bg-card rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 border relative z-20">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-xs sm:text-sm">Usar UTI Coins</span>
                      </div>
                      <Switch
                        checked={useCoins}
                        onCheckedChange={setUseCoins}
                        disabled={!coinsBalance || totals.totalCoinsNeeded === 0}
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Saldo: {coinsBalance?.toLocaleString() || 0} coins</div>
                      {useCoins ? (
                        <>
                          {totals.totalCoinsNeeded > 0 && (
                            <div className="text-blue-600">
                              Você usará: {Math.min(totals.totalCoinsNeeded, coinsBalance || 0).toLocaleString()} coins
                            </div>
                          )}
                          {totals.totalCoinsDiscount > 0 && (
                            <div className="text-green-600">
                              Desconto aplicado: R$ {totals.totalCoinsDiscount.toFixed(2).replace('.', ',')}
                            </div>
                          )}
                        </>
                      ) : (
                        totals.totalCoinsEarned > 0 && (
                          <div className="text-yellow-700">
                            Você ganhará: {totals.totalCoinsEarned.toLocaleString()} coins
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Cálculos */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({totals.itemsCount} itens)</span>
                    <span>R$ {totals.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  {totals.totalRegularDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto</span>
                      <span>-R$ {totals.totalRegularDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  {totals.totalCoinsDiscount > 0 && (
                    <div className="flex justify-between text-yellow-700">
                      <span>Desconto UTI Coins</span>
                      <span>-R$ {totals.totalCoinsDiscount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Frete
                    </span>
                    <span className={totals.shippingCost === 0 ? "text-green-600" : ""}>
                      {totals.shippingCost === 0 ? "GRÁTIS" : `R$ ${totals.shippingCost.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  
                  {totals.shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Frete grátis a partir de R$ 150,00
                    </p>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-base sm:text-lg">
                    <span>Total</span>
                    <span className="text-primary">R$ {totals.totalWithShipping.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    ou 12x de R$ {(totals.totalWithShipping / 12).toFixed(2).replace('.', ',')} sem juros
                  </p>
                  
                  {!useCoins && totals.totalCoinsEarned > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 mt-3 sm:mt-4">
                      <div className="flex items-center gap-2 text-yellow-800">
                        <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-medium text-xs sm:text-sm">
                          Você ganhará {totals.totalCoinsEarned.toLocaleString()} UTI Coins
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        = R$ {(totals.totalCoinsEarned * 0.01).toFixed(2).replace('.', ',')} para próximas compras
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação - Fixos no bottom */}
              <div className="sticky bottom-0 p-3 sm:p-6 border-t bg-background rounded-b-xl">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 mb-3 text-sm sm:text-base rounded-lg"
                  size="lg"
                >
                  Finalizar no WhatsApp
                </Button>
                
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full text-sm sm:text-base rounded-lg"
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalCartModal;