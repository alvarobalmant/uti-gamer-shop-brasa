
import { Home, Grid3X3, Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount } = useCart();

  const navItems = [
    {
      icon: Home,
      label: 'Início',
      path: '/',
      isActive: location.pathname === '/'
    },
    {
      icon: Grid3X3,
      label: 'Categorias',
      path: '/categorias',
      isActive: location.pathname.startsWith('/categoria')
    },
    {
      icon: Search,
      label: 'Buscar',
      path: '/busca',
      isActive: location.pathname === '/busca'
    },
    {
      icon: ShoppingCart,
      label: 'Carrinho',
      path: '/carrinho',
      badge: getCartItemsCount(),
      isActive: location.pathname === '/carrinho'
    },
    {
      icon: User,
      label: 'Conta',
      path: '/conta',
      isActive: location.pathname === '/conta'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors relative ${
                item.isActive
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {item.isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-red-600 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
