'use client';

import React, { useState } from 'react';

interface SceneBackgroundProps {
  type: 'sunset_school' | 'cyber_neon' | 'celestial_shrine' | 'alchemist_lab' | 'subway_matrix' | 'sacred_forest';
  customCss?: string;
  children?: React.ReactNode;
}

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ type, children }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width - 0.5) * 16;
    const y = ((clientY - top) / height - 0.5) * 16;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-full w-full overflow-hidden select-none"
    >
      {/* Dynamic Background Renderers */}
      {type === 'sunset_school' && <SunsetSchoolBackground mousePos={mousePos} />}
      {type === 'cyber_neon' && <CyberNeonBackground mousePos={mousePos} />}
      {type === 'celestial_shrine' && <CelestialShrineBackground mousePos={mousePos} />}
      {type === 'sacred_forest' && <SacredForestBackground mousePos={mousePos} />}
      {type === 'alchemist_lab' && <AlchemistLabBackground mousePos={mousePos} />}
      {type === 'subway_matrix' && <SubwayMatrixBackground mousePos={mousePos} />}

      {/* Children layers (e.g. particles, character sprites, UI) */}
      {children}
    </div>
  );
};

// 1. Sunset Schoolyard (Makoto Shinkai "Your Name" / "Weathering With You" aesthetic)
const SunsetSchoolBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1b1c3a] via-[#c2410c] to-[#f59e0b]">
      {/* Clouds Parallax Layer */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
        }}
        className="absolute inset-0 opacity-70 transition-transform duration-700 ease-out"
      >
        {/* Soft glowing sun behind clouds */}
        <div className="absolute top-1/4 right-1/4 h-56 w-56 rounded-full bg-gradient-to-tr from-[#fef08a] via-[#f97316] to-[#ec4899] opacity-80 blur-2xl" />
        <div className="absolute -top-12 -left-20 h-96 w-[120%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* Distant mountains and city skyline silhouettes */}
      <svg
        className="absolute bottom-0 w-full h-1/2 opacity-75"
        preserveAspectRatio="none"
        viewBox="0 0 1440 400"
      >
        <path
          d="M0,320L48,298.7C96,277,192,235,288,234.7C384,235,480,277,576,288C672,299,768,277,864,250.7C960,224,1056,192,1152,192C1248,192,1344,224,1392,240L1440,256L1440,400L0,400Z"
          fill="#31102f"
        />
        <path
          d="M0,360L60,340C120,320,240,280,360,285C480,290,600,340,720,335C840,330,960,270,1080,270C1200,270,1320,330,1380,360L1440,390L1440,400L0,400Z"
          fill="#17081e"
        />
      </svg>

      {/* Shinkai Signature: Telegraph / Power line silhouettes & railway fence */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)`,
        }}
        className="absolute bottom-0 inset-x-0 h-44 pointer-events-none transition-transform duration-500 ease-out"
      >
        <svg className="w-full h-full text-black/60" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <line x1="0" y1="20" x2="1000" y2="90" stroke="currentColor" strokeWidth="1" />
          <line x1="0" y1="35" x2="1000" y2="105" stroke="currentColor" strokeWidth="1.2" />
          <line x1="0" y1="50" x2="1000" y2="120" stroke="currentColor" strokeWidth="0.8" />
          {/* Utility Poles */}
          <rect x="220" y="0" width="6" height="200" fill="currentColor" />
          <line x1="200" y1="30" x2="246" y2="30" stroke="currentColor" strokeWidth="3" />
          <rect x="780" y="20" width="8" height="180" fill="currentColor" />
          <line x1="755" y1="45" x2="815" y2="45" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Golden hour sun flare leak */}
      <div className="absolute top-0 right-10 h-72 w-72 bg-gradient-radial from-amber-300/40 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};

// 2. Cyberpunk Neon Metropolis (Ghost in the Shell / Cyberpunk Edgerunners)
const CyberNeonBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-[#060814] overflow-hidden">
      {/* Distant Skyscrapers Grid */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
        }}
        className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"
      />

      {/* Cyber Neon Tower Blocks */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`,
        }}
        className="absolute bottom-0 inset-x-0 h-3/4 flex items-end justify-around px-8 pointer-events-none"
      >
        <div className="w-24 h-80 bg-gradient-to-t from-black via-slate-900 to-indigo-950 border-t-2 border-cyan-400/80 shadow-neon-cyan relative">
          <div className="absolute top-4 left-2 right-2 flex flex-col gap-1 opacity-60">
            <div className="h-1 bg-cyan-400 w-3/4 animate-pulse" />
            <div className="h-1 bg-cyan-400 w-1/2" />
            <div className="h-1 bg-cyan-400 w-5/6" />
          </div>
          <span className="absolute bottom-8 left-2 font-mono text-[9px] text-cyan-300 tracking-widest writing-vertical opacity-80">
            ARASAKA_NET
          </span>
        </div>

        <div className="w-36 h-96 bg-gradient-to-t from-black via-slate-950 to-purple-950 border-t-2 border-fuchsia-400/80 shadow-neon-pink relative">
          <div className="absolute top-6 left-4 font-mono text-xs text-pink-400 font-bold tracking-widest">
            NEO_SHIBUYA
          </div>
        </div>

        <div className="w-20 h-64 bg-gradient-to-t from-black via-slate-900 to-cyan-950 border-t border-cyan-500/60" />
        <div className="w-32 h-88 bg-gradient-to-t from-black via-slate-900 to-violet-950 border-t-2 border-violet-500/80 shadow-neon-violet" />
      </div>

      {/* Perspective Grid Floor */}
      <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-cyan-950/40 via-transparent to-transparent border-t border-cyan-500/30" />

      {/* CRT Scanline Filter */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80 pointer-events-none" />
    </div>
  );
};

