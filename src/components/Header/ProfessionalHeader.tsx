import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface ProfessionalHeaderProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

const ProfessionalHeader = ({ onCartOpen, onAuthOpen }: ProfessionalHeaderProps) => {
  // Implementação com tratamento de erro e fallback para todos os hooks
  let authData = { user: null, isAdmin: false };
  let cartData = { cartItems: [] };
  let subscriptionData = { hasActiveSubscription: () => false };
  
  try {
    authData = useAuth();
  } catch (error) {
    console.error('Erro ao carregar dados de autenticação:', error);
  }
  
  try {
    cartData = useCart();
  } catch (error) {
    console.error('Erro ao carregar dados do carrinho:', error);
  }
  
  try {
    subscriptionData = useSubscriptions();
  } catch (error) {
    console.error('Erro ao carregar dados de assinatura:', error);
  }
  
  // Extrair valores com fallback seguro
  const user = authData?.user || null;
  const isAdmin = authData?.isAdmin || false;
  const cartItems = cartData?.cartItems || [];
  const hasActiveSubscription = () => {
    try {
      return subscriptionData?.hasActiveSubscription() || false;
    } catch (error) {
      console.error('Erro ao verificar assinatura ativa:', error);
      return false;
    }
  };
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Detectar scroll para mudar aparência do cabeçalho
  useEffect(() => {
    try {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } catch (error) {
      console.error('Erro no efeito de scroll:', error);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Erro ao processar busca:', error);
    }
  };

  const toggleMobileMenu = () => {
    try {
      setMobileMenuOpen(!mobileMenuOpen);
    } catch (error) {
      console.error('Erro ao alternar menu mobile:', error);
    }
  };

  const closeMobileMenu = () => {
    try {
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Erro ao fechar menu mobile:', error);
    }
  };

  // Envolver todo o JSX em um try-catch para evitar quebra de renderização
  try {
    return (
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-gray-900/95 backdrop-blur-md shadow-lg" 
            : "bg-gray-900"
        )}
        style={{ '--header-height': '64px' } as React.CSSProperties}
      >
        <div className="container-professional mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-white">
              <img 
                src="/lovable-uploads/uti-logo.png" 
                alt="UTI DOS GAMES" 
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none text-uti-red">UTI DOS GAMES</span>
                <span className="text-xs text-gray-400 leading-tight">Compre online com a segurança de uma loja física</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Buscar jogos, consoles, acessórios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white rounded-full pl-4 pr-10 py-1.5 w-64 lg:w-80 focus:outline-none focus:ring-2 focus:ring-uti-red/50"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>

              {/* Auth Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onAuthOpen}
                className="text-white hover:bg-white/10"
              >
                <User className="h-5 w-5 mr-2" />
                {user ? 'Minha Conta' : 'Entrar / Cadastrar'}
              </Button>

              {/* Cart Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCartOpen}
                className="text-white hover:bg-white/10 relative"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrinho
                {cartItems && cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-uti-red text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-3">
              {/* Mobile Cart Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCartOpen}
                className="text-white hover:bg-white/10 relative p-1"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems && cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-uti-red text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="text-white hover:bg-white/10 p-1"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className={cn(
          "bg-gray-800 py-2 hidden md:block",
          isScrolled ? "shadow-md" : ""
        )}>
          <div className="container-professional mx-auto px-4">
            <ul className="flex items-center justify-center space-x-1">
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/">Início</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/playstation">PlayStation</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/nintendo">Nintendo</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/xbox">Xbox</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/pc">PC Gaming</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/colecionaveis">Colecionáveis</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/category/acessorios">Acessórios</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/ofertas">Ofertas</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="sm" 
                  asChild
                  className="text-white hover:bg-white/10"
                >
                  <Link to="/uti-pro" className="flex items-center gap-1">
                    <Crown className="h-4 w-4 mr-1" />
                    UTI PRO
                  </Link>
                </Button>
              </li>
              {isAdmin && (
                <li>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                  >
                    <Link to="/admin">
                      <Crown className="h-4 w-4 mr-1" />
                      Painel Admin
                    </Link>
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={cn(
          "fixed inset-0 bg-gray-900/95 backdrop-blur-md z-40 transition-all duration-300 flex flex-col",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ top: '64px' }}
        >
          {/* Mobile Search */}
          <div className="p-4 border-b border-gray-800">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar jogos, consoles, acessórios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white rounded-full pl-4 pr-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-uti-red/50"
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Mobile Auth */}
          <div className="p-4 border-b border-gray-800">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => {
                onAuthOpen();
                closeMobileMenu();
              }}
              className="w-full text-white border-white/20 hover:bg-white/10"
            >
              <User className="h-5 w-5 mr-2" />
              {user ? 'Minha Conta' : 'Entrar / Cadastrar'}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-4">
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/">Início</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/playstation">PlayStation</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/nintendo">Nintendo</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/xbox">Xbox</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/pc">PC Gaming</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/colecionaveis">Colecionáveis</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/category/acessorios">Acessórios</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/ofertas">Ofertas</Link>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost"
                  size="lg" 
                  asChild
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={closeMobileMenu}
                >
                  <Link to="/uti-pro" className="flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    UTI PRO
                  </Link>
                </Button>
              </li>
              {isAdmin && (
                <li>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    asChild
                    className="w-full justify-start border-amber-500 text-amber-500 hover:bg-amber-500/10"
                    onClick={closeMobileMenu}
                  >
                    <Link to="/admin">
                      <Crown className="h-4 w-4 mr-2" />
                      Painel Admin
                    </Link>
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Erro fatal na renderização do ProfessionalHeader:', error);
    // Fallback mínimo em caso de erro fatal
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900">
        <div className="container-professional mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-white">
              <span className="font-bold text-lg leading-none text-uti-red">UTI DOS GAMES</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }
};

export default ProfessionalHeader;
