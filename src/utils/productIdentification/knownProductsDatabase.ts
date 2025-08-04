import { KnownProductData } from './types';

export const knownProductsDatabase: KnownProductData[] = [
  // PlayStation Products
  {
    id: 'ps5',
    name: 'PlayStation 5',
    brand: 'Sony',
    category: 'Consoles',
    aliases: ['ps5', 'playstation 5', 'sony ps5'],
    variants: ['Standard', 'Digital Edition'],
    standardSpecs: {
      platform: 'PlayStation 5',
      resolution: '4K',
      storage: '825GB SSD',
      ray_tracing: true
    }
  },
  {
    id: 'ps4',
    name: 'PlayStation 4',
    brand: 'Sony',
    category: 'Consoles',
    aliases: ['ps4', 'playstation 4', 'sony ps4'],
    variants: ['Standard', 'Pro', 'Slim'],
    standardSpecs: {
      platform: 'PlayStation 4',
      resolution: '1080p/4K',
      storage: '500GB/1TB HDD'
    }
  },
  
  // Xbox Products
  {
    id: 'xbox-series-x',
    name: 'Xbox Series X',
    brand: 'Microsoft',
    category: 'Consoles',
    aliases: ['xbox series x', 'series x', 'microsoft xbox series x'],
    standardSpecs: {
      platform: 'Xbox Series X',
      resolution: '4K',
      storage: '1TB SSD',
      ray_tracing: true
    }
  },
  {
    id: 'xbox-series-s',
    name: 'Xbox Series S',
    brand: 'Microsoft',
    category: 'Consoles',
    aliases: ['xbox series s', 'series s', 'microsoft xbox series s'],
    standardSpecs: {
      platform: 'Xbox Series S',
      resolution: '1440p',
      storage: '512GB SSD',
      ray_tracing: true
    }
  },
  
  // Nintendo Products
  {
    id: 'nintendo-switch',
    name: 'Nintendo Switch',
    brand: 'Nintendo',
    category: 'Consoles',
    aliases: ['switch', 'nintendo switch', 'switch oled'],
    variants: ['Original', 'Lite', 'OLED'],
    standardSpecs: {
      platform: 'Nintendo Switch',
      resolution: '720p/1080p',
      storage: '32GB/64GB',
      portable: true
    }
  },
  
  // Popular Games
  {
    id: 'fifa-24',
    name: 'FIFA 24',
    brand: 'EA Sports',
    category: 'Games',
    aliases: ['fifa 24', 'ea sports fifa 24', 'fifa 2024'],
    variants: ['Standard', 'Ultimate'],
    standardSpecs: {
      genre: 'Sports',
      multiplayer: true,
      platforms: ['PS5', 'PS4', 'Xbox Series X/S', 'Xbox One', 'PC']
    }
  },
  {
    id: 'call-of-duty-mw3',
    name: 'Call of Duty: Modern Warfare III',
    brand: 'Activision',
    category: 'Games',
    aliases: ['cod mw3', 'modern warfare 3', 'call of duty mw3'],
    standardSpecs: {
      genre: 'FPS',
      multiplayer: true,
      rating: 'M'
    }
  },
  {
    id: 'cyberpunk-2077',
    name: 'Cyberpunk 2077',
    brand: 'CD Projekt Red',
    category: 'Games',
    aliases: ['cyberpunk', 'cyberpunk 2077', 'cp2077'],
    variants: ['Standard', 'Ultimate'],
    standardSpecs: {
      genre: 'RPG',
      open_world: true,
      rating: 'M'
    }
  },
  
  // Gaming Peripherals - Logitech
  {
    id: 'logitech-g502',
    name: 'Logitech G502 HERO',
    brand: 'Logitech',
    category: 'Periféricos',
    aliases: ['g502', 'logitech g502', 'g502 hero'],
    standardSpecs: {
      type: 'Gaming Mouse',
      dpi: '25600',
      buttons: '11',
      rgb: true
    }
  },
  {
    id: 'logitech-g915',
    name: 'Logitech G915 TKL',
    brand: 'Logitech',
    category: 'Periféricos',
    aliases: ['g915', 'logitech g915', 'g915 tkl'],
    standardSpecs: {
      type: 'Mechanical Keyboard',
      wireless: true,
      rgb: true,
      switches: 'Low Profile'
    }
  },
  
  // Gaming Peripherals - Razer
  {
    id: 'razer-deathadder-v3',
    name: 'Razer DeathAdder V3',
    brand: 'Razer',
    category: 'Periféricos',
    aliases: ['deathadder v3', 'razer deathadder', 'deathadder'],
    standardSpecs: {
      type: 'Gaming Mouse',
      dpi: '30000',
      buttons: '8',
      rgb: true
    }
  },
  
  // Funko Pop Collections
  {
    id: 'funko-pop-batman',
    name: 'Funko Pop! Batman',
    brand: 'Funko',
    category: 'Colecionáveis',
    aliases: ['funko batman', 'pop batman', 'batman funko'],
    variants: ['Classic', 'Dark Knight', 'Animated'],
    standardSpecs: {
      type: 'Collectible Figure',
      size: '3.75 inches',
      material: 'Vinyl'
    }
  },
  {
    id: 'funko-pop-pokemon',
    name: 'Funko Pop! Pokémon',
    brand: 'Funko',
    category: 'Colecionáveis',
    aliases: ['funko pokemon', 'pop pokemon', 'pokemon funko'],
    variants: ['Pikachu', 'Charizard', 'Squirtle', 'Bulbasaur'],
    standardSpecs: {
      type: 'Collectible Figure',
      size: '3.75 inches',
      material: 'Vinyl'
    }
  },
  
  // Tech Products
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'Smartphones',
    aliases: ['iphone 15', 'apple iphone 15'],
    variants: ['128GB', '256GB', '512GB'],
    standardSpecs: {
      screen: '6.1 inch',
      camera: '48MP',
      storage: ['128GB', '256GB', '512GB'],
      connectivity: 'USB-C'
    }
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro',
    brand: 'Apple',
    category: 'Áudio',
    aliases: ['airpods pro', 'apple airpods pro'],
    variants: ['2nd Generation', '3rd Generation'],
    standardSpecs: {
      type: 'Wireless Earbuds',
      noise_cancellation: true,
      battery_life: '6 hours',
      case_battery: '30 hours'
    }
  }
];