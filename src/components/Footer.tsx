import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'; // Example social icons
import { cn } from '@/lib/utils';

// **Redesign based on GameStop Footer structure**
const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const currentYear = new Date().getFullYear();

  // Footer link sections (example structure)
  const footerSections = [
    {
      title: 'Loja',
      links: [
        { label: 'PlayStation', path: '/categoria/playstation' },
        { label: 'Xbox', path: '/categoria/xbox' },
        { label: 'Nintendo', path: '/categoria/nintendo' },
        { label: 'PC Gamer', path: '/categoria/pc' },
        { label: 'Acessórios', path: '/categoria/acessorios' },
        { label: 'Ofertas', path: '/categoria/ofertas' },
      ],
    },
    {
      title: 'UTI PRO',
      links: [
        { label: 'Conheça o UTI PRO', path: '/uti-pro' },
        { label: 'Benefícios', path: '/uti-pro#beneficios' }, // Example anchor link
        { label: 'Assinar', path: '/uti-pro/assinar' },
      ],
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
    // Add more sections as needed (e.g., Institucional)
  ];

  return (
    <footer className={cn(
      "bg-secondary text-secondary-foreground mt-12 md:mt-16 lg:mt-20", // Use secondary background
      "border-t border-border/60"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Top Section: Links + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-8">
          {/* Link Columns (spanning more columns on desktop) */}
          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-3 text-sm text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => handleNavigation(link.path)}
                        className="text-xs text-muted-foreground hover:text-primary hover:underline transition-colors duration-200"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-3 text-sm text-foreground">
              Fique por dentro
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Receba ofertas exclusivas e novidades direto no seu email.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Seu melhor email"
                className="h-9 text-xs bg-background border-border/80 focus:border-primary"
                aria-label="Email para newsletter"
              />
              <Button type="submit" size="sm" className="h-9 text-xs shrink-0">
                Inscrever
              </Button>
            </form>
            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook size={18} /></a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram size={18} /></a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter size={18} /></a>
              <a href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary"><Youtube size={18} /></a>
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Bottom Section: Copyright and Address */}
        <div className="text-center pt-8">
          {/* Optional: Add payment method icons here */}
          <p className="text-xs text-muted-foreground mb-1">
            UTI DOS GAMES LTDA - CNPJ: XX.XXX.XXX/0001-XX | Endereço: Rua Exemplo, 123, Centro, Colatina - ES, CEP 29700-000
          </p>
          <p className="text-xs text-muted-foreground">
            © {currentYear} UTI DOS GAMES. Todos os direitos reservados. Os preços e condições de pagamento são exclusivos para compras via internet.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

