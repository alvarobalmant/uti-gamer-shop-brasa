import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input'; // For potential newsletter signup
import { Button } from '@/components/ui/button'; // For potential newsletter signup
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'; // Example social icons

// **Radical Redesign - Footer based on GameStop reference and UTI Identity**
const Footer: React.FC = () => {
  const navigate = useNavigate();

  // Footer link sections
  const sections = [
    {
      title: 'Compre por Categoria',
      links: [
        { label: 'PlayStation', path: '/categoria/playstation' },
        { label: 'Xbox', path: '/categoria/xbox' },
        { label: 'Nintendo', path: '/categoria/nintendo' },
        { label: 'PC Gamer', path: '/categoria/pc' },
        { label: 'Acessórios', path: '/categoria/acessorios' },
        { label: 'Ofertas', path: '/categoria/ofertas' },
        // { label: 'Colecionáveis', path: '/categoria/colecionaveis' }, // Add if applicable
      ],
    },
    {
      title: 'UTI PRO',
      links: [
        { label: 'Benefícios', path: '/uti-pro' },
        { label: 'Torne-se Membro', path: '/uti-pro' }, // Link to main UTI Pro page
        // { label: 'Minha Conta PRO', path: '/conta/pro' }, // Example link
      ],
    },
    {
      title: 'Suporte ao Cliente',
      links: [
        { label: 'Perguntas Frequentes (FAQ)', path: '/ajuda/faq' },
        { label: 'Fale Conosco', path: '/ajuda/contato' },
        { label: 'Trocas e Devoluções', path: '/ajuda/trocas' },
        { label: 'Política de Privacidade', path: '/institucional/privacidade' },
        { label: 'Termos de Serviço', path: '/institucional/termos' },
      ],
    },
    {
      title: 'Sobre a UTI dos Games',
      links: [
        { label: 'Nossa História', path: '/institucional/sobre' },
        { label: 'Trabalhe Conosco', path: '/institucional/carreiras' }, // Example link
        { label: 'Localização', path: '/institucional/localizacao' }, // Example link
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 w-full overflow-x-hidden mt-16 border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigate(link.path)}
                      className="text-sm text-gray-400 hover:text-uti-red transition-colors duration-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Optional: Newsletter/Contact Column (Example) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-semibold text-base text-white mb-4 uppercase tracking-wider">Fique por Dentro</h4>
            <p className="text-sm text-gray-400 mb-4">Receba ofertas exclusivas e novidades diretamente no seu email.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Seu melhor email" 
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-uti-red focus:ring-uti-red rounded-md text-sm" 
              />
              <Button 
                variant="destructive" // Use UTI Red color
                className="bg-uti-red hover:bg-uti-red/90 text-white rounded-md text-sm px-4 whitespace-nowrap"
              >
                Inscrever
              </Button>
            </div>
            {/* Social Media Links */}
            <div className="mt-6">
              <h5 className="font-semibold text-base text-white mb-3 uppercase tracking-wider">Siga-nos</h5>
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Facebook size={20} /></a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Instagram size={20} /></a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Twitter size={20} /></a>
                <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-uti-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded-sm"><Youtube size={20} /></a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-700 my-8" />

        {/* Bottom Section: Copyright and Info */}
        <div className="text-center text-xs text-gray-500">
          <p className="mb-1">
            © {new Date().getFullYear()} UTI DOS GAMES. Todos os direitos reservados. CNPJ: XX.XXX.XXX/0001-XX
          </p>
          <p>
            Endereço: Rua Exemplo, 123 - Centro, Colatina - ES, CEP: 29700-000
          </p>
          {/* Add other required info like payment methods icons if needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

