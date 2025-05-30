
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Gamepad2, 
  MonitorSpeaker, 
  Headphones, 
  Smartphone, 
  Trophy, 
  Gift 
} from 'lucide-react';

const HeroQuickLinks = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const quickLinks = [
    {
      id: 'playstation',
      icon: Gamepad2,
      label: 'PlayStation',
      path: '/categoria/playstation',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'xbox',
      icon: Gamepad2,
      label: 'Xbox',
      path: '/categoria/xbox',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      id: 'nintendo',
      icon: Gamepad2,
      label: 'Nintendo',
      path: '/categoria/nintendo',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'pc',
      icon: MonitorSpeaker,
      label: 'PC Games',
      path: '/categoria/pc',
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700'
    },
    {
      id: 'acessorios',
      icon: Headphones,
      label: 'Acessórios',
      path: '/categoria/acessorios',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      id: 'ofertas',
      icon: Gift,
      label: 'Ofertas',
      path: '/categoria/ofertas',
      color: 'bg-uti-red',
      hoverColor: 'hover:bg-red-700'
    }
  ];

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  if (isMobile) {
    return (
      <section className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => handleQuickLinkClick(link.path)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className={`w-[60px] h-[60px] ${link.color} ${link.hoverColor} rounded-full flex items-center justify-center mb-2 transition-all duration-300 group-hover:shadow-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-center items-center space-x-8 lg:space-x-12">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <button
                key={link.id}
                onClick={() => handleQuickLinkClick(link.path)}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className={`w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] ${link.color} ${link.hoverColor} rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-professional`}>
                  <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <span className="text-sm lg:text-base font-medium text-gray-700 text-center">
                  {link.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroQuickLinks;
