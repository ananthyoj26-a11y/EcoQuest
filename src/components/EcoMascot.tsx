import React from 'react';
import { motion } from 'motion/react';

interface Props {
  state?: 'idle' | 'typing' | 'valid_email' | 'submitting' | 'happy' | 'thinking';
  mousePos?: { x: number; y: number };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const EcoMascot: React.FC<Props> = ({
  state = 'idle',
  mousePos = { x: 0, y: 0 },
  size = 'md',
  className = ''
}) => {
  // Dimensions
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-44 h-44'
  }[size];

  // Calculate eye offsets based on mouse or state
  const isTyping = state === 'typing';
  const isValid = state === 'valid_email';
  const isSubmitting = state === 'submitting';

  // Eye positioning interpolation
  let eyeOffsetX = Math.max(-5, Math.min(5, (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) / 100));
  let eyeOffsetY = Math.max(-4, Math.min(4, (mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) / 100));

  if (isTyping) {
    eyeOffsetX = -1;
    eyeOffsetY = 3.5; // looking down at input field
  } else if (isValid) {
    eyeOffsetX = 0;
    eyeOffsetY = -1;
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      
      {/* Dynamic Glowing Aura */}
      <motion.div
        animate={{
          scale: isValid ? [1, 1.25, 1.1] : [1, 1.08, 1],
          opacity: isValid ? [0.6, 0.9, 0.7] : [0.3, 0.5, 0.3]
        }}
        transition={{ duration: isValid ? 1.5 : 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${
          isValid
            ? 'bg-gradient-to-r from-[#16A36A] via-[#B8E65A] to-[#38BDF8]'
            : 'bg-[#16A36A]/30'
        }`}
      />

      {/* Main Planet Mascot Body Container */}
      <motion.div
        animate={
          isSubmitting
            ? { y: [-10, 10, -10], rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }
            : isValid
            ? { y: [0, -8, 0], rotate: [0, 4, -4, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{ duration: isValid ? 1.8 : 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-full h-full"
      >
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_10px_25px_rgba(22,163,106,0.4)]">
          
          {/* Outer Atmosphere Ring */}
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(184, 230, 90, 0.25)" strokeWidth="2" strokeDasharray="6 4" />

          {/* Planet Body Gradient */}
          <defs>
            <radialGradient id="planetGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="45%" stopColor="#0E7C5A" />
              <stop offset="90%" stopColor="#071A14" />
            </radialGradient>

            <linearGradient id="continentGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B8E65A" />
              <stop offset="100%" stopColor="#16A36A" />
            </linearGradient>

            <filter id="glowEffect">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Planet Sphere Base */}
          <circle cx="60" cy="60" r="48" fill="url(#planetGrad)" />

          {/* Continents / Landmasses */}
          <path
            d="M 32,40 C 35,32 50,30 55,42 C 60,54 45,62 38,58 C 30,54 28,48 32,40 Z"
            fill="url(#continentGrad)"
            opacity="0.9"
          />
          <path
            d="M 70,30 C 82,28 92,38 88,50 C 84,62 72,58 68,48 C 65,40 68,32 70,30 Z"
            fill="url(#continentGrad)"
            opacity="0.85"
          />
          <path
            d="M 45,75 C 55,70 70,72 75,82 C 78,90 62,95 50,90 C 40,86 40,80 45,75 Z"
            fill="url(#continentGrad)"
            opacity="0.8"
          />

          {/* Top Sprout Stem & Leaf (Sways dynamically) */}
          <g transform="translate(60, 12)">
            <motion.path
              animate={{ rotate: isTyping ? [0, 8, -8, 0] : [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              d="M 0,0 Q -4,-12 0,-18 Q 4,-12 0,0"
              fill="none"
              stroke="#B8E65A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left Leaf */}
            <path d="M 0,-16 Q -12,-20 -8,-8 Q -2,-6 0,-16" fill="#B8E65A" />
            {/* Right Leaf */}
            <path d="M 0,-14 Q 12,-18 8,-6 Q 2,-4 0,-14" fill="#16A36A" />
          </g>

          {/* Face Elements */}
          <g transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`}>
            
            {/* Left Eye */}
            {isValid ? (
              // Joyful Arc Eye when valid email
              <path d="M 40,54 Q 46,47 52,54" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <g>
                <circle cx="46" cy="52" r={isTyping ? "5" : "6.5"} fill="#071A14" />
                <circle cx="46" cy="52" r={isTyping ? "4" : "5.5"} fill="#FFFFFF" />
                <circle cx={48 + eyeOffsetX * 0.3} cy={50 + eyeOffsetY * 0.3} r="2" fill="#071A14" />
                <circle cx="49" cy="49" r="0.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Right Eye */}
            {isValid ? (
              // Joyful Arc Eye when valid email
              <path d="M 68,54 Q 74,47 80,54" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <g>
                <circle cx="74" cy="52" r={isTyping ? "5" : "6.5"} fill="#071A14" />
                <circle cx="74" cy="52" r={isTyping ? "4" : "5.5"} fill="#FFFFFF" />
                <circle cx={76 + eyeOffsetX * 0.3} cy={50 + eyeOffsetY * 0.3} r="2" fill="#071A14" />
                <circle cx="77" cy="49" r="0.8" fill="#FFFFFF" />
              </g>
            )}

            {/* Cheeks */}
            <circle cx="38" cy="59" r="4" fill="#F5C451" opacity={isValid ? "0.9" : "0.5"} />
            <circle cx="82" cy="59" r="4" fill="#F5C451" opacity={isValid ? "0.9" : "0.5"} />

            {/* Mouth */}
            {isValid ? (
              <path d="M 50,62 Q 60,74 70,62" fill="#F5C451" stroke="#FFFFFF" strokeWidth="2" />
            ) : isTyping ? (
              <circle cx="60" cy="63" r="3" fill="#071A14" />
            ) : (
              <path d="M 52,62 Q 60,68 68,62" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            )}
          </g>

          {/* Floating Sparkles when Valid */}
          {isValid && (
            <g>
              <circle cx="25" cy="35" r="2" fill="#B8E65A" className="animate-ping" />
              <circle cx="95" cy="40" r="2.5" fill="#38BDF8" className="animate-pulse" />
              <path d="M 60,25 L 62,30 L 67,32 L 62,34 L 60,39 L 58,34 L 53,32 L 58,30 Z" fill="#F5C451" />
            </g>
          )}

        </svg>
      </motion.div>

      {/* Floating Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-3 bg-slate-950/90 border border-[#16A36A]/60 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider text-[#B8E65A] shadow-lg flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8E65A] animate-ping" />
        <span>{isValid ? 'GAIA APPROVES ✓' : isTyping ? 'GAIA IS WATCHING...' : 'GAIA SPIRIT'}</span>
      </motion.div>

    </div>
  );
};
