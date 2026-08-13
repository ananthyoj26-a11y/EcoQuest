import React from 'react';
import { GAMING_AVATARS, GamingAvatar, AvatarCustomization } from '../data/avatarsData';
import {
  Trees,
  Sun,
  Droplets,
  Sprout,
  Compass,
  ShieldCheck,
  Feather,
  Globe,
  Cpu,
  Wrench,
  Radio,
  Zap,
  Dna,
  BarChart2,
  Mountain,
  Anchor,
  Heart,
  Map,
  GraduationCap,
  Search,
  Award,
  Users,
  BookOpen,
  Shield,
  Sparkles,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface AvatarDisplayProps {
  avatarId?: string;
  photoURL?: string;
  customization?: Partial<AvatarCustomization>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  showCategoryBadge?: boolean;
  showAura?: boolean;
  showLevel?: number;
  className?: string;
  onClick?: () => void;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  avatarId = 'forest_guardian',
  photoURL,
  customization,
  size = 'md',
  showCategoryBadge = false,
  showAura = true,
  showLevel,
  className = '',
  onClick
}) => {
  const avatar = GAMING_AVATARS.find(a => a.id === avatarId) || GAMING_AVATARS[0];
  const custom = { ...avatar.defaultCustomization, ...customization };

  const imgUrl = photoURL || (avatarId && (avatarId.startsWith('http://') || avatarId.startsWith('https://')) ? avatarId : '');

  // Map icon component
  const renderIcon = (iconName: string, iconClass: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Trees': return <Trees className={iconClass} />;
      case 'Sun': return <Sun className={iconClass} />;
      case 'Droplets': return <Droplets className={iconClass} />;
      case 'Sprout': return <Sprout className={iconClass} />;
      case 'Compass': return <Compass className={iconClass} />;
      case 'ShieldCheck': return <ShieldCheck className={iconClass} />;
      case 'Feather': return <Feather className={iconClass} />;
      case 'Globe': return <Globe className={iconClass} />;
      case 'Cpu': return <Cpu className={iconClass} />;
      case 'Wrench': return <Wrench className={iconClass} />;
      case 'Radio': return <Radio className={iconClass} />;
      case 'Zap': return <Zap className={iconClass} />;
      case 'Dna': return <Dna className={iconClass} />;
      case 'BarChart2': return <BarChart2 className={iconClass} />;
      case 'Mountain': return <Mountain className={iconClass} />;
      case 'Anchor': return <Anchor className={iconClass} />;
      case 'Heart': return <Heart className={iconClass} />;
      case 'Map': return <Map className={iconClass} />;
      case 'GraduationCap': return <GraduationCap className={iconClass} />;
      case 'Search': return <Search className={iconClass} />;
      case 'Award': return <Award className={iconClass} />;
      case 'Users': return <Users className={iconClass} />;
      case 'BookOpen': return <BookOpen className={iconClass} />;
      case 'Shield': return <Shield className={iconClass} />;
      default: return <Sparkles className={iconClass} />;
    }
  };

  // Dimensions
  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-xs', icon: 'w-3.5 h-3.5', badge: 'w-2.5 h-2.5' },
    sm: { box: 'w-10 h-10', text: 'text-sm', icon: 'w-5 h-5', badge: 'w-3.5 h-3.5' },
    md: { box: 'w-14 h-14', text: 'text-base', icon: 'w-7 h-7', badge: 'w-4 h-4' },
    lg: { box: 'w-20 h-20', text: 'text-lg', icon: 'w-10 h-10', badge: 'w-5 h-5' },
    xl: { box: 'w-28 h-28', text: 'text-xl', icon: 'w-14 h-14', badge: 'w-6 h-6' },
    '2xl': { box: 'w-36 h-36', text: 'text-2xl', icon: 'w-18 h-18', badge: 'w-7 h-7' },
    hero: { box: 'w-48 h-48', text: 'text-3xl', icon: 'w-24 h-24', badge: 'w-8 h-8' }
  };

  const dim = sizeMap[size] || sizeMap.md;

  // Aura Styling
  let auraEffect = '';
  if (showAura && custom.aura && custom.aura !== 'None') {
    if (custom.aura.includes('Solar') || custom.aura.includes('Gold')) {
      auraEffect = 'shadow-[0_0_25px_rgba(245,158,11,0.6)] border-amber-400';
    } else if (custom.aura.includes('Planet') || custom.aura.includes('Celestial')) {
      auraEffect = 'shadow-[0_0_30px_rgba(184,230,90,0.8)] border-[#B8E65A] animate-pulse';
    } else if (custom.aura.includes('Hydro') || custom.aura.includes('Target')) {
      auraEffect = 'shadow-[0_0_25px_rgba(56,189,248,0.7)] border-sky-400';
    } else {
      auraEffect = 'shadow-[0_0_20px_rgba(16,185,129,0.5)] border-emerald-400';
    }
  }

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-tr ${avatar.bgGradient} border-2 border-emerald-500/50 p-1 transition-all ${auraEffect} ${onClick ? 'cursor-pointer hover:scale-105' : ''} ${className}`}
    >
      {/* Background Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none blur-md"
        style={{ backgroundColor: avatar.primaryColor }}
      />

      {/* Main Avatar Avatar Container */}
      <div className={`relative ${dim.box} rounded-xl overflow-hidden flex flex-col items-center justify-center bg-slate-950/70 border border-white/10`}>
        {/* Category Color Accents */}
        <div
          className="absolute top-0 inset-x-0 h-1"
          style={{ backgroundColor: avatar.primaryColor }}
        />

        {/* Icon & Character Identity Visual OR Photo Image */}
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={avatar.name}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-center p-1">
            <div style={{ color: avatar.accentColor }}>
              {renderIcon(avatar.badgeIcon, dim.icon)}
            </div>
          </div>
        )}

        {/* Customization Details Overlay Label */}
        {['lg', 'xl', '2xl', 'hero'].includes(size) && (
          <div className="absolute bottom-1 inset-x-1 bg-slate-950/80 backdrop-blur-md rounded border border-white/10 px-1 py-0.5 text-center truncate z-10">
            <span className="text-[9px] font-bold tracking-tight text-white block truncate">
              {custom.outfit || avatar.name}
            </span>
            <span className="text-[8px] font-mono text-[#B8E65A] block truncate">
              {custom.aura && custom.aura !== 'None' ? custom.aura : avatar.category}
            </span>
          </div>
        )}
      </div>

      {/* Optional Category Badge Pin */}
      {showCategoryBadge && (
        <div
          className={`absolute -top-1.5 -right-1.5 ${dim.badge} rounded-full bg-slate-950 border border-white/20 flex items-center justify-center shadow-lg z-20`}
          style={{ color: avatar.primaryColor }}
          title={avatar.category}
        >
          {renderIcon(avatar.badgeIcon, 'w-2.5 h-2.5')}
        </div>
      )}

      {/* Optional Level Badge Pin */}
      {showLevel !== undefined && (
        <div className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-[#B8E65A] text-slate-950 text-[10px] font-black shadow-md z-20">
          L{showLevel}
        </div>
      )}
    </div>
  );
};
