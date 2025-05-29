import { User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MobileSearchBar from './MobileSearchBar'; // Keep if still used elsewhere, or remove if MobileSearchBarTrigger handles all mobile search
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';
import { useSubscriptions } from '@/hooks/useSubscriptions';

interface HeaderActionsProps {
  onCartOpen: () => void; // Keep if GlobalCartIcon needs it, otherwise remove
  onAuthOpen: () => void;
  // onCategoriesToggle: () => void; // Removed as likely handled by MobileMenu
  // onMobileMenuToggle: () => void; // Removed as the toggle is now in MainHeader
}

// **Radical Redesign - Simplified Header Actions**
const HeaderActions = ({ 
  onAuthOpen, 
  // Remove onMobileMenuToggle if not used
}: HeaderActionsProps) => {
  const { user, isAdmin } = useAuth();
  const { hasActiveSubscription } = useSubscriptions();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        // Navigate to account page or open modal
        navigate('/conta'); // Example: navigate to account page
        // onAuthOpen(); // Or open modal if preferred
      }
    } else {
      onAuthOpen(); // Open login/signup modal
    }
  };

  return (
    // Use space-x-1 or space-x-2 for spacing based on visual preference
    <div className="flex items-center space-x-1 sm:space-x-2">
      
      {/* Mobile Search - Removed, handled by trigger in MainHeader */}
      {/* <div className="lg:hidden">
        <MobileSearchBar />
      </div> */}

      {/* UTI PRO Badge for subscribers - Desktop only */}
      {hasActiveSubscription() && (
        <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
          <Crown className="w-3 h-3" />
          PRO
        </div>
      )}

      {/* User Account / Login Button - Desktop only */}
      <Button 
        onClick={handleLogin} 
        variant="ghost" 
        size="icon" // Use icon size for consistency
        className="hidden md:inline-flex text-gray-700 hover:bg-gray-100" // Show only on md and up
        aria-label={user ? (isAdmin ? 'Painel Admin' : 'Minha Conta') : 'Entrar ou Cadastrar'}
      >
        <User className="h-5 w-5" />
      </Button>

      {/* Global Shopping Cart Icon - Visible on all sizes */}
      <GlobalCartIcon />

      {/* Mobile Menu Toggle - REMOVED from here, handled in MainHeader */}
      {/* <Button 
        onClick={onMobileMenuToggle} 
        variant="ghost" 
        className="sm:hidden flex flex-col items-center p-3 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
        <span className="text-xs font-medium mt-1">Mais</span>
      </Button> */}
    </div>
  );
};

export default HeaderActions;

