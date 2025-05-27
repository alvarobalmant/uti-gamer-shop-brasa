
import { Truck, CreditCard, Shield, Headphones } from 'lucide-react';

const ServiceCards = () => {
  const services = [
    {
      icon: Truck,
      title: 'Frete Grátis',
      description: 'Acima de R$ 200',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: CreditCard,
      title: 'Parcelamento',
      description: 'Até 12x sem juros',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Shield,
      title: 'Garantia',
      description: 'Produtos originais',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Headphones,
      title: 'Suporte',
      description: '10+ anos de experiência',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <section className="w-full py-8 bg-gray-50">
      <div className="container-professional">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 text-center"
            >
              <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mx-auto mb-4`}>
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile Layout - 2 columns grid */}
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center"
            >
              <div className={`w-10 h-10 rounded-full ${service.color} flex items-center justify-center mx-auto mb-3`}>
                <service.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{service.title}</h3>
              <p className="text-xs text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
