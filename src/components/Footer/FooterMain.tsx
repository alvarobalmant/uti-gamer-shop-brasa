
import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FooterMain = () => {
  const navigate = useNavigate();

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: 'facebook',
      url: '#',
      color: 'hover:text-blue-500'
    },
    { 
      name: 'Instagram', 
      icon: 'instagram',
      url: '#',
      color: 'hover:text-pink-500'
    },
    { 
      name: 'YouTube', 
      icon: 'youtube',
      url: '#',
      color: 'hover:text-red-500'
    }
  ];

  const usefulLinks = [
    { name: 'PlayStation', path: '/categoria/playstation' },
    { name: 'Xbox', path: '/categoria/xbox' },
    { name: 'Nintendo', path: '/categoria/nintendo' },
    { name: 'PC Gaming', path: '/categoria/pc' },
    { name: 'Buscar Produtos', path: '/busca' }
  ];

  const categories = [
    { name: 'Jogos Novos', path: '/categoria/novos' },
    { name: 'Jogos Usados', path: '/categoria/usados' },
    { name: 'Acessórios', path: '/categoria/acessorios' },
    { name: 'Consoles', path: '/categoria/consoles' },
    { name: 'Ofertas', path: '/categoria/ofertas' }
  ];

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'PIX', icon: '⚡' },
    { name: 'Boleto', icon: '📄' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-repeat opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative">
        {/* Top Section */}
        <div className="border-b border-gray-700/50 py-12">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Logo and Slogan */}
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-red-400 mb-2">UTI DOS GAMES</h3>
                <p className="text-gray-400 text-lg">A tradição em games que você confia</p>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6">
                <span className="text-gray-400 font-medium">Siga-nos:</span>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:shadow-lg`}
                      aria-label={social.name}
                    >
                      <span className="text-xl">
                        {social.icon === 'facebook' && '📘'}
                        {social.icon === 'instagram' && '📷'}
                        {social.icon === 'youtube' && '📺'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Links Úteis */}
              <div>
                <h4 className="text-xl font-bold text-red-400 mb-6 relative">
                  Links Úteis
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-400"></div>
                </h4>
                <ul className="space-y-3">
                  {usefulLinks.map((link) => (
                    <li key={link.name}>
                      <button 
                        onClick={() => navigate(link.path)}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform block"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categorias */}
              <div>
                <h4 className="text-xl font-bold text-red-400 mb-6 relative">
                  Categorias
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-400"></div>
                </h4>
                <ul className="space-y-3">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button 
                        onClick={() => navigate(category.path)}
                        className="text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform block"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="text-xl font-bold text-red-400 mb-6 relative">
                  Contato
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-400"></div>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <Phone className="w-5 h-5 text-red-400" />
                    <span>(27) 99688-2090</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Mail className="w-5 h-5 text-red-400" />
                    <span>contato@utidosgames.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <MapPin className="w-5 h-5 text-red-400" />
                    <span>Colatina - ES</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span>Seg à Sex: 9h às 18h</span>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-xl font-bold text-red-400 mb-6 relative">
                  Newsletter
                  <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-red-400"></div>
                </h4>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Receba ofertas exclusivas e novidades em primeira mão!
                </p>
                <form className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Seu melhor e-mail"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Inscrever-se
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Copyright */}
              <div className="text-center lg:text-left">
                <p className="text-gray-400 text-sm">
                  © 2024 UTI DOS GAMES. Todos os direitos reservados.
                </p>
                <div className="flex gap-4 mt-2 justify-center lg:justify-start">
                  <button className="text-gray-400 hover:text-white text-xs transition-colors">
                    Política de Privacidade
                  </button>
                  <span className="text-gray-600">|</span>
                  <button className="text-gray-400 hover:text-white text-xs transition-colors">
                    Termos de Uso
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="text-center lg:text-right">
                <p className="text-gray-400 text-sm mb-3">Formas de pagamento:</p>
                <div className="flex gap-3 justify-center lg:justify-end">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.name}
                      className="w-12 h-8 bg-gray-800 rounded border border-gray-600 flex items-center justify-center"
                      title={method.name}
                    >
                      <span className="text-lg">{method.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMain;
