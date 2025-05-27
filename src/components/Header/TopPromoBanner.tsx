
import { Phone, Truck, CreditCard, Award, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const TopPromoBanner = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-900 text-white py-2 border-b border-gray-800 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm">
        {/* Contact Info - Left */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-green-400">
            <Phone className="w-4 h-4" />
            <span className="font-medium">(27) 99688-2090</span>
          </div>
        </div>

        {/* Promotional Info - Center */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>Frete grátis acima de R$ 200</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Parcelamento em até 12x</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>+10 anos de tradição</span>
          </div>
        </div>

        {/* Account Link - Right */}
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <Button 
            variant="ghost" 
            className="text-white hover:text-red-400 hover:bg-gray-800 text-sm h-auto p-1"
          >
            {user ? 'Minha Conta' : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopPromoBanner;
