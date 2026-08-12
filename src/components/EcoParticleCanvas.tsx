import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRotation: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  type: 'leaf' | 'orb' | 'sparkle';
  swingSpeed: number;
  swingAmount: number;
}

export const EcoParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const colors = {
      leaf: ['#16A36A', '#B8E65A', '#0E7C5A', '#4ADE80', '#22C55E'],
      orb: ['#38BDF8', '#B8E65A', '#F5C451', '#A7F3D0'],
      sparkle: ['#FFFFFF', '#F5C451', '#B8E65A']
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Seed initial ambient particles
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.3 - Math.random() * 0.7,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.03,
        opacity: 0.2 + Math.random() * 0.5,
        life: 0,
        maxLife: 200 + Math.random() * 300,
        color: colors.leaf[Math.floor(Math.random() * colors.leaf.length)],
        type: Math.random() > 0.4 ? 'leaf' : 'orb',
        swingSpeed: 0.02 + Math.random() * 0.03,
        swingAmount: 0.5 + Math.random() * 1.5
      });
    }

    // Function to add a burst of particles
    const addActionBurst = (originX?: number, originY?: number) => {
      const cx = originX ?? canvas.width / 2;
      const cy = originY ?? canvas.height / 2;

      for (let i = 0; i < 45; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        const typeRand = Math.random();
        const pType: 'leaf' | 'orb' | 'sparkle' = typeRand > 0.5 ? 'leaf' : typeRand > 0.2 ? 'orb' : 'sparkle';

        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          size: pType === 'leaf' ? 8 + Math.random() * 10 : 3 + Math.random() * 7,
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.1,
          opacity: 1,
          life: 0,
          maxLife: 80 + Math.random() * 80,
          color: colors[pType][Math.floor(Math.random() * colors[pType].length)],
          type: pType,
          swingSpeed: 0.04 + Math.random() * 0.04,
          swingAmount: 1 + Math.random() * 2
        });
      }
    };

    // Global Event Listener for Action Completion
    const handleEcoAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const x = customEvent.detail?.x;
      const y = customEvent.detail?.y;
      addActionBurst(x, y);
    };

    window.addEventListener('eco-action-completed', handleEcoAction);

    // Main Draw & Update Loop
    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Continuously replenish ambient drifting particles
      if (particles.length < 18 && Math.random() < 0.1) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -0.4 - Math.random() * 0.8,
          size: 5 + Math.random() * 7,
          rotation: Math.random() * Math.PI * 2,
          vRotation: (Math.random() - 0.5) * 0.03,
          opacity: 0.3 + Math.random() * 0.4,
          life: 0,
          maxLife: 250 + Math.random() * 200,
          color: colors.leaf[Math.floor(Math.random() * colors.leaf.length)],
          type: Math.random() > 0.3 ? 'leaf' : 'orb',
          swingSpeed: 0.02 + Math.random() * 0.03,
          swingAmount: 0.8 + Math.random() * 1.2
        });
      }

      particles.forEach((p, idx) => {
        p.life++;
        p.x += p.vx + Math.sin(frame * p.swingSpeed) * p.swingAmount;
        p.y += p.vy;
        p.rotation += p.vRotation;

        // Slow down explosion particles
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Fade out near end of life
        const progress = p.life / p.maxLife;
        const currentOpacity = progress > 0.7 ? p.opacity * (1 - (progress - 0.7) / 0.3) : p.opacity;

        if (currentOpacity <= 0 || p.life >= p.maxLife) {
          particles.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, currentOpacity);

        if (p.type === 'leaf') {
          // Draw Stylized Organic Leaf Shape
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
          ctx.fill();

          // Leaf Stem Detail
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.moveTo(0, -p.size * 0.8);
          ctx.lineTo(0, p.size * 0.8);
          ctx.stroke();
        } else if (p.type === 'orb') {
          // Draw Glowing Soft Light Orb
          ctx.beginPath();
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sparkle Star
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('eco-action-completed', handleEcoAction);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
    />
  );
};

export const triggerEcoActionBurst = (x?: number, y?: number) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('eco-action-completed', { detail: { x, y } })
    );
  }
};
