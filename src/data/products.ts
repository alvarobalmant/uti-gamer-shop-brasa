
import { Product } from '@/components/ProductCard';

export const products: Product[] = [
  {
    id: 1,
    name: "God of War Ragnarök",
    description: "Embarque na jornada épica de Kratos e Atreus em Midgard! Uma aventura nórdica inesquecível.",
    price: 149.90,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "PS5",
    category: "Jogos"
  },
  {
    id: 2,
    name: "Controle DualSense",
    description: "Controle wireless oficial PlayStation 5 com feedback háptico e gatilhos adaptativos revolucionários.",
    price: 399.90,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Branco", "Preto", "Azul Cósmico", "Rosa Nova", "Roxo Galático"],
    platform: "PS5",
    category: "Acessórios"
  },
  {
    id: 3,
    name: "Mario Kart 8 Deluxe",
    description: "O melhor jogo de corrida com os personagens da Nintendo! Diversão garantida para toda família.",
    price: 299.90,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "Nintendo Switch",
    category: "Jogos"
  },
  {
    id: 4,
    name: "Halo Infinite",
    description: "A maior aventura do Master Chief em mundo aberto! Multiplayer gratuito e campanha épica.",
    price: 199.90,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "Xbox Series X",
    category: "Jogos"
  },
  {
    id: 5,
    name: "Headset Gamer RGB",
    description: "Som surround 7.1 com iluminação RGB customizável. Conforto premium para longas sessões de jogo.",
    price: 249.90,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Preto", "Branco", "Verde Neon"],
    platform: "Multi",
    category: "Acessórios"
  },
  {
    id: 6,
    name: "The Last of Us Part II",
    description: "Continue a jornada emocional de Ellie neste exclusivo PS4/PS5. História tocante e gameplay aprimorado.",
    price: 129.90,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "PS4/PS5",
    category: "Jogos"
  },
  {
    id: 7,
    name: "Cyberpunk 2077",
    description: "RPG futurista em Night City com gráficos impressionantes e múltiplas escolhas narrativas.",
    price: 179.90,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop",
    sizes: ["Físico", "Digital"],
    colors: [],
    platform: "Multi",
    category: "Jogos"
  },
  {
    id: 8,
    name: "Teclado Mecânico RGB",
    description: "Teclado gamer mecânico com switches azuis, iluminação RGB individual por tecla e software customizável.",
    price: 459.90,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Preto", "Branco"],
    platform: "PC",
    category: "Acessórios"
  },
  {
    id: 9,
    name: "Mouse Gamer Pro",
    description: "Mouse gamer com sensor óptico de alta precisão, 12000 DPI, 8 botões programáveis e RGB.",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
    sizes: ["Único"],
    colors: ["Preto", "Branco"],
    platform: "PC",
    category: "Acessórios"
  }
];

export const getPlatformColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'ps5':
    case 'ps4/ps5':
      return 'bg-blue-600';
    case 'xbox series x':
      return 'bg-green-600';
    case 'nintendo switch':
      return 'bg-red-600';
    case 'pc':
      return 'bg-orange-600';
    default:
      return 'bg-purple-600';
  }
};
