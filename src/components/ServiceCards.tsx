
import { useServiceCards } from '@/hooks/useServiceCards';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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

  if (loading) {
    return (
      <section className="section-padding bg-gradient-section">
        <div className="container-professional">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto mb-4 animate-pulse"></div>
            <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid-services">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-service animate-pulse">
                <div className="p-8">
                  <div className="bg-gray-200 h-16 w-16 rounded-xl mx-auto mb-6"></div>
                  <div className="bg-gray-200 h-6 rounded mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
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
    <section className="section-padding bg-gradient-section">
      <div className="container-professional">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-section-title font-heading text-uti-dark mb-4">
            Nossos Serviços Especializados
          </h2>
          <p className="text-lg text-uti-gray max-w-2xl mx-auto">
            Mais de 10 anos oferecendo os melhores serviços em games para Colatina e região
          </p>
        </div>
        
        {/* Service Cards Grid */}
        <div className="grid-services">
          {serviceCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.link_url)}
              className="card-service cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-8 text-center h-full flex flex-col">
                {/* Service Icon/Image */}
                <div className="mb-6 flex-shrink-0">
                  <div className="relative w-16 h-16 mx-auto">
                    <img
                      src={card.image_url}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=64&h=64&fit=crop';
                      }}
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-uti-red/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                
                {/* Service Title */}
                <h3 className="text-card-title font-heading text-uti-dark mb-3 group-hover:text-uti-red transition-colors duration-300">
                  {card.title}
                </h3>
                
                {/* Service Description */}
                <p className="text-uti-gray text-sm leading-relaxed mb-6 flex-grow">
                  {card.description}
                </p>
                
                {/* Call to Action */}
                <div className="flex items-center justify-center text-uti-red group-hover:text-red-700 transition-colors duration-300 font-medium text-sm">
                  <span>Saiba mais</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              {/* Subtle bottom border accent */}
              <div className="h-1 bg-gradient-to-r from-transparent via-uti-red to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="bg-white rounded-2xl shadow-professional p-8 max-w-2xl mx-auto border border-gray-100">
            <h3 className="text-xl font-heading text-uti-dark mb-4">
              Precisa de ajuda especializada?
            </h3>
            <p className="text-uti-gray mb-6">
              Nossa equipe está pronta para atender você. Entre em contato via WhatsApp!
            </p>
            <button
              onClick={() => window.open('https://wa.me/5527996882090', '_blank')}
              className="btn-primary inline-flex items-center"
            >
              <span>Falar no WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
