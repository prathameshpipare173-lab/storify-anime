'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  Sword,
  Cpu,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  Loader2,
  BookOpenCheck,
} from 'lucide-react';
import { SubGenre, Story } from '@/lib/types';
import { audio } from '@/lib/audio';

interface StoryStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryGenerated: (story: Story) => void;
}

const PRESET_EXCERPTS = [
  {
    title: 'Photosynthesis & The Thylakoid Matrix',
    genre: 'isekai' as SubGenre,
    text: `Photosynthesis is the biological process by which green plants and certain other organisms transform light energy into chemical energy.
Chlorophyll: The primary green photoreceptor pigment embedded in the thylakoid membranes of chloroplasts that absorbs blue and red wavelengths.
Thylakoid Membrane: The internal membrane system where the light-dependent reactions occur, forming stacks called grana.
Photolysis of Water: The enzymatic splitting of H2O into oxygen (O2), protons (H+), and electrons driven by absorbed light in Photosystem II.
Calvin Cycle: The light-independent carbon fixation pathway in the stroma that utilizes ATP and NADPH to convert CO2 into glucose.`,
  },
  {
    title: 'TCP 3-Way Handshake & SYN Flooding',
    genre: 'cyberpunk' as SubGenre,
    text: `The Transmission Control Protocol (TCP) establishes reliable connections across packet-switched networks using a three-way handshake sequence.
SYN Packet: The synchronization packet sent by the client containing an Initial Sequence Number (ISN) to initiate a session.
SYN-ACK Response: The acknowledgement and synchronization packet returned by the server, allocating buffer resources for the pending socket.
ACK Confirmation: The client's final handshake acknowledgment that confirms sequence numbers and transitions the socket to ESTABLISHED state.
SYN Flood Attack: A Denial-of-Service vulnerability where an attacker sends spoofed SYN requests without completing the ACK handshake, exhausting the server's backlog queue.`,
  },
  {
    title: "Newton's Third Law & Orbital Mechanics",
    genre: 'academy' as SubGenre,
    text: `Classical mechanics establishes that whenever an object exerts a force on a second object, the second object exerts an equal and opposite force on the first.
Action-Reaction Pair: Forces always occur in matched pairs acting on different bodies simultaneously (F_A_on_B = -F_B_on_A).
Centripetal Force: The net inward force required to keep an object moving in a curved path, given by F = m*v^2 / r.
Gravitational Constant (G): The universal proportionality constant in Newton's law of gravitation (6.674 × 10^-11 N m^2/kg^2).
Orbital Velocity: The specific horizontal speed necessary for a projectile's trajectory to match the curvature of the celestial body below it.`,
  },
];

export const StoryStudioModal: React.FC<StoryStudioModalProps> = ({
  isOpen,
  onClose,
  onStoryGenerated,
}) => {
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<SubGenre>('isekai');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content || '');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content || '');
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (preset: (typeof PRESET_EXCERPTS)[0]) => {
    audio.playMenuClick();
    setTitle(preset.title);
    setRawText(preset.text);
    setSelectedGenre(preset.genre);
    setFileName(null);
  };

  const handleGenerate = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please paste textbook notes or upload a file.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    audio.playBossAlarm(); // dramatic anime transition cue

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Anime Study Chapter',
          rawText: rawText.trim(),
          subGenre: selectedGenre,
          apiKey: apiKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.story) {
        audio.playVictoryJingle();
        onStoryGenerated(data.story);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to synthesize story');
      }
    } catch (err) {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700 bg-slate-950/95 text-white shadow-2xl p-6 md:p-8 backdrop-blur-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Anime Story Synthesizer
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white font-anime">
                Textbook to Anime Transmutation Studio
              </h2>
            </div>
            <button
              onClick={() => {
                audio.playMenuClick();
                onClose();
              }}
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form scrollable area */}
          <div className="flex-1 overflow-y-auto space-y-5 py-4 pr-1">
            {/* 1. Quick Presets Bar */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Quick Sample Textbook Excerpts:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_EXCERPTS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadPreset(preset)}
                    className="text-left p-2.5 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-900/70 hover:bg-slate-850 text-xs transition-colors flex items-center gap-2"
                  >
                    <BookOpenCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate text-slate-200">{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sub-Genre Selector */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Select Anime Sub-Genre:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Isekai */}
                <button
                  type="button"
                  onClick={() => {
                    audio.playMenuClick();
                    setSelectedGenre('isekai');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedGenre === 'isekai'
                      ? 'border-purple-500 bg-purple-950/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm mb-1">
                    <Sword className="w-4 h-4" /> ⚔️ Isekai Fantasy
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Bio-alchemy, cellular magic, healing runes. Best for Biology & Chemistry.
                  </p>
                </button>

                {/* Cyberpunk */}
                <button
                  type="button"
                  onClick={() => {
                    audio.playMenuClick();
                    setSelectedGenre('cyberpunk');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedGenre === 'cyberpunk'
                      ? 'border-cyan-500 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-1">
                    <Cpu className="w-4 h-4" /> 🌆 Cyberpunk Heist
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Netrunners, neural networks, cipher keys. Best for CS, Math & Networking.
                  </p>
                </button>

                {/* Academy */}
                <button
                  type="button"
                  onClick={() => {
                    audio.playMenuClick();
                    setSelectedGenre('academy');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedGenre === 'academy'
                      ? 'border-amber-500 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                    <GraduationCap className="w-4 h-4" /> 🌸 Sci-Fi Academy
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sunset rooftops, physics clubs, relativity. Best for Physics & Literature.
                  </p>
                </button>
              </div>
            </div>

            {/* 3. Title Input */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Chapter / Topic Title:
              </label>
              <input
                type="text"
                placeholder="e.g. Chapter 4: Photosynthesis & Light Reactions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* 4. Dropzone & Text Area */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Textbook Content (Upload file or Paste text):
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="mb-2 p-4 rounded-xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 text-center transition-colors cursor-pointer relative"
              >
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300">
                  {fileName ? (
                    <span className="text-cyan-400 font-semibold flex items-center justify-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> {fileName} loaded
                    </span>
                  ) : (
                    'Drop textbook PDF, TXT, or markdown here, or click to browse'
                  )}
                </span>
              </div>

              <textarea
                rows={5}
                placeholder="Paste dense textbook paragraphs, syllabus concepts, laws, or formulas here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-xs md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
              />
            </div>

            {/* 5. Optional OpenAI Key */}
            <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  Custom OpenAI API Key (Optional)
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Built-in Neural Engine Active
                </span>
              </div>
              <input
                type="password"
                placeholder="sk-... (Leave empty to use built-in anime synthesizer)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Storyify Anime Engine • 16:9 VN Framework
            </span>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Transmuting Textbook into Anime...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  Transmute into Anime Story
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
