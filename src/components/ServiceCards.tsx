
import { useServiceCards } from '@/hooks/useServiceCards';
import { useNavigate } from 'react-router-dom';

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
      <section className="py-8 bg-gray-50">
        <div className="px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
                <div className="bg-gray-200 h-20 rounded-lg mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded"></div>
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
    <section className="py-8 bg-gray-50">
      <div className="px-4">
        <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
          🎮 Nossos Serviços
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {serviceCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.link_url)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 text-center"
            >
              <div className="mb-3">
                <img
                  src={card.image_url}
                  alt={card.title}
                  className="w-16 h-16 mx-auto object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop';
                  }}
                />
              </div>
              
              <h3 className="font-bold text-gray-800 text-sm mb-1">
                {card.title}
              </h3>
              
              <p className="text-gray-600 text-xs leading-tight">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
