'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  PlusCircle,
  Play,
  Trophy,
  Flame,
  BrainCircuit,
  Sword,
  Cpu,
  GraduationCap,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Story, SubGenre, Concept, UserProgress } from '@/lib/types';
import { SAMPLE_STORIES } from '@/lib/sampleStories';
import { VisualNovelPlayer } from '@/components/VisualNovelPlayer';
import { StoryStudioModal } from '@/components/StoryStudioModal';
import { CodexModal } from '@/components/CodexModal';
import { AudioControl } from '@/components/AudioControl';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { audio } from '@/lib/audio';
import {
  getStoredProgress,
  getCustomStories,
  saveCustomStory,
} from '@/lib/storage';

export default function HomePage() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [stories, setStories] = useState<Story[]>(SAMPLE_STORIES);
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('all');
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [selectedCodexConcept, setSelectedCodexConcept] = useState<Concept | null>(null);
  const [progress, setProgress] = useState<UserProgress>({
    unlockedStoryIds: [],
    currentSceneIndex: 0,
    masteredConceptIds: [],
    defeatedBossIds: [],
    stats: {
      totalStoriesCompleted: 0,
      totalConceptsLearned: 0,
      totalBossBattlesWon: 0,
      studyStreakDays: 1,
    },
  });

  // Load custom stories & user progress on mount
  useEffect(() => {
    const custom = getCustomStories();
    if (custom.length > 0) {
      setStories([...custom, ...SAMPLE_STORIES]);
    }
    const currentProg = getStoredProgress();
    setProgress(currentProg);

    // Initial ambient audio trigger on first user click
    const handleFirstClick = () => {
      audio.playAmbient('sunset');
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);

    return () => {
      window.removeEventListener('click', handleFirstClick);
    };
  }, []);

  // Refresh progress state when exiting visual novel player
  const refreshProgress = () => {
    const p = getStoredProgress();
    setProgress(p);
  };

  // Handle newly synthesized custom anime story
  const handleStoryGenerated = (newStory: Story) => {
    saveCustomStory(newStory);
    setStories((prev) => [newStory, ...prev]);
    setActiveStory(newStory);
  };

  // Collect all unique concepts across all stories for the Grimoire
  const allConcepts: Concept[] = React.useMemo(() => {
    const map = new Map<string, Concept>();
    stories.forEach((st) => {
      st.targetConcepts.forEach((c) => {
        if (!map.has(c.id)) {
          map.set(c.id, c);
        }
      });
    });
    return Array.from(map.values());
  }, [stories]);

  // Filtered stories based on selected genre tab
  const filteredStories = stories.filter((s) => {
    if (selectedGenreFilter === 'all') return true;
    if (selectedGenreFilter === 'custom') return s.isCustom;
    return s.subGenre === selectedGenreFilter;
  });

  // If a Visual Novel story is currently running, render the dedicated player
  if (activeStory) {
    return (
      <VisualNovelPlayer
        story={activeStory}
        onExit={() => {
          setActiveStory(null);
          refreshProgress();
        }}
        onStoryCompleted={refreshProgress}
      />
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col justify-between overflow-x-hidden">
      {/* Background Anime Ambience Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0e1b] via-[#090b16] to-[#04060c]" />
        {/* Shinkai style soft colored blooms */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[140px]" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[300px] rounded-full bg-amber-500/10 blur-[160px]" />
        <ParticleCanvas type="dust" density={25} />
      </div>

      {/* Top Floating App Bar */}
      <header className="relative z-30 px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/25 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2 font-anime">
              STORYIFY ANIME
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-mono hidden sm:inline">
                映画風学習VN
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Turn dense textbook chapters into cinematic anime visual novels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Controls */}
          <AudioControl />

          {/* Grimoire Codex Button */}
          <button
            onClick={() => {
              audio.playMenuClick();
              setIsCodexOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-900/80 text-purple-200 text-xs font-semibold border border-purple-500/40 transition-colors shadow-lg shadow-purple-950/50"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Grimoire Codex</span>
            <span className="bg-purple-800 text-purple-200 text-[10px] font-mono px-1.5 py-0.2 rounded-full">
              {progress.masteredConceptIds.length}
            </span>
          </button>

          {/* Create Custom Anime Episode Button */}
          <button
            onClick={() => {
              audio.playMenuClick();
              setIsStudioOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:scale-105"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Transmute Notes</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8">
        {/* Hero Banner Section */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 md:p-10 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-purple-950/40 backdrop-blur-xl shadow-2xl">
          {/* Accent lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              MAKOTO SHINKAI & GHIBLI AESTHETIC ENGINE
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white font-anime tracking-tight leading-tight">
              Where Textbooks Become <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-400">
                Cinematic Anime Stories
              </span>
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
              Convert any dense chapter, biology mechanism, cryptography proof, or physics theorem into an interactive 16:9 visual novel. Master concepts through narrative choices and gated boss exam battles.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>
                  <strong className="text-white">{progress.stats.totalStoriesCompleted}</strong> Stories Cleared
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong className="text-white">{progress.masteredConceptIds.length}</strong> Runes Mastered
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>
                  <strong className="text-white">{progress.stats.totalBossBattlesWon}</strong> Bosses Defeated
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Genre Tabs Filter */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl md:text-2xl font-bold text-white font-anime flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Curriculum Chronicles
            </h3>

            {/* Sub-Genre Filter Pill Buttons */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Sagas' },
                { id: 'isekai', label: '⚔️ Isekai Bio' },
                { id: 'cyberpunk', label: '🌆 Cyberpunk CS' },
                { id: 'academy', label: '🌸 Sci-Fi Physics' },
                { id: 'custom', label: '✨ Transmuted' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    audio.playMenuClick();
                    setSelectedGenreFilter(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedGenreFilter === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => {
              const isCompleted = progress.unlockedStoryIds.includes(story.id);

              return (
                <motion.div
                  key={story.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-3xl overflow-hidden border border-slate-800 hover:border-purple-500/60 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.25)] transition-all"
                >
                  {/* Card Cover (16:9) */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Genre Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono uppercase tracking-wide backdrop-blur-md bg-black/60 text-white border border-white/20">
                        {story.subGenre === 'isekai' && '⚔️ Isekai Fantasy'}
                        {story.subGenre === 'cyberpunk' && '🌆 Cyberpunk Heist'}
                        {story.subGenre === 'academy' && '🌸 Sci-Fi Academy'}
                      </span>
                    </div>

                    {/* Completion Tag */}
                    {isCompleted && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                        <ShieldCheck className="w-3.5 h-3.5" /> CLEARED
                      </div>
                    )}

                    {/* Japanese Title */}
                    {story.japaneseTitle && (
                      <div className="absolute bottom-2 left-4 text-xs font-serif text-slate-300/80 italic tracking-wider">
                        {story.japaneseTitle}
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-1">
                        {story.subjectCategory}
                      </div>
                      <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors font-anime leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    {/* Target Concepts Chips */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Key Syllabus Runes:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {story.targetConcepts.slice(0, 3).map((c) => (
                          <span
                            key={c.id}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 font-medium"
                          >
                            {c.name}
                          </span>
                        ))}
                        {story.targetConcepts.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-lg bg-slate-900 text-[10px] text-slate-400">
                            +{story.targetConcepts.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => {
                        audio.playMenuClick();
                        setActiveStory(story);
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/20 transition-all transform hover:scale-[1.02]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Launch Visual Novel ({story.estimatedMinutes}m)</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-20 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Storyify Anime • Advanced Interactive Visual Novel Learning System</span>
        </div>
        <div className="font-mono text-slate-400 mt-2 sm:mt-0">
          Makoto Shinkai & Studio Ghibli Inspired • Web Audio API Synthesizer
        </div>
      </footer>

      {/* Story Studio Modal (PDF/Textbook upload & transmutation) */}
      <StoryStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        onStoryGenerated={handleStoryGenerated}
      />

      {/* Grimoire Codex Modal */}
      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        concepts={allConcepts}
        masteredIds={progress.masteredConceptIds}
        onSelectConcept={(concept) => setSelectedCodexConcept(concept)}
      />
    </main>
  );
}
