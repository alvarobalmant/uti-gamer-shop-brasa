import { User, ShoppingCart, LogOut, UserCog, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from 'react';

interface HeaderActionsProps {
  onCartOpen: () => void;
  onAuthOpen: () => void;
}

// *** REFAZER LÓGICA PARA GARANTIR FUNCIONAMENTO ***
const HeaderActions = ({ onAuthOpen, onCartOpen }: HeaderActionsProps) => {
  const { loading, user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // Log de estado inicial e mudanças
  useEffect(() => {
    console.log('[HeaderActions Refactored] Auth State Update:', { loading, user: !!user, isAdmin });
  }, [loading, user, isAdmin]);

  const handleAdminPanelClick = () => {
    console.log('[HeaderActions Refactored] Navigating to /admin');
    navigate('/admin');
  };

  const handleSignOutClick = () => {
    console.log('[HeaderActions Refactored] Signing out');
    signOut();
  };

  const handleSignInClick = () => {
    console.log('[HeaderActions Refactored] Sign in button clicked, calling onAuthOpen');
    onAuthOpen();
  };

  // Renderização Condicional Explícita

  // 1. Estado de Carregamento
  if (loading) {
    console.log('[HeaderActions Refactored] Rendering: Loading State');
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "hidden md:flex items-center text-xs font-medium text-foreground px-2 py-1",
            "md:hover:text-primary md:hover:bg-secondary"
          )}
          disabled
        >
          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          Carregando...
        </Button>
        <GlobalCartIcon onCartOpen={onCartOpen} />
      </div>
    );
  }

  // 2. Usuário Logado
  if (user) {
    console.log('[HeaderActions Refactored] Rendering: Logged In State', { userEmail: user.email, isAdmin });
    return (
      <div className="flex items-center space-x-1 sm:space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Botão que APENAS abre o dropdown */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hidden md:flex items-center text-xs font-medium text-foreground px-2 py-1",
                "md:hover:text-primary md:hover:bg-secondary"
              )}
              onClick={(e) => {
                 console.log('[HeaderActions Refactored] Dropdown trigger clicked');
                 e.stopPropagation(); // Evitar que outros cliques sejam acionados
              }}
            >
              <User className="w-4 h-4 mr-1" />
              {user.email || 'Conta'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem onClick={handleAdminPanelClick}>
                <UserCog className="mr-2 h-4 w-4" />
                <span>Painel Admin</span>
              </DropdownMenuItem>
            )}
            {/* Adicionar link para perfil do usuário se existir */}
            {/* <DropdownMenuItem onClick={() => navigate('/perfil')}>
              <User className="mr-2 h-4 w-4" />
              <span>Meu Perfil</span>
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOutClick}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <GlobalCartIcon onCartOpen={onCartOpen} />
      </div>
    );
  }

  // 3. Usuário Deslogado (Default)
  console.log('[HeaderActions Refactored] Rendering: Logged Out State');
  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      {/* Botão que APENAS chama onAuthOpen */}
      <Button
        onClick={handleSignInClick} // Chama diretamente a função de abrir modal
        variant="ghost"
        size="sm"
        className={cn(
          "hidden md:flex items-center text-xs font-medium text-foreground px-2 py-1",
          "md:hover:text-primary md:hover:bg-secondary"
        )}
      >
        <User className="w-4 h-4 mr-1" />
        Entrar
      </Button>
      <GlobalCartIcon onCartOpen={onCartOpen} />
    </div>
  );
};

export default HeaderActions;
