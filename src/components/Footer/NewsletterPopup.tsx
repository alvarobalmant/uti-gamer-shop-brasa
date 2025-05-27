
import React, { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Marca que o usuário já viu/usou o popup
    localStorage.setItem('utidosgames_newsletter_popup_seen', 'true');
    
    // Auto close after success
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setEmail('');
    }, 2000);
  };

  const handleClose = () => {
    onClose();
    // Marca que o usuário já viu o popup (mesmo sem se cadastrar)
    localStorage.setItem('utidosgames_newsletter_popup_seen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <Gift className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-2">Oferta Especial!</h3>
            <p className="text-red-100">
              Cadastre-se e ganhe 10% de desconto na primeira compra
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Newsletter UTI DOS GAMES
                </h4>
                <p className="text-gray-600 text-sm">
                  Receba ofertas exclusivas, lançamentos e novidades em primeira mão!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Digite seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Cadastrando...
                    </div>
                  ) : (
                    'Quero meu desconto!'
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Ao se cadastrar, você concorda com nossa política de privacidade.
              </p>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Cadastro realizado com sucesso!
              </h4>
              <p className="text-gray-600">
                Verifique seu e-mail para receber o cupom de desconto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