// 3. Celestial Shrine / Fantasy Realm (Ghibli / Genshin Impact Astral Realm)
const CelestialShrineBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#090a1f] via-[#1a103c] to-[#2e1065] overflow-hidden">
      {/* Swirling Galaxy Nebula */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px, 0)`,
        }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-600/25 to-pink-500/15 blur-3xl"
      />
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-transparent blur-3xl" />

      {/* Giant Luminous Moon / Bio-Crystal */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)`,
        }}
        className="absolute top-10 right-20 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-100 via-purple-200 to-amber-100 shadow-[0_0_60px_rgba(238,242,255,0.4)] flex items-center justify-center"
      >
        <div className="h-32 w-32 rounded-full border border-purple-300/40 opacity-50 animate-pulse" />
      </div>

      {/* Mystical Floating Spire Silhouettes */}
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)`,
        }}
        className="absolute bottom-0 inset-x-0 h-1/2 pointer-events-none flex items-end justify-between px-16 opacity-85"
      >
        <div className="w-16 h-60 bg-gradient-to-t from-[#140628] to-[#3b0764] rounded-t-full shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
        <div className="w-28 h-84 bg-gradient-to-t from-[#140628] to-[#4c1d95] rounded-t-full shadow-[0_0_35px_rgba(139,92,246,0.3)]" />
        <div className="w-20 h-52 bg-gradient-to-t from-[#140628] to-[#3b0764] rounded-t-full" />
      </div>

      {/* Luminous Ground Mist */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-purple-900/60 to-transparent blur-md" />
    </div>
  );
};

// 4. Sacred Forest / Bioluminescent Glade
const SacredForestBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#021312] via-[#062e29] to-[#0d3b36]">
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
        }}
        className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl animate-pulse"
      />
      {/* Ancient Tree Silhouettes */}
      <div className="absolute bottom-0 inset-x-0 h-3/4 flex items-end justify-around opacity-90 pointer-events-none">
        <div className="w-28 h-full bg-gradient-to-t from-[#021815] to-emerald-950/80 rounded-t-3xl" />
        <div className="w-40 h-5/6 bg-gradient-to-t from-[#021815] to-teal-950/90 rounded-t-full" />
        <div className="w-32 h-full bg-gradient-to-t from-[#021815] to-emerald-950/80 rounded-t-3xl" />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-emerald-950 via-teal-950/70 to-transparent" />
    </div>
  );
};

// 5. Alchemist Lab
const AlchemistLabBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1c1208] via-[#2d1b0c] to-[#451a03]">
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px, 0)`,
        }}
        className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-amber-500/25 blur-3xl"
      />
      {/* Luminous Alembic & Arcane Circle */}
      <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full border-2 border-amber-400/40 border-dashed animate-[spin_20s_linear_infinite]" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-amber-950 to-transparent" />
    </div>
  );
};

// 6. Subway Matrix / High Speed Tunnel
const SubwayMatrixBackground = ({ mousePos }: { mousePos: { x: number; y: number } }) => {
  return (
    <div className="absolute inset-0 bg-[#070b19] overflow-hidden">
      <div
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)`,
        }}
        className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-30"
      />
      {/* Light speed trails */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-44 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-md" />
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-cyan-950 to-transparent" />
    </div>
  );
};
