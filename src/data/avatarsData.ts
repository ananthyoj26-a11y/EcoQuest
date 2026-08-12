/**
 * EcoQuest Gaming Avatars & Customization System
 * Contains 28 visually distinct gaming avatars organized across 4 categories:
 * - ECO HEROES
 * - FUTURISTIC
 * - ADVENTURE
 * - CAMPUS
 */

export interface AvatarCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GamingAvatar {
  id: string;
  name: string;
  title: string;
  category: 'ECO HEROES' | 'FUTURISTIC' | 'ADVENTURE' | 'CAMPUS';
  description: string;
  bgGradient: string;
  primaryColor: string;
  accentColor: string;
  badgeIcon: string;
  defaultCustomization: AvatarCustomization;
  unlockedByDefault: boolean;
  requiredLevel?: number;
}

export interface AvatarCustomization {
  hairstyle: string;
  outfit: string;
  skinTone: string;
  hairColor: string;
  accessory: string;
  backpack: string;
  glasses: string;
  helmet: string;
  ecoBadge: string;
  aura: string;
  shoes: string;
}

export interface CustomizationOption {
  id: string;
  name: string;
  category: keyof AvatarCustomization;
  icon: string;
  previewColor?: string;
  requiredLevel?: number;
  unlockedByDefault?: boolean;
}

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  { id: 'ECO HEROES', name: 'ECO HEROES', description: 'Elemental defenders of green biomes', icon: 'ShieldCheck' },
  { id: 'FUTURISTIC', name: 'FUTURISTIC', description: 'Cybernetic pioneers & green tech engineers', icon: 'Cpu' },
  { id: 'ADVENTURE', name: 'ADVENTURE', description: 'Wilderness rangers & deep biome explorers', icon: 'Compass' },
  { id: 'CAMPUS', name: 'CAMPUS', description: 'Student leaders & sustainability champions', icon: 'GraduationCap' }
];

