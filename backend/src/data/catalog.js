// Catálogo de Datos Oficial para la Plataforma VI CITY
// Responsable: Alexsander Rosales (Backend Developer)

const RELEASE_DATE = '2026-05-26T00:00:00Z';
const PRELOAD_DATE = '2026-05-22T00:00:00Z';
const CHARGE_DATE = '2026-05-19T00:00:00Z';

const PLATFORMS = [
  { id: 'ps5', name: 'PlayStation 5', short: 'PS5', icon: '🎮', active: true },
  { id: 'xbox', name: 'Xbox Series X|S', short: 'Xbox', icon: '🟢', active: true },
  { id: 'pc', name: 'PC / Launcher VI CITY', short: 'PC', icon: '💻', active: true }
];

const EDITIONS = [
  {
    id: 'standard',
    name: 'Standard Edition',
    tagline: 'La experiencia base completa.',
    priceDigital: 69990,
    pricePhysical: 74990,
    featured: false,
    color: 'accent',
    bonuses: [
      'Juego completo GTA VI',
      'Paquete de inicio: $500.000 in-game',
      'Vehículo "Sentinel Classic"'
    ]
  },
  {
    id: 'deluxe',
    name: 'Deluxe Edition',
    tagline: 'Bonus digitales + acceso anticipado.',
    priceDigital: 89990,
    pricePhysical: 94990,
    featured: true,
    color: 'pink',
    bonuses: [
      'Todo lo de Standard',
      'Acceso anticipado de 72 horas',
      'Paquete Vice: $1.500.000 in-game',
      'Garaje exclusivo: 3 vehículos deportivos',
      'Pase de temporada (Temporada 1)'
    ]
  },
  {
    id: 'collector',
    name: "Collector's Edition",
    tagline: 'La edición definitiva física y numerada.',
    priceDigital: null,
    pricePhysical: 189990,
    featured: false,
    color: 'yellow',
    bonuses: [
      'Todo lo de Deluxe',
      'Caja metálica SteelBook numerada',
      'Estatua de resina "Lucia & Jason" (25 cm)',
      'Mapa en tela de Leonida + pines',
      'Banda sonora oficial en vinilo doble'
    ]
  }
];

const EXTRAS = [
  { id: 'steelbook', name: 'SteelBook exclusivo', price: 14990, physicalOnly: true },
  { id: 'guide', name: 'Guía oficial de coleccionista (300 págs.)', price: 24990, physicalOnly: false },
  { id: 'soundtrack', name: 'Banda Sonora Original (Vinilo)', price: 34990, physicalOnly: true },
  { id: 'vip-pass', name: 'Pase VIP Multijugador (Año 1)', price: 29990, physicalOnly: false }
];

module.exports = {
  RELEASE_DATE,
  PRELOAD_DATE,
  CHARGE_DATE,
  PLATFORMS,
  EDITIONS,
  EXTRAS
};
