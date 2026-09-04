// ============================================================
// VI CITY — Catálogo de datos (mockup)
// ============================================================

export const RELEASE_DATE = new Date('2026-05-26T00:00:00Z');
export const PRELOAD_DATE = new Date('2026-05-22T00:00:00Z');
export const CHARGE_DATE = new Date('2026-05-19T00:00:00Z');

export const PLATFORMS = [
  { id: 'ps5',   name: 'PlayStation 5',          short: 'PS5',   icon: '🎮' },
  { id: 'xbox',  name: 'Xbox Series X|S',        short: 'Xbox',  icon: '🟢' },
  { id: 'pc',    name: 'PC / Launcher VI CITY',  short: 'PC',    icon: '💻' },
];

export const EDITIONS = [
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
      'Vehículo "Sentinel Classic"',
    ],
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
      'Pase de temporada (Temporada 1)',
    ],
  },
  {
    id: 'collector',
    name: "Collector's / Vice Edition",
    tagline: 'Edición física coleccionable limitada.',
    priceDigital: 0,
    pricePhysical: 149990,
    featured: false,
    color: 'violet',
    physicalOnly: true,
    bonuses: [
      'Todo lo de Deluxe',
      'Caja Steelbook grabada',
      'Mapa físico de Vice City (tela)',
      'Figura coleccionable "Jason & Lucia"',
      'Banda sonora original en vinilo',
      'Libro de arte tapa dura (96 págs.)',
    ],
  },
];

export const EXTRAS = [
  { id: 'guide',      name: 'Guía Coleccionista',          price: 24990, icon: '📘' },
  { id: 'season',     name: 'Pase de Temporada (Completo)', price: 39990, icon: '🎟️' },
  { id: 'merch',      name: 'Bundle Merch (Gorra + Póster)', price: 29990, icon: '🧢' },
  { id: 'soundtrack', name: 'Banda Sonora Digital',         price: 12990, icon: '🎵' },
];

export const TRAILERS = [
  { id: 't1', title: 'Tráiler Oficial 1', thumb: 'gradient-a', year: '2025' },
  { id: 't2', title: 'Tráiler de Gameplay', thumb: 'gradient-b', year: '2026' },
  { id: 't3', title: 'Vice City Showcase', thumb: 'gradient-c', year: '2026' },
];

export const SCREENSHOTS = [
  { id: 's1', title: 'Atardecer en Vice Beach',   thumb: 'gradient-a' },
  { id: 's2', title: 'Persecución downtown',      thumb: 'gradient-b' },
  { id: 's3', title: 'Club nocturno',             thumb: 'gradient-c' },
  { id: 's4', title: 'Pantano Leonida',           thumb: 'gradient-d' },
  { id: 's5', title: 'Mansión Vice Hills',        thumb: 'gradient-e' },
  { id: 's6', title: 'Puerto marítimo',           thumb: 'gradient-f' },
];

export const SYS_REQ = {
  min: [
    ['SO', 'Windows 10 (64-bit)'],
    ['CPU', 'Intel Core i5-6600K / AMD Ryzen 5 1600'],
    ['RAM', '8 GB DDR4'],
    ['GPU', 'NVIDIA GTX 1660 / AMD RX 590 (4 GB)'],
    ['Almacenamiento', '120 GB SSD'],
    ['DirectX', 'Versión 12'],
  ],
  rec: [
    ['SO', 'Windows 11 (64-bit)'],
    ['CPU', 'Intel Core i7-9700K / AMD Ryzen 5 5600X'],
    ['RAM', '16 GB DDR4'],
    ['GPU', 'NVIDIA RTX 4060 / AMD RX 7600 (8 GB)'],
    ['Almacenamiento', '120 GB NVMe SSD'],
    ['DirectX', 'Versión 12 con Ray Tracing'],
  ],
};

export const RATING = {
  esrb: { code: 'RP', label: 'Rating Pending (ESRB)', desc: 'Título aún no clasificado. Se espera M (Mature 17+).' },
  pegi: { code: '18', label: 'PEGI 18', desc: 'Violencia extrema, lenguaje soez, contenido sexualizado.' },
};

export const LEGAL = [
  'No se realiza el cobro hasta 7 días antes del lanzamiento (19/05/2026).',
  'Reserva asegurada con política de reembolso hasta el Día 1 (26/05/2026).',
  'Las claves digitales se revelan el 22/05/2026 a las 00:00 UTC (Pre-load).',
  'Las ediciones físicas se envían para llegar el día de lanzamiento.',
  'Rockstar Games no está afiliado a este mockup académico.',
];

export function formatCLP(value) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value);
}

export function editionById(id) { return EDITIONS.find(e => e.id === id); }
export function extraById(id) { return EXTRAS.find(e => e.id === id); }
export function platformById(id) { return PLATFORMS.find(p => p.id === id); }
