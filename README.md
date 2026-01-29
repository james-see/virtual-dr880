# Virtual DR-880

A browser-based emulator of the Boss DR-880 Dr. Rhythm drum machine, built with Astro, Svelte, and the Web Audio API.

## Features

- **20 Velocity-Sensitive Pads**: Play drum sounds with touch/click, simulating velocity-sensitive response
- **3 Drum Banks + Bass**: DRUM 1, DRUM 2, DRUM 3 banks plus chromatic bass pads
- **96 PPQN Sequencer**: High-resolution pattern playback with precise timing
- **Step Sequencer**: Visual grid-based pattern editor
- **Dual UI Modes**: Switch between modern interface and skeuomorphic hardware replica
- **65+ Samples**: AI-generated drum and bass samples using ElevenLabs
- **Persistent Storage**: Patterns, kits, and settings saved to IndexedDB
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: [Astro](https://astro.build/) with [Svelte](https://svelte.dev/) components
- **Audio**: Web Audio API for sample playback and mixing
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Storage**: IndexedDB via [idb](https://github.com/jakearchibald/idb)
- **Samples**: Generated using [ElevenLabs](https://elevenlabs.io/) text-to-sound-effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/virtual-dr880.git
cd virtual-dr880

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment

This project is configured for GitHub Pages deployment. Push to the `main` branch and the GitHub Actions workflow will automatically build and deploy.

To deploy manually:

1. Update `astro.config.mjs` with your GitHub username and repository name
2. Push to GitHub
3. Enable GitHub Pages in repository settings (use GitHub Actions as source)

## Project Structure

```
virtual-dr880/
├── src/
│   ├── components/
│   │   ├── ui/              # Shared UI components (Pad, Display, etc.)
│   │   ├── modern/          # Modern interface components
│   │   └── skeuomorphic/    # Hardware replica components
│   ├── lib/
│   │   ├── audio/           # Web Audio engine
│   │   ├── sequencer/       # Pattern playback engine
│   │   └── data/            # Types, presets, storage
│   └── pages/
│       └── index.astro      # Main page
├── public/
│   └── samples/             # Audio samples (MP3)
└── .github/
    └── workflows/           # GitHub Actions for deployment
```

## Controls

### Pads
- Click/tap pads to play sounds
- Shorter press = higher velocity (harder hit)
- Keyboard: Focus a pad and press Space/Enter

### Transport
- **Play/Pause**: Start/stop pattern playback
- **Stop**: Stop and reset to beginning
- **Record**: (Coming soon) Real-time recording

### Pad Banks
- **DRUM 1**: Standard kit (kick, snare, hats, toms, cymbals)
- **DRUM 2**: Percussion (congas, bongos, shakers, etc.)
- **DRUM 3**: Electronic (808, 909, FX sounds)
- **BASS**: Chromatic bass notes (±1 octave)

## License

MIT License - Feel free to use, modify, and distribute.

## Acknowledgments

- Boss/Roland for the original DR-880 drum machine
- ElevenLabs for AI-generated samples
- The Astro and Svelte communities

## Disclaimer

This is an independent project not affiliated with or endorsed by Roland Corporation or BOSS. The DR-880 name and design are trademarks of Roland Corporation.
