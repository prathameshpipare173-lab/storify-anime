'use client';

import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  type: 'sakura' | 'dust' | 'data' | 'starlight' | 'none';
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  char?: string;
  wobbleSpeed?: number;
  wobbleAmp?: number;
  wobblePhase?: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ type, density = 40 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particles: Particle[] = [];
    const count = Math.min(density, 60);

    const sakuraColors = ['rgba(255, 183, 197, 0.75)', 'rgba(255, 192, 203, 0.65)', 'rgba(255, 218, 224, 0.8)'];
    const dustColors = ['rgba(255, 223, 140, 0.6)', 'rgba(255, 200, 100, 0.5)', 'rgba(255, 245, 200, 0.7)'];
    const dataColors = ['rgba(6, 182, 212, 0.85)', 'rgba(244, 114, 182, 0.85)', 'rgba(139, 92, 246, 0.85)'];
    const starColors = ['rgba(255, 255, 255, 0.9)', 'rgba(167, 139, 250, 0.8)', 'rgba(192, 132, 252, 0.7)'];
    const binaryChars = ['0', '1', 'λ', 'Ω', '§', 'Δ', '0x1F'];

    for (let i = 0; i < count; i++) {
      let color = sakuraColors[Math.floor(Math.random() * sakuraColors.length)];
      let char = undefined;
      let size = Math.random() * 6 + 4;
      let speedX = (Math.random() - 0.5) * 0.8;
      let speedY = Math.random() * 0.8 + 0.4;

      if (type === 'dust') {
        color = dustColors[Math.floor(Math.random() * dustColors.length)];
        size = Math.random() * 3 + 1.5;
        speedX = (Math.random() - 0.5) * 0.4;
        speedY = (Math.random() - 0.5) * 0.4;
      } else if (type === 'data') {
        color = dataColors[Math.floor(Math.random() * dataColors.length)];
        char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
        size = Math.random() * 8 + 9;
        speedX = (Math.random() - 0.5) * 0.3;
        speedY = -(Math.random() * 0.9 + 0.3); // floats up
      } else if (type === 'starlight') {
        color = starColors[Math.floor(Math.random() * starColors.length)];
        size = Math.random() * 3 + 1;
        speedX = (Math.random() - 0.5) * 0.2;
        speedY = (Math.random() - 0.5) * 0.2;
      }

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedX,
        speedY,
        opacity: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        color,
        char,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
        wobbleAmp: Math.random() * 1.5 + 0.5,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.rotation += p.rotationSpeed;
        if (p.wobblePhase !== undefined && p.wobbleSpeed !== undefined) {
          p.wobblePhase += p.wobbleSpeed;
          p.x += Math.sin(p.wobblePhase) * (p.wobbleAmp || 1) * 0.5;
        }

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (type === 'sakura') {
          // Draw curved sakura petal
          ctx.beginPath();
          ctx.fillStyle = p.color;
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size, -p.size * 0.6, -p.size, -p.size * 1.4, 0, -p.size * 2);
          ctx.bezierCurveTo(p.size, -p.size * 1.4, p.size, -p.size * 0.6, 0, 0);
          ctx.fill();
        } else if (type === 'data') {
          // Draw cyber character
          ctx.font = `${Math.floor(p.size)}px monospace`;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fillText(p.char || '0', 0, 0);
        } else if (type === 'starlight') {
          // Draw 4-point star sparkle
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          const s = p.size;
          ctx.moveTo(0, -s * 2);
          ctx.quadraticCurveTo(0, 0, s * 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, s * 2);
          ctx.quadraticCurveTo(0, 0, -s * 2, 0);
          ctx.quadraticCurveTo(0, 0, 0, -s * 2);
          ctx.fill();
        } else {
          // Golden hour soft dust bokeh circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 5;
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, density]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
};
