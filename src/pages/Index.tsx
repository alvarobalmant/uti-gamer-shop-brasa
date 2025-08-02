
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { items: cartItems = [] } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header simples */}
      <Header />

      {/* Conteúdo principal */}
      <main className="relative pt-20">
        {/* Hero Section */}
        <section className="py-20 text-center text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-6">UTI dos Games</h1>
            <p className="text-xl mb-8 opacity-90">
              A loja de games mais tradicional de Colatina
            </p>
            <div className="text-lg text-gray-300">
              Mais de 10 anos oferecendo os melhores produtos em games
            </div>
          </div>
        </section>

        {/* Seção de categorias */}
        <section className="py-16 bg-gray-800/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Nossas Categorias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: 'PlayStation', icon: '🎮' },
                { name: 'Xbox', icon: '🎯' },
                { name: 'Nintendo', icon: '🍄' },
                { name: 'PC Gaming', icon: '💻' },
                { name: 'Acessórios', icon: '🎧' },
                { name: 'Ofertas', icon: '🏷️' },
              ].map((category) => (
                <div
                  key={category.name}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-white font-medium">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de informações */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Por que escolher a UTI dos Games?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-semibold">Tradição</h3>
                <p className="text-gray-300">
                  Mais de 10 anos no mercado atendendo Colatina e região
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold">Agilidade</h3>
                <p className="text-gray-300">
                  Entrega rápida e atendimento especializado
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold">Qualidade</h3>
                <p className="text-gray-300">
                  Produtos originais e garantia em todas as compras
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
