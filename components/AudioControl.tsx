'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Waves, Radio } from 'lucide-react';
import { audio } from '@/lib/audio';

export const AudioControl: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('none');
  const [volume, setVolume] = useState<number>(70);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(audio.getIsMuted());
  }, []);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audio.setMute(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    audio.setVolume(val / 100);
  };

  const handleSelectTrack = (track: 'rain' | 'sunset' | 'cyber' | 'celestial') => {
    if (currentTrack === track) {
      audio.stopAmbient();
      setCurrentTrack('none');
    } else {
      audio.playAmbient(track);
      setCurrentTrack(track);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 text-xs shadow-lg">
        {/* Track Menu Trigger */}
        <button
          onClick={() => {
            audio.playMenuClick();
            setIsOpenMenu(!isOpenMenu);
          }}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium transition-colors ${
            currentTrack !== 'none'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Change Anime Ambiance"
        >
          <Music className="w-3.5 h-3.5" />
          <span className="capitalize hidden sm:inline">
            {currentTrack === 'none' ? 'BGM Off' : currentTrack}
          </span>
          {currentTrack !== 'none' && (
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500"></span>
            </span>
          )}
        </button>

        {/* Volume Slider */}
        <div className="hidden md:flex items-center gap-1.5 px-1">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="text-slate-400 hover:text-white transition-colors p-1"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>
      </div>

      {/* Track Selector Dropdown */}
      {isOpenMenu && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-950/95 border border-slate-700/80 p-2 shadow-2xl backdrop-blur-xl z-50 text-slate-200">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 px-3 py-1.5 border-b border-slate-800">
            Procedural Soundscapes
          </div>
          <div className="space-y-1 mt-1">
            <button
              onClick={() => handleSelectTrack('rain')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                currentTrack === 'rain'
                  ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Waves className="w-3.5 h-3.5 text-cyan-400" /> Lo-fi Rain & Chords
              </span>
              {currentTrack === 'rain' && <span className="text-[10px] text-purple-400">PLAYING</span>}
            </button>

            <button
              onClick={() => handleSelectTrack('sunset')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                currentTrack === 'sunset'
                  ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-400" /> Sunset Schoolyard Lo-Fi
              </span>
              {currentTrack === 'sunset' && <span className="text-[10px] text-amber-400">PLAYING</span>}
            </button>

            <button
              onClick={() => handleSelectTrack('cyber')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                currentTrack === 'cyber'
                  ? 'bg-cyan-600/30 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Waves className="w-3.5 h-3.5 text-fuchsia-400" /> Cyberpunk Pulse
              </span>
              {currentTrack === 'cyber' && <span className="text-[10px] text-cyan-400">PLAYING</span>}
            </button>

            <button
              onClick={() => handleSelectTrack('celestial')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                currentTrack === 'celestial'
                  ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30'
                  : 'hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-indigo-400" /> Celestial Fantasy Pad
              </span>
              {currentTrack === 'celestial' && <span className="text-[10px] text-indigo-400">PLAYING</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
