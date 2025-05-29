import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'; // Assuming Input is used for newsletter
import { Button } from '@/components/ui/button'; // Assuming Button is used for newsletter
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'; // Icons for social media

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
// Focus: Visual structure, styling, layout, responsiveness. NO logic changes.
const Footer: React.FC = () => {
  const navigate = useNavigate();

  // Keep existing navigation logic intact
  const handleNavigate = (path: string) => {
    // Potentially add scroll restoration logic if needed, but keep core navigation
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-16 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Links + Newsletter (Inspired by GameStop) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Links Columns (3 columns) */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Loja */}
            <div>
              <h5 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">Loja</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleNavigate('/categoria/playstation')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">PlayStation</button></li>
                <li><button onClick={() => handleNavigate('/categoria/xbox')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Xbox</button></li>
                <li><button onClick={() => handleNavigate('/categoria/nintendo')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Nintendo</button></li>
                <li><button onClick={() => handleNavigate('/categoria/pc')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">PC Gamer</button></li>
                <li><button onClick={() => handleNavigate('/categoria/acessorios')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Acessórios</button></li>
                <li><button onClick={() => handleNavigate('/categoria/ofertas')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Ofertas</button></li>
              </ul>
            </div>
            {/* Column 2: UTI PRO & Serviços */}
            <div>
              <h5 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">UTI PRO & Serviços</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleNavigate('/uti-pro')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Conheça o UTI PRO</button></li>
                <li><button onClick={() => handleNavigate('/servicos/assistencia')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Assistência Técnica</button></li>
                <li><button onClick={() => handleNavigate('/servicos/avaliacao')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Avaliação de Produtos</button></li>
              </ul>
            </div>
            {/* Column 3: Ajuda */}
            <div>
              <h5 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">Ajuda</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => handleNavigate('/ajuda/faq')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Perguntas Frequentes</button></li>
                <li><button onClick={() => handleNavigate('/ajuda/contato')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Fale Conosco</button></li>
                <li><button onClick={() => handleNavigate('/ajuda/trocas')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Política de Trocas</button></li>
                <li><button onClick={() => handleNavigate('/ajuda/privacidade')} className="hover:text-uti-red transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-gray-900 rounded-sm">Política de Privacidade</button></li>
              </ul>
            </div>
          </div>

          {/* Newsletter & Social (2 columns) */}
          <div className="md:col-span-2 flex flex-col justify-between">
            {/* Newsletter */}
            <div>
              <h5 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">Fique por dentro</h5>
              <p className="text-sm mb-3">Receba ofertas exclusivas e novidades direto no seu email.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}> {/* Prevent default form submission */}
                <Input
                  type="email"
                  placeholder="Seu melhor email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-uti-red focus:border-uti-red flex-grow"
                  aria-label="Email para newsletter"
                />
                <Button type="submit" variant="destructive" className="bg-uti-red hover:bg-uti-red/90">Inscrever</Button>
              </form>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h5 className="font-semibold text-base text-white mb-3 uppercase tracking-wider">Siga-nos</h5>
              <div className="flex space-x-4">
                {/* Added focus-visible for accessibility */}
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Facebook size={20} /></a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Instagram size={20} /></a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Twitter size={20} /></a>
                <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 my-8" />

        {/* Bottom Section: Copyright & Contact Info */}
        <div className="text-center text-xs text-gray-500">
          <p className="mb-1">
            UTI DOS GAMES LTDA - CNPJ: XX.XXX.XXX/0001-XX | Endereço: Rua Exemplo, 123, Centro, Colatina - ES, CEP 29700-000
          </p>
          <p>
            © {new Date().getFullYear()} UTI DOS GAMES. Todos os direitos reservados. Os preços e condições de pagamento são exclusivos para compras via internet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

