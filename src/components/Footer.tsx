import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

// **New Component - Basic Structure**
const Footer: React.FC = () => {
  const navigate = useNavigate();

  // Simplified footer content, can be expanded later
  return (
    <footer className="bg-uti-dark text-uti-light mt-12 py-8 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Column 1: Links */}
          <div>
            <h4 className="font-semibold mb-3 text-uti-red">Navegação</h4>
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={() => navigate('/categoria/playstation')} className="text-uti-light/80 hover:text-white transition-colors">PlayStation</button></li>
              <li><button onClick={() => navigate('/categoria/xbox')} className="text-uti-light/80 hover:text-white transition-colors">Xbox</button></li>
              <li><button onClick={() => navigate('/categoria/nintendo')} className="text-uti-light/80 hover:text-white transition-colors">Nintendo</button></li>
              <li><button onClick={() => navigate('/categoria/pc')} className="text-uti-light/80 hover:text-white transition-colors">PC</button></li>
              <li><button onClick={() => navigate('/categoria/acessorios')} className="text-uti-light/80 hover:text-white transition-colors">Acessórios</button></li>
              <li><button onClick={() => navigate('/categoria/ofertas')} className="text-uti-light/80 hover:text-white transition-colors">Ofertas</button></li>
            </ul>
          </div>
          
          {/* Column 2: UTI PRO */}
          <div>
            <h4 className="font-semibold mb-3 text-uti-red">UTI PRO</h4>
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={() => navigate('/uti-pro')} className="text-uti-light/80 hover:text-white transition-colors">Benefícios</button></li>
              <li><button onClick={() => navigate('/uti-pro/assinar')} className="text-uti-light/80 hover:text-white transition-colors">Assinar</button></li>
              {/* Add more PRO links if needed */}
            </ul>
          </div>

          {/* Column 3: Ajuda */}
          <div>
            <h4 className="font-semibold mb-3 text-uti-red">Ajuda</h4>
            <ul className="space-y-1.5 text-sm">
              <li><button onClick={() => navigate('/ajuda/faq')} className="text-uti-light/80 hover:text-white transition-colors">FAQ</button></li>
              <li><button onClick={() => navigate('/ajuda/contato')} className="text-uti-light/80 hover:text-white transition-colors">Contato</button></li>
              <li><button onClick={() => navigate('/ajuda/trocas')} className="text-uti-light/80 hover:text-white transition-colors">Trocas e Devoluções</button></li>
            </ul>
          </div>

          {/* Column 4: Contato Info */}
          <div>
            <h4 className="font-semibold mb-3 text-uti-red">Contato</h4>
            <ul className="space-y-1.5 text-sm text-uti-light/80">
              <li>📱 (27) 99688-2090</li>
              <li>📧 contato@utidosgames.com</li>
              <li>🕒 Seg à Sex: 9h às 18h</li>
              <li>📍 Colatina - ES</li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-uti-light/20 my-6" />
        
        <div className="text-center">
          <p className="text-uti-light/60 text-xs">
            © {new Date().getFullYear()} UTI DOS GAMES. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

