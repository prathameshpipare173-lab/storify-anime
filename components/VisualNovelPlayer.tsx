'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Sparkles,
  BookMarked,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { Story, Concept, Scene, MoodShader } from '@/lib/types';
import { SceneBackground } from './SceneBackground';
import { ParticleCanvas } from './ParticleCanvas';
import { ThemeShader } from './ThemeShader';
import { DialogueBox } from './DialogueBox';
import { ConceptModal } from './ConceptModal';
import { BossBattleOverlay } from './BossBattleOverlay';
import { BacklogModal } from './BacklogModal';
import { AudioControl } from './AudioControl';
import { audio } from '@/lib/audio';
import {
  unlockConceptInStorage,
  recordBossVictoryInStorage,
  recordStoryCompletionInStorage,
  getStoredProgress,
} from '@/lib/storage';

interface VisualNovelPlayerProps {
  story: Story;
  onExit: () => void;
  onStoryCompleted?: () => void;
}

export const VisualNovelPlayer: React.FC<VisualNovelPlayerProps> = ({
  story,
  onExit,
  onStoryCompleted,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [currentDialogueIdx, setCurrentDialogueIdx] = useState<number>(0);
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [isBossBattleActive, setIsBossBattleActive] = useState<boolean>(false);
  const [isBacklogOpen, setIsBacklogOpen] = useState<boolean>(false);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isChapterFinished, setIsChapterFinished] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentScene: Scene = story.scenes[currentSceneIdx] || story.scenes[0];
  const currentDialogue = currentScene.dialogue[currentDialogueIdx] || currentScene.dialogue[0];

  // Load mastered concepts on mount
  useEffect(() => {
    const progress = getStoredProgress();
    setMasteredIds(progress.masteredConceptIds);
  }, []);

  // Sync ambient audio on scene or story load
  useEffect(() => {
    const mood = currentScene.moodShader || story.defaultMood;
    if (mood === 'cyberpunk') {
      audio.playAmbient('cyber');
    } else if (mood === 'sunset') {
      audio.playAmbient('sunset');
    } else {
      audio.playAmbient('celestial');
    }

    return () => {
      // Audio stops or changes on unmount
    };
  }, [currentSceneIdx, currentScene.moodShader, story.defaultMood]);

  // Advance dialogue or trigger boss battle / next scene
  const handleAdvanceDialogue = () => {
    if (currentDialogueIdx < currentScene.dialogue.length - 1) {
      setCurrentDialogueIdx((prev) => prev + 1);
    } else {
      // End of scene reached
      if (currentScene.bossBattle && !isBossBattleActive) {
        setIsBossBattleActive(true);
      } else {
        handleAdvanceScene();
      }
    }
  };

  // Advance to next scene or trigger chapter victory
  const handleAdvanceScene = () => {
    if (currentSceneIdx < story.scenes.length - 1) {
      setCurrentSceneIdx((prev) => prev + 1);
      setCurrentDialogueIdx(0);
      setIsBossBattleActive(false);
    } else {
      // Complete Chapter!
      setIsChapterFinished(true);
      recordStoryCompletionInStorage(story.id);
      audio.playVictoryJingle();
      if (onStoryCompleted) {
        onStoryCompleted();
      }
    }
  };

  // Find concept by name and open modal
  const handleConceptClick = (conceptName: string) => {
    const found =
      story.targetConcepts.find(
        (c) => c.name.toLowerCase() === conceptName.toLowerCase()
      ) || {
        id: `c-${Date.now()}`,
        name: conceptName,
        tag: `[[${conceptName}]]`,
        category: 'Syllabus Law',
        textbookDefinition: `A pivotal concept governing the curriculum mechanics of this story arc.`,
        animeLore: `The foundational law of ${conceptName} holding the realm in equilibrium.`,
        mnemonic: `Master ${conceptName} to ace your examinations!`,
      };

    setSelectedConcept(found);
  };

  // Master concept in modal
  const handleMasterConcept = (conceptId: string) => {
    unlockConceptInStorage(conceptId);
    if (!masteredIds.includes(conceptId)) {
      setMasteredIds((prev) => [...prev, conceptId]);
    }
  };

  // Boss battle victory
  const handleBossVictory = () => {
    if (currentScene.bossBattle) {
      recordBossVictoryInStorage(currentScene.bossBattle.id);
    }
    setIsBossBattleActive(false);
    handleAdvanceScene();
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex flex-col items-center justify-center select-none">
      {/* 16:9 Cinematic Stage Frame Container */}
      <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw] overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Dynamic Background Layer */}
        <SceneBackground
          type={currentScene.backgroundType}
          customCss={currentScene.customBackgroundCss}
        >
          {/* Particles (Sakura, Starlight, Dust, Data) */}
          <ParticleCanvas type={currentScene.particles} />

          {/* Anime Mood Shader & Letterbox Overlay */}
          <ThemeShader mood={currentScene.moodShader} />

          {/* Top Cinematic Navigation HUD */}
          <div className="absolute top-4 inset-x-4 md:inset-x-8 z-40 flex items-center justify-between pointer-events-auto">
            {/* Left: Back & Story Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  audio.playMenuClick();
                  onExit();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md border border-slate-700/80 transition-colors shadow-lg"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="hidden sm:flex flex-col bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-white font-anime tracking-wide">
                  {story.title}
                </span>
                <span className="text-[10px] text-amber-300/80 font-mono">
                  Scene {currentScene.sceneNumber}: {currentScene.title}
                </span>
              </div>
            </div>

            {/* Right: Audio Control & Fullscreen */}
            <div className="flex items-center gap-2">
              <AudioControl />

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md border border-slate-700/80 transition-colors shadow-lg"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Scene Location Badge (Top Right Sub-HUD) */}
          <div className="absolute top-16 right-6 md:right-10 z-30 pointer-events-none">
            <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300/90 tracking-widest uppercase">
              ◈ {currentScene.locationName}
            </div>
          </div>

          {/* Dialogue Box Interface */}
          {!isChapterFinished && !isBossBattleActive && (
            <DialogueBox
              dialogue={currentDialogue}
              subGenre={story.subGenre}
              onNext={handleAdvanceDialogue}
              onConceptClick={handleConceptClick}
              onOpenBacklog={() => setIsBacklogOpen(true)}
              isAutoPlay={isAutoPlay}
              onToggleAutoPlay={() => setIsAutoPlay(!isAutoPlay)}
            />
          )}

          {/* Boss Battle Overlay */}
          <AnimatePresence>
            {isBossBattleActive && currentScene.bossBattle && (
              <BossBattleOverlay
                battle={currentScene.bossBattle}
                onVictory={handleBossVictory}
                onConceptLearnMore={handleConceptClick}
              />
            )}
          </AnimatePresence>

          {/* Chapter Victory / Completion Screen */}
          <AnimatePresence>
            {isChapterFinished && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
              >
                <div className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-300 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)] mb-6 animate-pulse">
                  <Trophy className="w-10 h-10 text-slate-950" />
                </div>

                <div className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase mb-2">
                  CURRICULUM CHAPTER COMPLETE
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-white font-anime tracking-tight max-w-xl mb-3">
                  {story.title}
                </h1>

                <p className="text-sm md:text-base text-slate-300 max-w-lg mb-8 leading-relaxed">
                  Congratulations, Scholar! You have successfully mastered the curriculum principles and triumphed through the interactive visual novel.
                </p>

                {/* Concepts Mastered Summary */}
                <div className="flex flex-wrap justify-center gap-2 max-w-lg mb-8">
                  {story.targetConcepts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-xs text-purple-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {c.name}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      audio.playMenuClick();
                      setCurrentSceneIdx(0);
                      setCurrentDialogueIdx(0);
                      setIsChapterFinished(false);
                      setIsBossBattleActive(false);
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" /> Replay Story
                  </button>

                  <button
                    onClick={() => {
                      audio.playMenuClick();
                      onExit();
                    }}
                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-sm font-bold shadow-xl shadow-amber-500/30 transition-all transform hover:scale-105"
                  >
                    Return to Chapter Hub
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SceneBackground>
      </div>

      {/* Floating Concept Info Card Modal */}
      <ConceptModal
        concept={selectedConcept}
        subGenre={story.subGenre}
        isMastered={selectedConcept ? masteredIds.includes(selectedConcept.id) : false}
        onClose={() => setSelectedConcept(null)}
        onMaster={handleMasterConcept}
      />

      {/* Dialogue Backlog Drawer */}
      <BacklogModal
        dialogues={currentScene.dialogue}
        currentIndex={currentDialogueIdx}
        isOpen={isBacklogOpen}
        onClose={() => setIsBacklogOpen(false)}
        onSelectConcept={handleConceptClick}
      />
    </div>
  );
};
