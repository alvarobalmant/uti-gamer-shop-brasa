
import { useServiceCards } from '@/hooks/useServiceCards';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Users, Award, Clock, Star, MessageCircle, Phone, MapPin } from 'lucide-react';

const ServiceCards = () => {
  const { serviceCards, loading } = useServiceCards();
  const navigate = useNavigate();

  const handleCardClick = (linkUrl: string) => {
    if (linkUrl.startsWith('http')) {
      window.open(linkUrl, '_blank');
    } else {
      navigate(linkUrl);
    }
  };

  // Store differentiators data
  const differentiators = [
    {
      icon: Award,
      title: "10+ Anos de Tradição",
      description: "Referência em games na região"
    },
    {
      icon: Users,
      title: "Especialistas em Games",
      description: "Equipe especializada e apaixonada"
    },
    {
      icon: Shield,
      title: "Garantia e Confiança",
      description: "Produtos e serviços com garantia"
    },
    {
      icon: Star,
      title: "Atendimento Personalizado",
      description: "Suporte dedicado a cada cliente"
    }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 animate-pulse">
                <div className="bg-gray-200 h-16 w-16 rounded-xl mx-auto mb-6"></div>
                <div className="bg-gray-200 h-6 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (serviceCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Main Services Section */}
      <section className="py-16 bg-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              🎯 Nossos Serviços Especializados
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mais de 10 anos oferecendo os melhores serviços em games para Colatina e região
            </p>
          </div>
          
          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {serviceCards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.link_url)}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-red-200 p-8 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Service Icon */}
                <div className="mb-6 flex-shrink-0">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-8 h-8 object-cover rounded filter brightness-0 invert"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div className="w-8 h-8 text-white text-xl font-bold hidden">
                        🎮
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                
                {/* Service Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-red-600 transition-colors duration-300">
                  {card.title}
                </h3>
                
                {/* Service Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 text-center line-clamp-2">
                  {card.description}
                </p>
                
                {/* Call to Action */}
                <div className="flex items-center justify-center text-red-600 group-hover:text-red-700 transition-colors duration-300 font-semibold text-sm">
                  <span>Saiba mais</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Differentiators Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,#ef4444_0%,transparent_50%)]"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,#dc2626_0%,transparent_50%)]"></div>
        </div>
        
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ⭐ Por que escolher a UTI DOS GAMES?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nossos diferenciais que fazem a diferença na sua experiência
            </p>
          </div>
          
          {/* Differentiators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {differentiators.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium Contact/Help Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Contact Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up">
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-8 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    💬 Precisa de ajuda especializada?
                  </h2>
                  <p className="text-xl text-red-100 max-w-2xl mx-auto">
                    Nossa equipe está pronta para atender você com a melhor experiência em games
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left: CTA and Description */}
                  <div className="text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Fale conosco agora mesmo
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                      Tire suas dúvidas, solicite orçamentos ou receba suporte técnico especializado. 
                      Estamos aqui para ajudar você a encontrar exatamente o que precisa.
                    </p>
                    
                    {/* WhatsApp CTA Button */}
                    <button
                      onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
                      className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg group"
                    >
                      <MessageCircle className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Falar no WhatsApp</span>
                      <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                  
                  {/* Right: Contact Information */}
                  <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                      Outras formas de contato
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Phone */}
                      <div className="flex items-center group hover:bg-white p-3 rounded-xl transition-colors duration-300">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-colors duration-300">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">(27) 99688-2090</p>
                          <p className="text-sm text-gray-600">WhatsApp e Ligações</p>
                        </div>
                      </div>
                      
                      {/* Hours */}
                      <div className="flex items-center group hover:bg-white p-3 rounded-xl transition-colors duration-300">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-orange-200 transition-colors duration-300">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Seg à Sex: 9h às 18h</p>
                          <p className="text-sm text-gray-600">Horário de atendimento</p>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center group hover:bg-white p-3 rounded-xl transition-colors duration-300">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 group-hover:bg-red-200 transition-colors duration-300">
                          <MapPin className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Colatina - ES</p>
                          <p className="text-sm text-gray-600">Venha nos visitar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceCards;
