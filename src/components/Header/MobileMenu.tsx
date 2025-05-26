
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { categories, Category } from './categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleCategoryClick = (category: Category) => {
    navigate(category.path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-uti-dark">Menu</h3>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-uti-red"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Section */}
          {user ? (
            <div className="pb-6 mb-6 border-b border-gray-200">
              <p className="text-sm text-uti-gray mb-3">Olá, {user.email}</p>
              {isAdmin && (
                <Button
                  onClick={() => {
                    navigate('/admin');
                    onClose();
                  }}
                  className="w-full mb-3 btn-primary"
                >
                  Painel Admin
                </Button>
              )}
              <Button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                variant="outline"
                className="w-full"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="pb-6 mb-6 border-b border-gray-200">
              <Button
                onClick={() => {
                  onAuthOpen();
                  onClose();
                }}
                className="w-full btn-primary"
              >
                Entrar / Criar Conta
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="font-semibold text-uti-dark text-sm mb-3">Categorias</h4>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="block w-full text-left py-3 px-4 text-uti-dark hover:text-uti-red hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
