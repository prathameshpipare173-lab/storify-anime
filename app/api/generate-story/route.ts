import { NextRequest, NextResponse } from 'next/server';
import { synthesizeAnimeStory } from '@/lib/storySynthesizer';
import { SubGenre, Story } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, rawText, subGenre, apiKey, mood } = body;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Textbook text content is required' }, { status: 400 });
    }

    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

    // If an OpenAI API key is supplied, attempt live GPT-4o structured JSON generation
    if (effectiveApiKey && effectiveApiKey.startsWith('sk-')) {
      try {
        const systemPrompt = `You are a Principal Anime Visual Novel Scriptwriter, Game UX Designer, and STEM Educator.
Transform the user's provided textbook excerpt into a cinematic anime visual novel episode.
Return ONLY valid JSON matching this Story schema:
{
  "id": "story-gpt-generated",
  "title": "Anime Title in English",
  "japaneseTitle": "Japanese Title with furigana/kanji",
  "subGenre": "${subGenre || 'isekai'}",
  "subjectCategory": "Topic Category",
  "summary": "2-sentence dramatic hook synopsis",
  "coverImage": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80",
  "defaultMood": "${mood || (subGenre === 'cyberpunk' ? 'cyberpunk' : subGenre === 'academy' ? 'sunset' : 'celestial')}",
  "estimatedMinutes": 6,
  "targetConcepts": [
    {
      "id": "c1",
      "name": "Concept Name",
      "tag": "[[Concept Name]]",
      "category": "Curriculum Field",
      "textbookDefinition": "Formal rigorous academic definition",
      "animeLore": "In-universe anime lore analogy",
      "mnemonic": "Memorable anime memory hook"
    }
  ],
  "scenes": [
    {
      "id": "scene-1",
      "sceneNumber": 1,
      "title": "Scene Name",
      "locationName": "Anime Location",
      "backgroundType": "sacred_forest",
      "moodShader": "celestial",
      "particles": "starlight",
      "dialogue": [
        {
          "id": "d1",
          "speakerId": "speaker_id",
          "speakerName": "Speaker Name",
          "speakerTitle": "Character Title",
          "avatarUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
          "emotion": "excited",
          "side": "left",
          "text": "Dialogue line with [[Concept Name]] tags included."
        }
      ],
      "bossBattle": {
        "id": "boss-1",
        "title": "BOSS ENCOUNTER: Boss Name",
        "bossName": "Boss Name",
        "bossTitle": "Title",
        "bossAvatar": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
        "bossMaxHp": 100,
        "bossHp": 100,
        "playerMaxHp": 100,
        "playerHp": 100,
        "dialogueIntro": "Intro challenge",
        "dialogueVictory": "Victory remark",
        "dialogueDefeat": "Defeat remark",
        "actions": [
          {
            "id": "a1",
            "title": "Correct Tactical Action using Concept",
            "conceptId": "c1",
            "conceptName": "Concept Name",
            "description": "Scientific justification",
            "isCorrect": true,
            "explanation": "Why this textbook answer is correct",
            "damage": 50
          },
          {
            "id": "a2",
            "title": "Incorrect Plausible Distractor",
            "conceptId": "c1",
            "conceptName": "Distractor",
            "description": "Flawed scientific assumption",
            "isCorrect": false,
            "explanation": "Why this textbook misconception is wrong",
            "damage": 10
          }
        ]
      }
    }
  ]
}`;

        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${effectiveApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Textbook Excerpt:\nTitle: ${title || 'Chapter Study'}\nSub-Genre: ${subGenre}\nContent:\n${rawText}` },
            ],
            temperature: 0.7,
          }),
        });

        if (gptResponse.ok) {
          const gptData = await gptResponse.json();
          const parsed = JSON.parse(gptData.choices[0].message.content) as Story;
          parsed.id = 'story-gpt-' + Date.now();
          parsed.isCustom = true;
          return NextResponse.json({ story: parsed, source: 'openai' });
        }
      } catch (err) {
        console.warn('OpenAI generation failed, gracefully falling back to local synthesizer', err);
      }
    }

    // Default or Fallback: Built-in local anime narrative synthesizer
    const localStory = synthesizeAnimeStory({
      title: title || 'Curriculum Chronicles',
      rawText,
      subGenre: (subGenre as SubGenre) || 'isekai',
      mood: mood,
    });

    return NextResponse.json({ story: localStory, source: 'local_synthesizer' });
  } catch (error) {
    console.error('Failed to generate story', error);
    return NextResponse.json({ error: 'Internal server error while synthesizing story' }, { status: 500 });
  }
}
