
import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';

const FloatingElements = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openWhatsApp = () => {
    const message = "Olá! Vim do site da UTI DOS GAMES e gostaria de mais informações.";
    const phoneNumber = "5527996882090";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openWhatsApp}
          className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-bounce"
          aria-label="Falar no WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Fale conosco no WhatsApp
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="fixed bottom-24 right-6 z-40">
          <button
            onClick={scrollToTop}
            className="group bg-gray-800 hover:bg-red-600 text-white p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 opacity-80 hover:opacity-100"
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-3 hidden group-hover:block">
              <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                Voltar ao topo
                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingElements;
