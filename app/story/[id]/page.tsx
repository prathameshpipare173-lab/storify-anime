'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SAMPLE_STORIES } from '@/lib/sampleStories';
import { getCustomStories } from '@/lib/storage';
import { VisualNovelPlayer } from '@/components/VisualNovelPlayer';
import { Story } from '@/lib/types';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function StoryPage() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storyId = params?.id as string;
    if (!storyId) return;

    // Search sample stories and custom stored stories
    const all = [...SAMPLE_STORIES, ...getCustomStories()];
    const found = all.find((s) => s.id === storyId);

    if (found) {
      setStory(found);
    }
    setIsLoading(false);
  }, [params]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#070a13] flex flex-col items-center justify-center text-white">
        <Sparkles className="w-8 h-8 text-amber-400 animate-spin mb-4" />
        <span className="font-anime text-lg tracking-wide">Loading Anime Visual Novel...</span>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-screen w-screen bg-[#070a13] flex flex-col items-center justify-center text-white p-6 text-center">
        <h2 className="text-2xl font-bold font-anime text-rose-400 mb-2">Story Chapter Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested anime story identifier does not exist or has expired.
        </p>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Chapter Hub
        </button>
      </div>
    );
  }

  return (
    <VisualNovelPlayer
      story={story}
      onExit={() => router.push('/')}
      onStoryCompleted={() => router.push('/')}
    />
  );
}
