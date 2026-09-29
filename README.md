# 🌸 Storyify Anime (映画風アニメ学習アドベンチャー)

> **Transform dense textbook chapters into cinematic, anime-style interactive visual stories.**  
> Inspired by Makoto Shinkai (*Your Name*, *Weathering with You*, *Suzume*) and Studio Ghibli.

---

## ✨ Visual & Art Direction

- **Cinematic 16:9 Scene Frames**: Letterboxed visual novel aspect ratios, responsive scaling, and full-screen immersion.
- **Subtle Parallax Backgrounds**: Dynamic CSS and SVG canvas multi-plane backgrounds responding to cursor movement (clouds, skylines, utility poles, and bioluminescent shrines).
- **Dynamic Particle Engine**: High-performance canvas particle system rendering:
  - 🌸 **Sakura Drift**: Rotational fluttering cherry blossom petals.
  - ☀️ **Golden Dust Motes**: Soft Brownian-motion bokeh dust particles in golden hour light.
  - 💻 **Cyber Bits**: Glowing hex and binary particles floating upward through digital rain.
  - ✨ **Celestial Starlight**: 4-point twinkling mana sparkles.
- **Preset Anime Mood Shaders**:
  - 🌇 **Sunset Schoolyard**: Warm golden hour glow, soft lo-fi aesthetics, telegraph pole silhouettes.
  - 🌆 **Cyberpunk Metropolis**: Neon cyan and magenta duotone grades, dark glass reflections, CRT scanline overlay.
  - 🔮 **Celestial / Fantasy Realm**: Deep violet twilight, starry nebula blooms, mystical crystal spires.
- **Visual Novel / RPG Dialogue Interface**:
  - Glassmorphic dialogue box pinned at bottom with character portraits and emotional reactive animations (Neutral, Excited, Serious, Shocked, Thinking, Victorious).
  - Letter-by-letter streaming typewriter effect with pitch-shifted audio click blips.
  - Glowing **`[[Concept Name]]`** runes that open an anime info card with textbook definitions, in-universe lore analogies, and mnemonics.
  - Controls: Auto-Play, Backlog History Log, Typing SFX Toggle, Fast Forward.

---

## ⚔️ Anime Sub-Genres & Built-in Sagas

1. **⚔️ Isekai Fantasy (*Eldoria's Living Core: Cellular Respiration & The ATP Alchemists*)**
   - **Curriculum Domain**: Biology, Biochemistry, Medicine
   - **Concepts**: Mitochondria, Glycolysis, Krebs Cycle, Electron Transport Chain, ATP Synthase
   - **Climax**: Gated Boss Battle against Lord Necros (The Hypoxic Sovereign).

2. **🌆 Cyberpunk Heist (*Protocol Zero: Breaking the RSA Cipher Matrix*)**
   - **Curriculum Domain**: Computer Science, Mathematics, Cryptography
   - **Concepts**: Asymmetric Cryptography, Prime Factorization, Modular Arithmetic, Shor's Quantum Algorithm
   - **Climax**: Cyber-Duel against Sentinel AXIOM (Guardian of the 2048-Bit Cipher Gate).

3. **🌸 Slice of Life / Sci-Fi Academy (*The Sakura Clock: Special Relativity & The Spacetime Express*)**
   - **Curriculum Domain**: Modern Physics, Special Relativity
   - **Concepts**: Speed of Light Invariance, Time Dilation, Length Contraction, Muon Lifetime Extension
   - **Climax**: Academy Physics Grand Prix Exam Duel against Rival Tachibana.

---

## 🧠 Core Features & Systems

### 1. Textbook Transmutation Studio
- Accepts file drag-and-drop (`.txt`, `.pdf`, `.md`, `.json`) or direct text paste.
- Sub-genre selector mapping curriculum topics to anime tropes.
- One-click sample loaders (Photosynthesis, TCP 3-Way Handshake, Newton's Third Law).
- **Dual AI Processing**:
  - **OpenAI GPT-4o Mode**: Enter your API key in the studio to generate custom structured anime stories.
  - **Built-in Local Neural Synthesizer**: Runs 100% offline with zero API key required, automatically extracting definitions and formulating anime dialogue, character motivations, and boss battles!

### 2. Gated Boss Battle / Academy Exam Checkpoints
- Real-time anime RPG combat overlay with Boss HP bar and Student Comprehension meter.
- Action deck mapping academic concepts to tactical abilities.
- Critical hit explosions, recoil screen shakes, and victory fanfare jingles.
- Helpful instructional feedback for incorrect answers.

### 3. Procedural Web Audio API Soundscape
- **100% self-contained**: Zero external audio downloads or broken mp3 links!
- **Procedural BGM Tracks**:
  - 🌧️ *Lo-Fi Rain & Vinyl Crackle* (filtered pink noise with acoustic guitar minor 7th chords)
  - 🌇 *Sunset Schoolyard Lo-Fi* (warm triangle bass with Shinkai-style acoustic piano notes)
  - 🌆 *Cyberpunk Pulse* (detuned saw bass with arpeggiated synth pulses)
  - ✨ *Celestial Fantasy Pad* (shimmering sine cluster chords with magical bell chimes)
- **Procedural SFX**: Typewriter dialogue clicks, menu select chirps, rune reveal chimes, boss alarms, critical hit blasts, and victory fanfares.

### 4. The Grand Anime Grimoire (Concept Codex)
- Tracks mastered syllabus runes across all completed visual novels.
- Filter by curriculum field, search definitions, or review anime lore mnemonics.
- Persistent storage in browser LocalStorage.

---

## 🚀 Getting Started

Node.js portable is already downloaded on your system at `C:\Users\prathamesh pipare\nodejs`.

### Option A: One-Click Windows Launch
Double-click `start.bat` in this folder:
```cmd
start.bat
```
*(This automatically adds the portable Node.js to your PATH, installs dependencies, and launches the Next.js dev server).*

### Option B: PowerShell
Run `start.ps1` in PowerShell:
```powershell
.\start.ps1
```

### Option C: Manual CLI
```bash
# Add node to PATH if needed
$env:PATH = "C:\Users\prathamesh pipare\nodejs;" + $env:PATH

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser!