export const GAMING_AVATARS: GamingAvatar[] = [
  // --- ECO HEROES ---
  {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    title: 'Warden of Canopy & Flora',
    category: 'ECO HEROES',
    description: 'Master of ancient woodland spirits and canopy reforestation drives.',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-900',
    primaryColor: '#10B981',
    accentColor: '#B8E65A',
    badgeIcon: 'Trees',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Forest Braids',
      outfit: 'Leaf-Weave Cloak',
      skinTone: 'Warm Olive',
      hairColor: 'Emerald Green',
      accessory: 'Leaf Crown',
      backpack: 'Standard Bag',
      glasses: 'None',
      helmet: 'None',
      ecoBadge: 'Sprout Emblem',
      aura: 'Green Bio-Aura',
      shoes: 'Trail Boots'
    }
  },
  {
    id: 'solar_ranger',
    name: 'Solar Ranger',
    title: 'Harvester of Photons',
    category: 'ECO HEROES',
    description: 'Harnesses solar radiation to power campus renewable energy arrays.',
    bgGradient: 'from-amber-950 via-orange-900 to-slate-900',
    primaryColor: '#F59E0B',
    accentColor: '#FDE047',
    badgeIcon: 'Sun',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Solar Crop',
      outfit: 'Solar Armor',
      skinTone: 'Tan',
      hairColor: 'Solar Gold',
      accessory: 'Solar Headband',
      backpack: 'Solar Battery Pack',
      glasses: 'Glow Visor',
      helmet: 'None',
      ecoBadge: 'Sun Pin',
      aura: 'Solar Flare Aura',
      shoes: 'Hover Soles'
    }
  },
  {
    id: 'water_guardian',
    name: 'Water Guardian',
    title: 'Protector of Hydro Networks',
    category: 'ECO HEROES',
    description: 'Monitors campus rainwater harvesting & purifies aquatic reserves.',
    bgGradient: 'from-cyan-950 via-blue-900 to-slate-900',
    primaryColor: '#06B6D4',
    accentColor: '#38BDF8',
    badgeIcon: 'Droplets',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Ocean Waves',
      outfit: 'Hydro Suits',
      skinTone: 'Fair',
      hairColor: 'Deep Cyan',
      accessory: 'Tide Crest',
      backpack: 'Hydro Reservoir',
      glasses: 'Aqua Visor',
      helmet: 'None',
      ecoBadge: 'Water Drop',
      aura: 'Hydro Ring',
      shoes: 'Water Walkers'
    }
  },
  {
    id: 'earth_warrior',
    name: 'Earth Warrior',
    title: 'Soil & Composting Specialist',
    category: 'ECO HEROES',
    description: 'Transforms campus bio-waste into fertile organic soil beds.',
    bgGradient: 'from-stone-900 via-emerald-950 to-slate-900',
    primaryColor: '#84CC16',
    accentColor: '#A3E635',
    badgeIcon: 'Sprout',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Short Buzz',
      outfit: 'Organic Tunic',
      skinTone: 'Bronze',
      hairColor: 'Earth Brown',
      accessory: 'Clay Pendant',
      backpack: 'Bio-Compost Pack',
      glasses: 'None',
      helmet: 'Heavy Gauntlets',
      ecoBadge: 'Seed Badge',
      aura: 'Dust Vortex',
      shoes: 'Work Boots'
    }
  },
  {
    id: 'green_explorer',
    name: 'Green Explorer',
    title: 'Trailblazer of Biome Paths',
    category: 'ECO HEROES',
    description: 'Maps uncharted green corridors across regional ecosystems.',
    bgGradient: 'from-teal-950 via-emerald-900 to-slate-900',
    primaryColor: '#14B8A6',
    accentColor: '#6EE7B7',
    badgeIcon: 'Compass',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Eco Ponytail',
      outfit: 'Explorer Vest',
      skinTone: 'Warm',
      hairColor: 'Chestnut',
      accessory: 'Map Tube',
      backpack: 'Ranger Pack',
      glasses: 'Field Goggles',
      helmet: 'None',
      ecoBadge: 'Compass Pin',
      aura: 'Wind Ring',
      shoes: 'Hiking Boots'
    }
  },
  {
    id: 'eco_knight',
    name: 'Eco Knight',
    title: 'Champion of Zero-Waste',
    category: 'ECO HEROES',
    description: 'Shields campus sanctuaries from illegal dumping & pollution.',
    bgGradient: 'from-slate-900 via-emerald-950 to-slate-950',
    primaryColor: '#10B981',
    accentColor: '#34D399',
    badgeIcon: 'ShieldCheck',
    unlockedByDefault: false,
    requiredLevel: 5,
    defaultCustomization: {
      hairstyle: 'Sleek Cut',
      outfit: 'Recycled Steel Plate',
      skinTone: 'Deep',
      hairColor: 'Silver White',
      accessory: 'Knight Crest',
      backpack: 'Shield Mount',
      glasses: 'Visor Shield',
      helmet: 'Eco Helmet',
      ecoBadge: 'Knight Shield',
      aura: 'Shield Pulse',
      shoes: 'Armored Greaves'
    }
  },
  {
    id: 'nature_scout',
    name: 'Nature Scout',
    title: 'Fauna Monitor & Tracker',
    category: 'ECO HEROES',
    description: 'Catalogues bird species and protects native pollinators on campus.',
    bgGradient: 'from-lime-950 via-emerald-900 to-slate-900',
    primaryColor: '#65A30D',
    accentColor: '#BEF264',
    badgeIcon: 'Feather',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Wild Curls',
      outfit: 'Camouflage Tunic',
      skinTone: 'Olive',
      hairColor: 'Amber Red',
      accessory: 'Bird Whistle',
      backpack: 'Scout Pouch',
      glasses: 'Binocular Strap',
      helmet: 'None',
      ecoBadge: 'Feather Badge',
      aura: 'Sparkle Aura',
      shoes: 'Silent Moccasins'
    }
  },
  {
    id: 'planet_guardian',
    name: 'Planet Guardian',
    title: 'Supreme Climate Sentinel',
    category: 'ECO HEROES',
    description: 'Master of global climate data modeling and planetary regeneration.',
    bgGradient: 'from-[#071A14] via-emerald-950 to-[#0B2E23]',
    primaryColor: '#B8E65A',
    accentColor: '#38BDF8',
    badgeIcon: 'Globe',
    unlockedByDefault: false,
    requiredLevel: 15,
    defaultCustomization: {
      hairstyle: 'Celestial Flow',
      outfit: 'Planetary Robes',
      skinTone: 'Cyber-Glow',
      hairColor: 'Platinum White',
      accessory: 'Orbital Ring',
      backpack: 'Planet Guardian Ring',
      glasses: 'Cosmic Visor',
      helmet: 'Crown of Stars',
      ecoBadge: 'Planet Star',
      aura: 'Planet Guardian Aura',
      shoes: 'Aether Soles'
    }
  },

  // --- FUTURISTIC ---
  {
    id: 'cyber_botanist',
    name: 'Cyber Botanist',
    title: 'Synthesizer of Bio-Data',
    category: 'FUTURISTIC',
    description: 'Engineers drought-resistant urban flora using AI sensors and genetic modeling.',
    bgGradient: 'from-indigo-950 via-purple-900 to-slate-900',
    primaryColor: '#A855F7',
    accentColor: '#E879F9',
    badgeIcon: 'Cpu',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Spike Cyber',
      outfit: 'Lab Coat with LED Lines',
      skinTone: 'Fair',
      hairColor: 'Neon Cyan',
      accessory: 'Cyber Earring',
      backpack: 'Data Processor',
      glasses: 'Holographic Specs',
      helmet: 'None',
      ecoBadge: 'Bio-Chip Badge',
      aura: 'Glitch Grid',
      shoes: 'Cyber Trainers'
    }
  },
  {
    id: 'eco_engineer',
    name: 'Eco Engineer',
    title: 'Designer of Smart Micro-Grids',
    category: 'FUTURISTIC',
    description: 'Constructs automated Greywater recycling units and solar tracking systems.',
    bgGradient: 'from-slate-900 via-cyan-950 to-slate-900',
    primaryColor: '#0EA5E9',
    accentColor: '#7DD3FC',
    badgeIcon: 'Wrench',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Clean Undercut',
      outfit: 'Engineer Jumpsuit',
      skinTone: 'Warm',
      hairColor: 'Dark Obsidian',
      accessory: 'Multi-Tool Holster',
      backpack: 'Tool Rig',
      glasses: 'Safety Visor',
      helmet: 'Work Hardhat',
      ecoBadge: 'Gear Emblem',
      aura: 'Spark Glow',
      shoes: 'Steel-Toe Boots'
    }
  },
  {
    id: 'green_tech_ranger',
    name: 'Green Tech Ranger',
    title: 'Autonomous Drone Operator',
    category: 'FUTURISTIC',
    description: 'Deploys AI vision drones to detect campus thermal leaks and waste hotspots.',
    bgGradient: 'from-emerald-950 via-cyan-900 to-slate-900',
    primaryColor: '#10B981',
    accentColor: '#2DD4BF',
    badgeIcon: 'Radio',
    unlockedByDefault: false,
    requiredLevel: 8,
    defaultCustomization: {
      hairstyle: 'Tactical Fade',
      outfit: 'Stealth Bio-Suit',
      skinTone: 'Tan',
      hairColor: 'Emerald Green',
      accessory: 'Drone Controller',
      backpack: 'Drone Dock',
      glasses: 'HUD Glasses',
      helmet: 'Ranger Cap',
      ecoBadge: 'Ranger Wings',
      aura: 'Target Reticle',
      shoes: 'Tactical Boots'
    }
  },
  {
    id: 'solar_cyborg',
    name: 'Solar Cyborg',
    title: 'Integrated Photon Core',
    category: 'FUTURISTIC',
    description: 'Equipped with photovoltaic skin cells that feed directly into campus batteries.',
    bgGradient: 'from-amber-950 via-yellow-900 to-slate-900',
    primaryColor: '#EAB308',
    accentColor: '#FEF08A',
    badgeIcon: 'Zap',
    unlockedByDefault: false,
    requiredLevel: 10,
    defaultCustomization: {
      hairstyle: 'Metallic Crop',
      outfit: 'Solar Cyber Armor',
      skinTone: 'Cyber-Glow',
      hairColor: 'Gold Wire',
      accessory: 'Power Cable',
      backpack: 'Solar Capacitor',
      glasses: 'Laser Eye',
      helmet: 'Cyborg Plate',
      ecoBadge: 'Volt Symbol',
      aura: 'Lightning Halo',
      shoes: 'Mag-Lock Boots'
    }
  },
  {
    id: 'bio_tech_explorer',
    name: 'Bio-Tech Explorer',
    title: 'Microbiome Researcher',
    category: 'FUTURISTIC',
    description: 'Studies plastic-eating enzyme bacteria inside advanced bio-chambers.',
    bgGradient: 'from-purple-950 via-emerald-950 to-slate-900',
    primaryColor: '#C084FC',
    accentColor: '#34D399',
    badgeIcon: 'Dna',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Twin Buns',
      outfit: 'Bio-Hazard Suit',
      skinTone: 'Olive',
      hairColor: 'Violet Purple',
      accessory: 'DNA Helix Brooch',
      backpack: 'Vial Carrier',
      glasses: 'Microscope Visor',
      helmet: 'Respirator Mask',
      ecoBadge: 'DNA Pin',
      aura: 'Bio-Luminesce',
      shoes: 'Cleanroom Boots'
    }
  },
  {
    id: 'climate_scientist',
    name: 'Climate Scientist',
    title: 'Predictive Atmospheric Modeler',
    category: 'FUTURISTIC',
    description: 'Analyzes carbon footprints and weather patterns to optimize campus cooling.',
    bgGradient: 'from-sky-950 via-indigo-900 to-slate-900',
    primaryColor: '#38BDF8',
    accentColor: '#818CF8',
    badgeIcon: 'BarChart2',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Sleek Bob',
      outfit: 'Scientist Blazer',
      skinTone: 'Fair',
      hairColor: 'Platinum Blonde',
      accessory: 'Smart Stylus',
      backpack: 'Server Backpack',
      glasses: 'AR Specs',
      helmet: 'None',
      ecoBadge: 'Atom Pin',
      aura: 'Data Stream',
      shoes: 'Formal Oxfords'
    }
  },

  // --- ADVENTURE ---
  {
    id: 'jungle_explorer',
    name: 'Jungle Explorer',
    title: 'Rainforest Canopy Specialist',
    category: 'ADVENTURE',
    description: 'Navigates dense forest trails to map endangered flora habitats.',
    bgGradient: 'from-emerald-950 via-amber-950 to-slate-900',
    primaryColor: '#059669',
    accentColor: '#FBBF24',
    badgeIcon: 'Compass',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Messy Bun',
      outfit: 'Khaki Safari Suit',
      skinTone: 'Tan',
      hairColor: 'Auburn',
      accessory: 'Binoculars',
      backpack: 'Canvas Rucksack',
      glasses: 'Sun Shades',
      helmet: 'Pith Helmet',
      ecoBadge: 'Paw Print',
      aura: 'Leaf Whirlwind',
      shoes: 'Mud Boots'
    }
  },
  {
    id: 'mountain_ranger',
    name: 'Mountain Ranger',
    title: 'Alpine Peak Conservator',
    category: 'ADVENTURE',
    description: 'Prevents erosion on slope trails and protects high-altitude water sources.',
    bgGradient: 'from-slate-900 via-stone-900 to-emerald-950',
    primaryColor: '#64748B',
    accentColor: '#A7F3D0',
    badgeIcon: 'Mountain',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Bearded Rugged',
      outfit: 'Thermal Anorak',
      skinTone: 'Bronze',
      hairColor: 'Salt and Pepper',
      accessory: 'Ice Axe',
      backpack: 'Climbing Pack',
      glasses: 'Glacier Goggles',
      helmet: 'Beanie',
      ecoBadge: 'Peak Crest',
      aura: 'Frost Mist',
      shoes: 'Crampon Boots'
    }
  },
  {
    id: 'ocean_explorer',
    name: 'Ocean Explorer',
    title: 'Coral Reef & Marine Specialist',
    category: 'ADVENTURE',
    description: 'Dives to remove ghost nets and survey coastal plastics.',
    bgGradient: 'from-blue-950 via-cyan-900 to-slate-900',
    primaryColor: '#0284C7',
    accentColor: '#38BDF8',
    badgeIcon: 'Anchor',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Wet Slicked',
      outfit: 'Neoprene Wetsuit',
      skinTone: 'Sun-Kissed',
      hairColor: 'Dark Brown',
      accessory: 'Dive Computer',
      backpack: 'Scuba Tank',
      glasses: 'Dive Mask',
      helmet: 'None',
      ecoBadge: 'Anchor Pin',
      aura: 'Bubble Aura',
      shoes: 'Flippers'
    }
  },
  {
    id: 'desert_guardian',
    name: 'Desert Guardian',
    title: 'Arid Land Restorationist',
    category: 'ADVENTURE',
    description: 'Deploys fog harvesters and xeriscaping to green dry campus soils.',
    bgGradient: 'from-amber-950 via-stone-900 to-slate-900',
    primaryColor: '#D97706',
    accentColor: '#FDE047',
    badgeIcon: 'Sun',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Desert Wrap',
      outfit: 'Nomad Robes',
      skinTone: 'Deep Bronze',
      hairColor: 'Black',
      accessory: 'Desert Scarf',
      backpack: 'Water Canteen Unit',
      glasses: 'Sand Goggles',
      helmet: 'Head Wrap',
      ecoBadge: 'Cactus Pin',
      aura: 'Sand Whirl',
      shoes: 'Desert Boots'
    }
  },
  {
    id: 'wildlife_protector',
    name: 'Wildlife Protector',
    title: 'Biodiversity Sentinel',
    category: 'ADVENTURE',
    description: 'Rescues injured campus fauna and establishes sanctuary zones.',
    bgGradient: 'from-emerald-950 via-lime-950 to-slate-900',
    primaryColor: '#16A34A',
    accentColor: '#86EFAC',
    badgeIcon: 'Heart',
    unlockedByDefault: false,
    requiredLevel: 6,
    defaultCustomization: {
      hairstyle: 'Braided Crown',
      outfit: 'Veterinary Vest',
      skinTone: 'Warm Olive',
      hairColor: 'Dark Chestnut',
      accessory: 'First Aid Kit',
      backpack: 'Rescue Carrier',
      glasses: 'None',
      helmet: 'None',
      ecoBadge: 'Heart Paw',
      aura: 'Animal Spirits',
      shoes: 'Field Trainers'
    }
  },
  {
    id: 'eco_adventurer',
    name: 'Eco Adventurer',
    title: 'Global Expeditionist',
    category: 'ADVENTURE',
    description: 'Cycles across continents to spread zero-emission living awareness.',
    bgGradient: 'from-teal-950 via-emerald-900 to-slate-900',
    primaryColor: '#0D9488',
    accentColor: '#5EEAD4',
    badgeIcon: 'Map',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Wind-Swept',
      outfit: 'Cycling Jersey',
      skinTone: 'Tan',
      hairColor: 'Blonde',
      accessory: 'Action Cam',
      backpack: 'Pannier Pack',
      glasses: 'Sports Shades',
      helmet: 'Aero Helmet',
      ecoBadge: 'Globe Badge',
      aura: 'Wind Streak',
      shoes: 'Clipless Shoes'
    }
  },

  // --- CAMPUS ---
  {
    id: 'student_hero',
    name: 'Student Hero',
    title: 'Everyday Eco Warrior',
    category: 'CAMPUS',
    description: 'Leads canteen plastic bans and carries a reusable stainless bottle everywhere.',
    bgGradient: 'from-slate-900 via-emerald-950 to-slate-900',
    primaryColor: '#10B981',
    accentColor: '#B8E65A',
    badgeIcon: 'GraduationCap',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Casual Crop',
      outfit: 'Campus Hoodie',
      skinTone: 'Warm',
      hairColor: 'Dark Brown',
      accessory: 'Eco Bottle',
      backpack: 'Canvas Backpack',
      glasses: 'Round Specs',
      helmet: 'None',
      ecoBadge: 'Student ID Badge',
      aura: 'Sparkle Aura',
      shoes: 'Sneakers'
    }
  },
  {
    id: 'campus_explorer',
    name: 'Campus Explorer',
    title: 'QR Hunt Master',
    category: 'CAMPUS',
    description: 'Uncovers hidden eco portals behind library wings and engineering blocks.',
    bgGradient: 'from-cyan-950 via-slate-900 to-emerald-950',
    primaryColor: '#06B6D4',
    accentColor: '#A5F3FC',
    badgeIcon: 'Search',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Modern Quiff',
      outfit: 'Varsity Jacket',
      skinTone: 'Fair',
      hairColor: 'Jet Black',
      accessory: 'Campus Map',
      backpack: 'Daypack',
      glasses: 'Stylish Frames',
      helmet: 'None',
      ecoBadge: 'Explorer Pin',
      aura: 'Pulse Wave',
      shoes: 'Skate Shoes'
    }
  },
  {
    id: 'sustainability_captain',
    name: 'Sustainability Captain',
    title: 'Guild Wars Commander',
    category: 'CAMPUS',
    description: 'Rallies department squads for inter-college green raid competitions.',
    bgGradient: 'from-emerald-950 via-teal-950 to-amber-950',
    primaryColor: '#059669',
    accentColor: '#FACC15',
    badgeIcon: 'Award',
    unlockedByDefault: false,
    requiredLevel: 12,
    defaultCustomization: {
      hairstyle: 'High Top Fade',
      outfit: 'Captain Blazer with Armband',
      skinTone: 'Deep',
      hairColor: 'Black',
      accessory: 'Captain Armband',
      backpack: 'Command Bag',
      glasses: 'None',
      helmet: 'Beret',
      ecoBadge: 'Captain Star',
      aura: 'Gold Command Aura',
      shoes: 'Dress Shoes'
    }
  },
  {
    id: 'green_club_leader',
    name: 'Green Club Leader',
    title: 'Plantation Drive Coordinator',
    category: 'CAMPUS',
    description: 'Organizes weekend urban gardening and native seed-bomb workshops.',
    bgGradient: 'from-lime-950 via-emerald-900 to-slate-900',
    primaryColor: '#65A30D',
    accentColor: '#D9F99D',
    badgeIcon: 'Users',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Space Buns',
      outfit: 'Green Club Tee',
      skinTone: 'Olive',
      hairColor: 'Emerald Highlights',
      accessory: 'Megaphone',
      backpack: 'Seed Bag',
      glasses: 'Cute Glasses',
      helmet: 'Flower Crown',
      ecoBadge: 'Leaf Badge',
      aura: 'Floral Petals',
      shoes: 'Canvas Shoes'
    }
  },
  {
    id: 'eco_scholar',
    name: 'Eco Scholar',
    title: 'Environmental Policy Analyst',
    category: 'CAMPUS',
    description: 'Publishes campus sustainability research and carbon audit whitepapers.',
    bgGradient: 'from-indigo-950 via-slate-900 to-emerald-950',
    primaryColor: '#6366F1',
    accentColor: '#C7D2FE',
    badgeIcon: 'BookOpen',
    unlockedByDefault: true,
    defaultCustomization: {
      hairstyle: 'Neat Part',
      outfit: 'Academic Robes',
      skinTone: 'Fair',
      hairColor: 'Dark Ash',
      accessory: 'Research Scroll',
      backpack: 'Book Bag',
      glasses: 'Reading Glasses',
      helmet: 'Graduation Cap',
      ecoBadge: 'Scholar Quill',
      aura: 'Knowledge Orbit',
      shoes: 'Loafers'
    }
  },
  {
    id: 'campus_guardian',
    name: 'Campus Guardian',
    title: 'Faculty Sustainability Marshal',
    category: 'CAMPUS',
    description: 'Verifies faculty codes and ensures departmental carbon reduction compliance.',
    bgGradient: 'from-slate-900 via-emerald-950 to-cyan-950',
    primaryColor: '#10B981',
    accentColor: '#38BDF8',
    badgeIcon: 'Shield',
    unlockedByDefault: false,
    requiredLevel: 10,
    defaultCustomization: {
      hairstyle: 'Silver Crop',
      outfit: 'Marshal Jacket',
      skinTone: 'Warm',
      hairColor: 'Silver',
      accessory: 'Verification Badge',
      backpack: 'Marshal Pack',
      glasses: 'Tactical Specs',
      helmet: 'None',
      ecoBadge: 'Campus Shield',
      aura: 'Guardian Barrier',
      shoes: 'Duty Boots'
    }
  }
];

