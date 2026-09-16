import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

const formatPrice = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();

  const total = getCartTotal();
  const hasItems = cart.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <ShoppingCart className="w-6 h-6 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Seu Carrinho</h1>
        </div>

        {!hasItems ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">Adicione produtos para continuar sua compra.</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Continuar comprando
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4"
                >
                  <img
                    src={item.product.image || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-contain rounded-md bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label={`Remover ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-red-600 font-bold mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                          }
                          disabled={
                            typeof item.product.stock === 'number' &&
                            item.quantity >= item.product.stock
                          }
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-40"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continuar comprando
              </Button>
            </div>

            {/* Resumo */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 lg:sticky lg:top-4">
              <h2 className="font-semibold text-gray-900">Resumo do pedido</h2>
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                  {cart.reduce((acc, item) => acc + item.quantity, 0) === 1 ? 'item' : 'itens'})
                </span>
                <span className="font-medium text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Truck className="w-4 h-4" />
                <span>{total >= 150 ? 'Frete grátis' : 'Frete calculado no checkout'}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-red-600">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-12 rounded-lg shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                Finalizar compra
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
