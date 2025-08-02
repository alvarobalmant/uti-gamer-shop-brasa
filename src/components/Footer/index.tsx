
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">UTI dos Games</h3>
            <p className="text-gray-400 text-sm">
              A loja de games mais tradicional de Colatina. 
              Mais de 10 anos oferecendo os melhores produtos.
            </p>
          </div>

          {/* Links rápidos */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Produtos</Link></li>
              <li><Link to="/ofertas" className="hover:text-white transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* Categorias */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Categorias</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/playstation" className="hover:text-white transition-colors">PlayStation</Link></li>
              <li><Link to="/xbox" className="hover:text-white transition-colors">Xbox</Link></li>
              <li><Link to="/nintendo" className="hover:text-white transition-colors">Nintendo</Link></li>
              <li><Link to="/pc-gaming" className="hover:text-white transition-colors">PC Gaming</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Contato</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Colatina, ES</p>
              <p>contato@utigames.com.br</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 UTI dos Games. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
