import { SneakerProduct, Review, Coupon } from '../types';
import vantaRunnerFlagship from '../assets/images/vanta_flagship_sneaker_1789583432569.jpg';
import vantaStreetCasual from '../assets/images/vanta_street_sneaker_1789583461343.jpg';
import vantaCarbonBanner from '../assets/images/vanta_carbon_banner_1789583447449.jpg';

export const INITIAL_PRODUCTS: SneakerProduct[] = [
  {
    id: 'vanta-runner-x1',
    sku: 'VNTA-RN-001',
    name: 'Vanta Runner X1',
    brand: 'VANTA LAB',
    tagline: 'Ultralight kinetic cushioning engineered for the avant-garde.',
    price: 240,
    originalPrice: 280,
    category: 'running',
    gender: 'unisex',
    collection: 'Carbon Series',
    isNew: true,
    isSale: true,
    isBestSeller: true,
    isTrending: true,
    rating: 4.9,
    reviewCount: 142,
    releaseDate: '2025-01-15',
    colors: [
      { name: 'Obsidian Black', hex: '#111111', imageIndex: 0 },
      { name: 'Bone White', hex: '#EAE8E3', imageIndex: 1 },
      { name: 'Graphite Grey', hex: '#4A4B4D', imageIndex: 2 }
    ],
    sizes: [
      { size: 'US 6', stock: 4 },
      { size: 'US 6.5', stock: 5 },
      { size: 'US 7', stock: 7 },
      { size: 'US 7.5', stock: 9 },
      { size: 'US 8', stock: 12 },
      { size: 'US 8.5', stock: 15 },
      { size: 'US 9', stock: 18 },
      { size: 'US 9.5', stock: 14 },
      { size: 'US 10', stock: 16 },
      { size: 'US 10.5', stock: 10 },
      { size: 'US 11', stock: 8 },
      { size: 'US 11.5', stock: 6 },
      { size: 'US 12', stock: 9 },
      { size: 'US 12.5', stock: 4 },
      { size: 'US 13', stock: 6 },
      { size: 'US 14', stock: 5 },
      { size: 'US 15', stock: 3 },
      { size: 'US 16', stock: 2 }
    ],
    images: [
      vantaRunnerFlagship,
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The Vanta Runner X1 represents the pinnacle of aerodynamic footwear engineering. Featuring a custom dual-density carbon propulsion plate embedded within an aerated nitrogen-infused foam midsole, this silhouette bridges brutalist streetwear geometry with marathon-grade cadence stability.',
    details: [
      'Custom woven ballistic micro-mesh upper with thermal TPU overlays',
      'Embedded full-length carbon fiber propulsion chassis',
      'Vibram Megagrip high-traction lugged outsole pattern',
      'Ergonomic memory-molded ankle collar and seamless tongue'
    ],
    materials: [
      'Upper: 70% Recycled Engineered Polyamide, 30% TPU',
      'Midsole: Supercritical Nitrogen Foam + 3K Carbon Plate',
      'Outsole: 100% Vulcanized Vibram Rubber'
    ]
  },
  {
    id: 'vanta-street-pro',
    sku: 'VNTA-ST-002',
    name: 'Vanta Street Pro',
    brand: 'VANTA STUDIO',
    tagline: 'Raw luxury streetwear crafted from Tuscan tumbled leather.',
    price: 310,
    category: 'lifestyle',
    gender: 'men',
    collection: 'Street Essentials',
    isNew: true,
    isBestSeller: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 89,
    releaseDate: '2025-02-01',
    colors: [
      { name: 'Triple Vanta Black', hex: '#0a0a0a', imageIndex: 0 },
      { name: 'Chalk & Concrete', hex: '#d4d4d8', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 7', stock: 4 },
      { size: 'US 7.5', stock: 6 },
      { size: 'US 8', stock: 9 },
      { size: 'US 8.5', stock: 12 },
      { size: 'US 9', stock: 15 },
      { size: 'US 9.5', stock: 14 },
      { size: 'US 10', stock: 11 },
      { size: 'US 10.5', stock: 8 },
      { size: 'US 11', stock: 7 },
      { size: 'US 11.5', stock: 5 },
      { size: 'US 12', stock: 6 },
      { size: 'US 13', stock: 5 },
      { size: 'US 14', stock: 4 },
      { size: 'US 15', stock: 2 },
      { size: 'US 16', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Sculpted with restrained Scandinavian proportion and finished by hand in Civitanova Marche, the Street Pro elevates everyday wear through buttery grain leather, wax-coated tonal lacing, and a stealth cupsole architecture.',
    details: [
      'Vegetable-tanned full-grain Italian calfskin leather',
      'Reinforced heel counter with subtle blind-debossed serial SKU',
      'Calf leather interior lining for unmatched breathability',
      'Signature geometric tread with lateral sidewall stitching'
    ],
    materials: [
      'Upper: 100% Full-grain Italian Calfskin',
      'Lining: 100% Breathable Nappa Leather',
      'Sole: Custom Margom Monolithic Rubber'
    ]
  },
  {
    id: 'vanta-court-01',
    sku: 'VNTA-CT-003',
    name: 'Vanta Court 01',
    brand: 'VANTA ARCHIVE',
    tagline: 'Timeless tennis lineage reimagined in razor-sharp minimalism.',
    price: 195,
    originalPrice: 220,
    category: 'basketball',
    gender: 'unisex',
    collection: 'Everyday Vault',
    isSale: true,
    isTrending: false,
    rating: 4.7,
    reviewCount: 63,
    releaseDate: '2024-11-10',
    colors: [
      { name: 'Pristine White', hex: '#FFFFFF', imageIndex: 0 },
      { name: 'Forest Accent', hex: '#1C3F2B', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 5.5', stock: 4 },
      { size: 'US 6', stock: 6 },
      { size: 'US 6.5', stock: 8 },
      { size: 'US 7', stock: 10 },
      { size: 'US 7.5', stock: 12 },
      { size: 'US 8', stock: 16 },
      { size: 'US 8.5', stock: 18 },
      { size: 'US 9', stock: 22 },
      { size: 'US 9.5', stock: 17 },
      { size: 'US 10', stock: 15 },
      { size: 'US 10.5', stock: 10 },
      { size: 'US 11', stock: 9 },
      { size: 'US 11.5', stock: 6 },
      { size: 'US 12', stock: 8 },
      { size: 'US 13', stock: 5 },
      { size: 'US 14', stock: 4 },
      { size: 'US 15', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Stripping away excess branding, Court 01 is an homage to mid-century athletic footwear. Balanced with a low profile, reinforced toe vamp, and cushioned OrthoLite insole for 16-hour daily comfort.',
    details: [
      'Smooth Napa leather upper with perforated medial quarter',
      'Antibacterial moisture-wicking OrthoLite footbed',
      'Vintage-off-white cupsole with recessed grip siping',
      'Includes spare matching organic cotton woven laces'
    ],
    materials: [
      'Upper: Grade-A Napa Leather',
      'Insole: Molded OrthoLite Eco Foam',
      'Outsole: 100% Natural Gum Compound'
    ]
  },
  {
    id: 'vanta-airform',
    sku: 'VNTA-AF-004',
    name: 'Vanta Airform',
    brand: 'VANTA LAB',
    tagline: 'Futuristic breathable monofilament knit with parametric sole.',
    price: 260,
    category: 'running',
    gender: 'women',
    collection: 'Performance Lab',
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 118,
    releaseDate: '2025-02-18',
    colors: [
      { name: 'Alabaster Silk', hex: '#F0ECE1', imageIndex: 0 },
      { name: 'Onyx Shadow', hex: '#1C1C1E', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 5', stock: 6 },
      { size: 'US 5.5', stock: 7 },
      { size: 'US 6', stock: 10 },
      { size: 'US 6.5', stock: 12 },
      { size: 'US 7', stock: 16 },
      { size: 'US 7.5', stock: 14 },
      { size: 'US 8', stock: 11 },
      { size: 'US 8.5', stock: 9 },
      { size: 'US 9', stock: 8 },
      { size: 'US 9.5', stock: 6 },
      { size: 'US 10', stock: 5 },
      { size: 'US 10.5', stock: 4 },
      { size: 'US 11', stock: 3 },
      { size: 'US 11.5', stock: 2 },
      { size: 'US 12', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Designed exclusively with computational zero-waste knitting, the Airform hugs the foot like a bespoke sock while offering unmatched rebound through its 3D-lattice lattice rebound cushion pods.',
    details: [
      'Single-piece computational monofilament knit',
      'Zero glue construction along midfoot tension bridge',
      'Reflective 3M threading woven into lateral quarter',
      'Featherweight 210g chassis'
    ],
    materials: [
      'Upper: 100% Recycled PET Filament',
      'Sole: 3D SLA Printed Elastomer Polymer',
      'Footbed: Bamboo Charcoal Infused Cork'
    ]
  },
  {
    id: 'vanta-retro-90',
    sku: 'VNTA-RT-005',
    name: 'Vanta Retro 90',
    brand: 'VANTA ARCHIVE',
    tagline: 'Heavyweight golden-era skate bulk mixed with luxury suede.',
    price: 225,
    category: 'skate',
    gender: 'men',
    collection: 'Retro Archive',
    isNew: false,
    isTrending: true,
    rating: 4.6,
    reviewCount: 75,
    releaseDate: '2024-10-05',
    colors: [
      { name: 'Smokey Taupe', hex: '#6D655F', imageIndex: 0 },
      { name: 'Charcoal Asphalt', hex: '#2C2D30', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 7.5', stock: 5 },
      { size: 'US 8', stock: 7 },
      { size: 'US 8.5', stock: 10 },
      { size: 'US 9', stock: 14 },
      { size: 'US 9.5', stock: 11 },
      { size: 'US 10', stock: 9 },
      { size: 'US 10.5', stock: 7 },
      { size: 'US 11', stock: 6 },
      { size: 'US 11.5', stock: 4 },
      { size: 'US 12', stock: 5 },
      { size: 'US 13', stock: 4 },
      { size: 'US 14', stock: 3 },
      { size: 'US 15', stock: 2 },
      { size: 'US 16', stock: 1 }
    ],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Channelling the rebellious grit of late-90s underground skate clubs, Retro 90 pairs heavy-nap hairy suede panels with a chunky shock-absorbing rubber outsole built to withstand brutal urban pavements.',
    details: [
      'Heavy-weight 1.8mm hairy calf suede panels',
      'Padded tongue with stash pocket and metal eyelets',
      'Double-stitched abrasion zones for skateboard durability',
      'High-durability vulcanized rubber foxing'
    ],
    materials: [
      'Upper: 100% Genuine Split Suede',
      'Lining: Heavyweight French Terry Cotton',
      'Sole: Grippy High-Density Crepe Rubber'
    ]
  },
  {
    id: 'vanta-motion',
    sku: 'VNTA-MO-006',
    name: 'Vanta Motion Knit',
    brand: 'VANTA LAB',
    tagline: 'Everyday kinetic agility with weather-sealed storm barrier.',
    price: 275,
    originalPrice: 320,
    category: 'running',
    gender: 'women',
    collection: 'Performance Lab',
    isSale: true,
    rating: 4.8,
    reviewCount: 94,
    releaseDate: '2024-12-01',
    colors: [
      { name: 'Silver Mist', hex: '#C5C6C7', imageIndex: 0 },
      { name: 'Midnight Violet', hex: '#2A2038', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 5.5', stock: 5 },
      { size: 'US 6', stock: 8 },
      { size: 'US 6.5', stock: 10 },
      { size: 'US 7', stock: 14 },
      { size: 'US 7.5', stock: 12 },
      { size: 'US 8', stock: 15 },
      { size: 'US 8.5', stock: 11 },
      { size: 'US 9', stock: 7 },
      { size: 'US 9.5', stock: 5 },
      { size: 'US 10', stock: 4 },
      { size: 'US 10.5', stock: 3 },
      { size: 'US 11', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Engineered for unpredictable city weather. An internal hydrostatic membrane stops rain and cold drafts while venting thermal humidity during sprints and commute treks.',
    details: [
      'StormShield breathable waterproof internal membrane',
      'Quick-cinch speed toggle lacing harness',
      'Reflective 360-degree perimeter branding',
      'Dual-compound shock absorbing heel bumper'
    ],
    materials: [
      'Upper: Weatherproof Cordura & Monofilament Mesh',
      'Membrane: Hydrophilic PTFE Core',
      'Sole: High-rebound EVA + Vibram Traction Lug'
    ]
  },
  {
    id: 'vanta-eclipse-limited',
    sku: 'VNTA-EC-007',
    name: 'Vanta Eclipse [DROP 04]',
    brand: 'VANTA COLLAB',
    tagline: 'Limited numbered drop of 500 pairs worldwide in collaboration with Studio Noc.',
    price: 420,
    category: 'limited',
    gender: 'unisex',
    collection: 'Limited Edition Vault',
    isLimited: true,
    isNew: true,
    rating: 5.0,
    reviewCount: 38,
    releaseDate: '2025-03-01',
    dropDate: 'March 28, 2025 - 18:00 GMT',
    colors: [
      { name: 'Matte Vanta Void', hex: '#050505', imageIndex: 0 },
      { name: 'Molten Titanium', hex: '#8F9094', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 7.5', stock: 3 },
      { size: 'US 8', stock: 4 },
      { size: 'US 8.5', stock: 6 },
      { size: 'US 9', stock: 8 },
      { size: 'US 9.5', stock: 5 },
      { size: 'US 10', stock: 4 },
      { size: 'US 10.5', stock: 3 },
      { size: 'US 11', stock: 4 },
      { size: 'US 11.5', stock: 2 },
      { size: 'US 12', stock: 3 },
      { size: 'US 13', stock: 2 },
      { size: 'US 14', stock: 2 },
      { size: 'US 15', stock: 1 }
    ],
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
      vantaRunnerFlagship,
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An art piece meant for the feet. Featuring aerospace-grade titanium speed lace stays, individual lasered serial numbers (XXX/500), and custom display acrylic casing with RFID NFC authenticity token.',
    details: [
      'Laser-engraved individual edition numbering (1 of 500)',
      'Built-in encrypted NFC authentication chip in tongue badge',
      'Brushed titanium hardware with custom turn-lock eyelets',
      'Accompanied by silk storage bag and certificate of provenance'
    ],
    materials: [
      'Upper: Japanese matte ballistic nylon and rubberized calfskin',
      'Hardware: Grade 5 Aircraft Titanium',
      'Sole: Monolithic Carbon Aero-Chassis'
    ]
  },
  {
    id: 'vanta-urban-low',
    sku: 'VNTA-UL-008',
    name: 'Vanta Urban Low',
    brand: 'VANTA STUDIO',
    tagline: 'Effortless everyday silhouette designed for the modern uniform.',
    price: 185,
    category: 'lifestyle',
    gender: 'men',
    collection: 'Street Essentials',
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 165,
    releaseDate: '2024-09-12',
    colors: [
      { name: 'Core Bone', hex: '#E2DFD8', imageIndex: 0 },
      { name: 'Pitch Black', hex: '#141416', imageIndex: 1 },
      { name: 'Sage Green', hex: '#7A8471', imageIndex: 2 }
    ],
    sizes: [
      { size: 'US 6.5', stock: 6 },
      { size: 'US 7', stock: 9 },
      { size: 'US 7.5', stock: 12 },
      { size: 'US 8', stock: 16 },
      { size: 'US 8.5', stock: 20 },
      { size: 'US 9', stock: 24 },
      { size: 'US 9.5', stock: 18 },
      { size: 'US 10', stock: 21 },
      { size: 'US 10.5', stock: 14 },
      { size: 'US 11', stock: 12 },
      { size: 'US 11.5', stock: 8 },
      { size: 'US 12', stock: 9 },
      { size: 'US 13', stock: 7 },
      { size: 'US 14', stock: 5 },
      { size: 'US 15', stock: 3 },
      { size: 'US 16', stock: 2 }
    ],
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Clean geometry meets daily reliability. Built with a relaxed toe box and supple leather that molds to your stride within hours of your first walk.',
    details: [
      'Subtle debossed VANTA wordmark on tongue and heel tab',
      'Reinforced perimeter stitching for longevity',
      'Shock-dampening polyurethane insole with heel cup support',
      'Non-marking traction outsole'
    ],
    materials: [
      'Upper: 100% Semi-Aniline Leather',
      'Lining: Cotton Drill Canvas',
      'Sole: 100% Recycled Natural Rubber'
    ]
  },
  {
    id: 'vanta-high-top-shadow',
    sku: 'VNTA-HT-009',
    name: 'Vanta High-Top Shadow',
    brand: 'VANTA STUDIO',
    tagline: 'Architectural high-collar profile with industrial side-zip entry.',
    price: 340,
    originalPrice: 390,
    category: 'luxury',
    gender: 'unisex',
    collection: 'Street Essentials',
    isSale: true,
    rating: 4.9,
    reviewCount: 52,
    releaseDate: '2024-11-20',
    colors: [
      { name: 'Shadow Black', hex: '#0f0f10', imageIndex: 0 },
      { name: 'Oat Milk', hex: '#dcd7cd', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 7', stock: 3 },
      { size: 'US 7.5', stock: 5 },
      { size: 'US 8', stock: 7 },
      { size: 'US 8.5', stock: 9 },
      { size: 'US 9', stock: 12 },
      { size: 'US 9.5', stock: 10 },
      { size: 'US 10', stock: 11 },
      { size: 'US 10.5', stock: 8 },
      { size: 'US 11', stock: 7 },
      { size: 'US 11.5', stock: 5 },
      { size: 'US 12', stock: 6 },
      { size: 'US 13', stock: 4 },
      { size: 'US 14', stock: 3 },
      { size: 'US 15', stock: 2 },
      { size: 'US 16', stock: 1 }
    ],
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
      vantaStreetCasual,
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Commanding attention with towering proportions and an asymmetric RiRi Swiss metal zipper for effortless entry without untying laces. Crafted from supple buffalo leather.',
    details: [
      'High padded collar with dual Achilles cushions',
      'RiRi M6 heavy-duty side zipper with leather pull',
      'Extended tongue with debossed typographic branding',
      'Thickened 35mm geometric midsole platform'
    ],
    materials: [
      'Upper: Drum-dyed Italian Buffalo Hide',
      'Zipper: Solid Brass RiRi M6',
      'Outsole: Natural Crepe & Rubber Hybrid'
    ]
  },
  {
    id: 'vanta-junior-glide',
    sku: 'VNTA-JR-010',
    name: 'Vanta Junior Glide',
    brand: 'VANTA KIDS',
    tagline: 'Uncompromising craft scaled down for young explorers.',
    price: 130,
    category: 'lifestyle',
    gender: 'kids',
    collection: 'Everyday Vault',
    isNew: true,
    rating: 4.8,
    reviewCount: 41,
    releaseDate: '2025-01-08',
    colors: [
      { name: 'Arctic White & Silver', hex: '#e8e8ed', imageIndex: 0 },
      { name: 'Cosmic Black', hex: '#1e1e24', imageIndex: 1 }
    ],
    sizes: [
      { size: 'US 1Y', stock: 8 },
      { size: 'US 1.5Y', stock: 10 },
      { size: 'US 2Y', stock: 12 },
      { size: 'US 2.5Y', stock: 11 },
      { size: 'US 3Y', stock: 15 },
      { size: 'US 3.5Y', stock: 14 },
      { size: 'US 4Y', stock: 16 },
      { size: 'US 4.5Y', stock: 13 },
      { size: 'US 5Y', stock: 12 },
      { size: 'US 5.5Y', stock: 9 },
      { size: 'US 6Y', stock: 7 }
    ],
    images: [
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Because next-generation creators deserve adult-grade footwear. The Junior Glide incorporates elastic speed bungee lacing and scuff-resistant toe caps.',
    details: [
      'Stretch elastic quick-lace with locking magnetic clasp',
      'Scuff-resistant ballistic rubber toe rand',
      'Lightweight high-flex EVA midsole for developing feet',
      'Breathable antimicrobial mesh lining'
    ],
    materials: [
      'Upper: Hydrophobic Canvas & Microfiber Leather',
      'Sole: Flexible Segmented Rubber'
    ]
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'vanta-runner-x1',
    author: 'Marcus K.',
    rating: 5,
    date: '2025-02-28',
    title: 'Flawless execution. Better than anything from major brands.',
    content: 'The carbon propulsion is noticeably snappier than my previous race shoes, and the silhouette looks incredible with oversized trousers or technical shorts. The packaging felt like unboxing a high-end luxury watch.',
    verified: true,
    helpfulCount: 29
  },
  {
    id: 'rev-2',
    productId: 'vanta-runner-x1',
    author: 'Elena R.',
    rating: 5,
    date: '2025-02-14',
    title: 'True to size and unmatched comfort',
    content: 'Ordered US 8.5. Fits like a glove right out of the box. Cushioning has that rare balance of plush softness without losing stability on sharp cuts. Definitely ordering the Bone White colorway next.',
    verified: true,
    helpfulCount: 17
  },
  {
    id: 'rev-3',
    productId: 'vanta-street-pro',
    author: 'Derrick A.',
    rating: 5,
    date: '2025-02-10',
    title: 'The leather quality is staggering',
    content: 'Smells like bespoke leather upholstery. You can tell they did not cut corners on the calfskin. No creasing issues after two weeks of heavy city walking in Accra and London.',
    verified: true,
    helpfulCount: 44
  },
  {
    id: 'rev-4',
    productId: 'vanta-court-01',
    author: 'Jordan T.',
    rating: 4,
    date: '2025-01-22',
    title: 'Clean aesthetic, slight break-in period',
    content: 'Visually 10/10. Takes about two days of wear around the ankle to fully soften, but once broken in, this is the only white sneaker you will ever need.',
    verified: true,
    helpfulCount: 12
  }
];

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'VANTA10',
    discountPercentage: 10,
    description: '10% off your inaugural order',
    active: true
  },
  {
    code: 'FREESHIP',
    discountPercentage: 0,
    description: 'Complimentary Worldwide Express Delivery',
    active: true
  },
  {
    code: 'VIPCLUB',
    discountPercentage: 15,
    description: 'VIP Collector 15% drop discount',
    minSpend: 250,
    active: true
  }
];

export const SNEAKER_COLLECTIONS = [
  {
    id: 'carbon-series',
    title: 'Carbon Series',
    subtitle: 'High-Velocity Propulsion',
    image: vantaCarbonBanner,
    itemCount: 4,
    description: 'Embedded carbon composite plates meeting aerospace foam.'
  },
  {
    id: 'street-essentials',
    title: 'Street Essentials',
    subtitle: 'Tuscan Leather & Brutalist Proportions',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    itemCount: 6,
    description: 'Designed for the concrete jungle. Understated, resilient, iconic.'
  },
  {
    id: 'limited-vault',
    title: 'The Limited Vault',
    subtitle: 'Numbered Collector Editions',
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80',
    itemCount: 2,
    description: 'Restricted runs of 500 or fewer pairs worldwide. Each piece stamped with individual serial provenance.'
  },
  {
    id: 'retro-archive',
    title: 'Retro Archive',
    subtitle: '90s Skate & Court Heritage',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80',
    itemCount: 5,
    description: 'Reconstructed vintage volumes honoring the golden era of subcultural sneaker design.'
  }
];