// --- CUSTOMIZATION OPTIONS FOR AVATAR BUILDER ---
export const CUSTOMIZATION_OPTIONS = {
  hairstyles: [
    'Forest Braids', 'Solar Crop', 'Ocean Waves', 'Short Buzz', 'Eco Ponytail',
    'Sleek Cut', 'Wild Curls', 'Spike Cyber', 'Clean Undercut', 'Tactical Fade',
    'Twin Buns', 'Messy Bun', 'Bearded Rugged', 'Wet Slicked', 'Braided Crown',
    'Casual Crop', 'High Top Fade', 'Space Buns', 'Neat Part', 'Silver Crop'
  ],
  outfits: [
    'Leaf-Weave Cloak', 'Solar Armor', 'Hydro Suits', 'Organic Tunic', 'Explorer Vest',
    'Recycled Steel Plate', 'Planetary Robes', 'Lab Coat with LED Lines', 'Engineer Jumpsuit',
    'Stealth Bio-Suit', 'Campus Hoodie', 'Varsity Jacket', 'Captain Blazer', 'Green Club Tee',
    'Academic Robes', 'Safari Suit', 'Thermal Anorak', 'Neoprene Wetsuit'
  ],
  skinTones: [
    'Fair', 'Warm', 'Warm Olive', 'Tan', 'Bronze', 'Deep', 'Sun-Kissed', 'Deep Bronze', 'Cyber-Glow'
  ],
  hairColors: [
    'Emerald Green', 'Solar Gold', 'Deep Cyan', 'Earth Brown', 'Chestnut', 'Silver White',
    'Neon Cyan', 'Dark Obsidian', 'Gold Wire', 'Violet Purple', 'Auburn', 'Jet Black', 'Platinum Blonde'
  ],
  accessories: [
    'None', 'Leaf Crown', 'Solar Headband', 'Tide Crest', 'Clay Pendant', 'Map Tube',
    'Cyber Earring', 'Multi-Tool Holster', 'Drone Controller', 'DNA Helix Brooch',
    'Eco Bottle', 'Binoculars', 'Captain Armband', 'Megaphone', 'Research Scroll'
  ],
  backpacks: [
    'Standard Bag', '🌱 Forest Backpack', '⚡ Solar Battery Pack', '💧 Hydro Reservoir',
    'Bio-Compost Pack', 'Ranger Pack', 'Shield Mount', '🌍 Planet Guardian Ring',
    'Data Processor', 'Drone Dock', 'Canvas Rucksack', 'Seed Bag'
  ],
  auras: [
    'None', 'Green Bio-Aura', 'Solar Flare Aura', 'Hydro Ring', 'Glitch Grid',
    'Target Reticle', '🌍 Planet Guardian Aura', 'Gold Command Aura', 'Floral Petals', 'Knowledge Orbit'
  ]
};

