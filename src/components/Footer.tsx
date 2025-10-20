import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { categories } from '@/components/Header/categories';

// **Redesign based on GameStop Footer structure**
const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  // Filtrar categorias para remover "Início" e criar links da seção Loja
  const lojaLinks = categories
    .filter(category => category.id !== 'inicio') // Remove "Início"
    .map(category => ({
      label: category.name,
      path: category.path
    }));

  // Footer link sections
  const footerSections = [
    {
      title: 'Loja',
      links: lojaLinks, // Usar links dinâmicos da navegação
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Fale Conosco', path: '/ajuda/contato' },
        { label: 'Perguntas Frequentes', path: '/ajuda/faq' },
        { label: 'Política de Trocas', path: '/ajuda/trocas' },
        { label: 'Política de Privacidade', path: '/ajuda/privacidade' },
      ],
    },
  ];

  return (
    <footer className={cn(
      "bg-gray-900 text-gray-200 mt-12 md:mt-16 lg:mt-20", // Darker background for better contrast
      "border-t border-gray-800"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-4 text-sm text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-xs text-gray-400 hover:text-white hover:underline transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-800" />

        {/* Bottom Section: Copyright and Address */}
        <div className="text-center pt-8">
          {/* Optional: Add payment method icons here */}
          <p className="text-xs text-gray-500 mb-2">
            UTI DOS GAMES LTDA - CNPJ: 16.811.173/0001-20 | Endereço: R. Alexandre Calmon, 314 - Centro, Colatina - ES, 29700-040
          </p>
          <p className="text-xs text-gray-500">
            © {currentYear} UTI DOS GAMES. Todos os direitos reservados. Os preços e condições de pagamento são exclusivos para compras via internet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

