'use client';

import React from 'react';
import { MoodShader } from '@/lib/types';

interface ThemeShaderProps {
  mood: MoodShader;
}

export const ThemeShader: React.FC<ThemeShaderProps> = ({ mood }) => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 1. Cinematic Aspect Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.7)]" />

      {/* 2. Top & Bottom Cinematic Letterbox bars */}
      <div className="absolute top-0 inset-x-0 h-4 md:h-6 bg-black z-30" />
      <div className="absolute bottom-0 inset-x-0 h-4 md:h-6 bg-black z-30" />

      {/* 3. Mood-Specific Color Grade Overlay */}
      {mood === 'sunset' && (
        <>
          {/* Warm Golden Hour Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/10 via-orange-500/5 to-yellow-300/10 mix-blend-screen" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none mix-blend-color-dodge" />
        </>
      )}

      {mood === 'cyberpunk' && (
        <>
          {/* Neon Cyan & Magenta Duotone Tone Mapping */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-pink-500/15 mix-blend-screen" />
          {/* Subtle CRT Chromatic Aberration Edge Fringe */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(6,182,212,0.15)_100%)]" />
        </>
      )}

      {mood === 'celestial' && (
        <>
          {/* Deep Starry Sky Violet & Ethereal Bloom */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/15 via-indigo-600/10 to-teal-400/10 mix-blend-screen" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}
    </div>
  );
};
