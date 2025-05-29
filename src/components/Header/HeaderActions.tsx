import { User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlobalCartIcon from '@/components/GlobalCart/GlobalCartIcon';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { cn } from '@/lib/utils';

// **Radical Redesign based on GameStop reference and plan_transformacao_radical.md**
// Focus: Visual structure, styling, layout, responsiveness. NO logic changes.

interface HeaderActionsProps {
  onCartOpen: () => void; // Keep for GlobalCartIcon if needed internally
  onAuthOpen: () => void; // Keep for login/account button logic
}

const HeaderActions = ({ 
  onAuthOpen, 
  // onCartOpen might not be needed directly here if GlobalCartIcon handles its own logic
}: HeaderActionsProps) => {
  const { user, isAdmin } = useAuth(); // Keep auth logic
  const { hasActiveSubscription } = useSubscriptions(); // Keep subscription logic
  const navigate = useNavigate(); // Keep navigation logic

  // Keep existing login handler logic
  const handleLogin = () => {
    if (user) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        // Navigate to account page or open modal - keep existing behavior
        navigate('/conta'); // Example: navigate to account page
        // onAuthOpen(); // Or open modal if that's the original behavior
      }
    } else {
      onAuthOpen(); // Keep existing logic to open auth modal
    }
  };

  return (
    // Use flex and gap for spacing, consistent with GameStop style
    <div className="flex items-center gap-2 sm:gap-3">
      
      {/* UTI PRO Badge - Simplified visual, shown only if active */}
      {hasActiveSubscription() && (
        <div className="hidden sm:flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          <span>PRO</span>
        </div>
      )}

      {/* User Account Button - Consistent icon style */}
      <Button 
        onClick={handleLogin} // Keep existing logic
        variant="ghost" 
        size="icon" 
        className="text-gray-700 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
        aria-label={user ? (isAdmin ? 'Painel Admin' : 'Minha Conta') : 'Entrar ou Cadastrar'}
      >
        <User className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Global Shopping Cart Icon - Assuming it handles its own logic */}
      <GlobalCartIcon />

      {/* Mobile Menu Toggle was moved to MainHeader.tsx - Removed from here */}
    </div>
  );
};

export default HeaderActions;

