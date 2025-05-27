
import { X, User, Phone, Truck, CreditCard, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { categories, Category } from './categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthOpen: () => void;
}

const MobileMenu = ({ isOpen, onClose, onAuthOpen }: MobileMenuProps) => {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: Category) => {
    if (expandedCategory === category.id) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category.id);
    }
  };

  const handleSubcategoryClick = (category: Category) => {
    navigate(category.path);
    onClose();
  };

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: string } = {
      'PlayStation': '🎮',
      'Xbox': '🎯',
      'Nintendo': '🌟',
      'PC Games': '💻',
      'Retro': '👾',
      'Acessórios': '🎧',
      'Promoções': '🔥',
      'Lançamentos': '✨'
    };
    return iconMap[categoryName] || '🎮';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" 
              alt="UTI DOS GAMES" 
              className="h-8 w-8"
            />
            <h3 className="text-lg font-bold text-gray-900">Menu</h3>
          </div>
          <Button 
            onClick={onClose} 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-red-600"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Section */}
          {user ? (
            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gray-100 rounded-full p-2">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Olá!</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => {
                    navigate('/admin');
                    onClose();
                  }}
                  className="w-full mb-3 bg-red-600 hover:bg-red-700"
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
            <div className="pb-6 border-b border-gray-200">
              <Button
                onClick={() => {
                  onAuthOpen();
                  onClose();
                }}
                className="w-full bg-red-600 hover:bg-red-700 font-semibold py-3"
              >
                <User className="w-5 h-5 mr-2" />
                Entrar / Criar Conta
              </Button>
            </div>
          )}

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Categorias</h4>
            {categories.map(category => (
              <div key={category.id} className="space-y-1">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="flex items-center justify-between w-full p-4 text-left text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{getCategoryIcon(category.name)}</span>
                    <span>{category.name}</span>
                  </div>
                  <span className={`text-gray-400 transition-transform duration-200 ${
                    expandedCategory === category.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>

                {/* Subcategories */}
                {expandedCategory === category.id && (
                  <div className="ml-6 space-y-1 animate-fade-in">
                    <button
                      onClick={() => handleSubcategoryClick(category)}
                      className="block w-full text-left p-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      Ver todos os produtos
                    </button>
                    <button
                      onClick={() => handleSubcategoryClick(category)}
                      className="block w-full text-left p-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      Produtos em destaque
                    </button>
                    <button
                      onClick={() => handleSubcategoryClick(category)}
                      className="block w-full text-left p-3 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                    >
                      Lançamentos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact & Promo Info */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Informações</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-green-600">(27) 99688-2090</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-blue-500" />
                <span>Frete grátis acima de R$ 200</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <CreditCard className="w-4 h-4 text-purple-500" />
                <span>Parcelamento em até 12x</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Award className="w-4 h-4 text-yellow-500" />
                <span>+10 anos de tradição</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