// Level Unlocks Guide
export const UNLOCKABLE_REWARDS = [
  { level: 5, name: '🌱 Forest Backpack', type: 'Backpack', icon: 'Backpack', description: 'Unlocked at Level 5' },
  { level: 5, name: 'Eco Knight Avatar', type: 'Avatar', icon: 'ShieldCheck', description: 'Unlocked at Level 5' },
  { level: 8, name: 'Green Tech Ranger', type: 'Avatar', icon: 'Radio', description: 'Unlocked at Level 8' },
  { level: 10, name: '⚡ Solar Armor', type: 'Outfit', icon: 'Zap', description: 'Unlocked at Level 10' },
  { level: 10, name: 'Solar Cyborg Avatar', type: 'Avatar', icon: 'Zap', description: 'Unlocked at Level 10' },
  { level: 12, name: 'Sustainability Captain Avatar', type: 'Avatar', icon: 'Award', description: 'Unlocked at Level 12' },
  { level: 15, name: '🌍 Planet Guardian Aura', type: 'Aura', icon: 'Sparkles', description: 'Unlocked at Level 15' },
  { level: 15, name: 'Planet Guardian Avatar', type: 'Avatar', icon: 'Globe', description: 'Unlocked at Level 15' },
  { level: 20, name: '🌳 Legendary Forest Outfit', type: 'Outfit', icon: 'Trees', description: 'Unlocked at Level 20' }
];
