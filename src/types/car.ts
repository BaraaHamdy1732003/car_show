export interface ComponentHotspot {
  id: string;
  name: string;
  position3D: [number, number, number]; // [x, y, z] for 3D positioning
  screenXPercent?: number; // 2D fallback percentage
  screenYPercent?: number;
  description: string;
  materials: string;
  functionality: string;
  specialTech: string;
  image?: string;
  category: 'aerodynamics' | 'powertrain' | 'chassis' | 'lighting' | 'exterior';
}

export interface InteriorHotspot {
  id: string;
  name: string;
  xPercent: number; // percentage in interior view
  yPercent: number;
  description: string;
  materials: string;
  functionality: string;
  specialTech: string;
  image?: string;
}

export interface ExteriorColorOption {
  name: string;
  hex: string;
  finish: 'Metallic' | 'Gloss' | 'Matte' | 'Pearl';
}

export interface Car {
  id: string;
  manufacturer: string;
  model: string;
  year: number;
  category:
    | 'Supercars'
    | 'Hypercars'
    | 'Sports Cars'
    | 'Luxury Sedans'
    | 'Luxury SUVs'
    | 'Electric Vehicles'
    | 'Muscle Cars'
    | 'Classic Cars'
    | 'Racing Cars'
    | 'Off-Road Vehicles'
    | 'Grand Tourers'
    | 'Concept Cars';
  tagline: string;
  description: string;
  price: number;
  priceDisplay: string;
  heroImage: string;
  gallery: string[];
  country: string;
  countryCode: string;
  featured: boolean;
  podiumSpot?: {
    podiumNumber: number;
    wing: string;
    spotlightColor: string;
    floorX: number; // exhibition floor x position percentage
    floorY: number; // exhibition floor y position percentage
  };
  engine: {
    configuration: string;
    displacement: string;
    horsepower: number;
    torque: string;
    transmission: string;
    drivetrain: 'RWD' | 'AWD' | 'FWD';
    topSpeedKmH: number;
    acceleration0100: number; // 0-100 km/h in seconds
    fuelConsumption: string;
    engineType: 'V8' | 'V12' | 'V10' | 'V6' | 'Flat-6' | 'W16' | 'Electric' | 'Hybrid';
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    weightKg: number;
    cargoCapacity: string;
  };
  equipment: {
    exteriorColors: ExteriorColorOption[];
    interiorMaterials: string[];
    wheelOptions: string[];
    lightingTechnology: string;
    infotainmentSystem: string;
    safetyFeatures: string[];
    driverAssistanceSystems: string[];
  };
  soundProfile: {
    type: 'v8-twin-turbo' | 'v12-na' | 'v10' | 'flat6' | 'electric-hyper' | 'w16';
    idleRpm: number;
    redlineRpm: number;
  };
  exteriorHotspots: ComponentHotspot[];
  interiorHotspots: InteriorHotspot[];
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  flag: string;
  founded: number;
  headquarters: string;
  description: string;
  accentColor: string;
}

export interface Category {
  id: string;
  name: Car['category'];
  description: string;
  iconName: string;
}
