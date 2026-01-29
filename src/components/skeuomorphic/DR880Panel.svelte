<script lang="ts">
  import { 
    currentPattern, 
    currentKit, 
    tempo, 
    isPlaying,
    currentMeasure,
    currentBeat,
    masterVolume,
    drumVolume,
    bassVolume,
    currentPadBank
  } from '../../lib/stores';
  import { startSequencer, stopSequencer, resetSequencer } from '../../lib/sequencer/Sequencer';
  import { getDefaultKit, getDefaultPattern, DRUM1_INSTRUMENTS } from '../../lib/data/presets';
  import { playSample } from '../../lib/audio/SamplePlayer';
  import { getSampleUrl } from '../../lib/data/presets';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$currentKit) currentKit.set(getDefaultKit());
    if (!$currentPattern) currentPattern.set(getDefaultPattern());
  });

  function handlePlay() {
    $isPlaying ? stopSequencer() : startSequencer();
  }

  function handleStop() {
    stopSequencer();
    resetSequencer();
  }

  // Knob interaction with scroll wheel
  function handleKnobWheel(event: WheelEvent, store: typeof masterVolume) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -2 : 2;
    store.update(v => Math.max(0, Math.min(100, v + delta)));
  }

  // Knob rotation (0-100 maps to -135deg to 135deg)
  function getKnobRotation(value: number): string {
    return `rotate(${(value / 100) * 270 - 135}deg)`;
  }

  // Play pad sound
  async function playPad(index: number) {
    const kit = $currentKit || getDefaultKit();
    const pad = kit.pads[index];
    if (pad) {
      const url = getSampleUrl(pad.instrumentId);
      await playSample(url, { velocity: 100, level: pad.level, pan: pad.pan, pitch: pad.pitch });
    }
  }
</script>

<!-- Wide landscape layout matching DR-880 -->
<div class="w-full max-w-5xl mx-auto select-none">
  
  <!-- Main Panel - Blue/Gray metallic -->
  <div class="bg-gradient-to-b from-[#9ab4c8] via-[#8aa8bc] to-[#7a9cb0] rounded-lg shadow-2xl overflow-hidden">
    
    <!-- Top connector strip -->
    <div class="bg-[#6a8a9d] px-4 py-0.5 flex justify-between text-[6px] text-[#4a6a7d] font-medium tracking-wider border-b border-[#5a7a8d]">
      <span>L(MONO)</span><span>R</span><span>A-INDIVIDUAL-B</span><span>CH 1,2</span>
      <span>CH 3,4 DIGITAL OUT</span><span>IN—MIDI—OUT</span><span>USB</span><span>POWER</span><span>AC IN</span>
    </div>

    <!-- TOP DARK SECTION: Logo, Knobs, Display, Value Dial -->
    <div class="bg-[#1a2a3a] p-4 flex items-center gap-6">
      
      <!-- Left: BOSS Logo and Model -->
      <div class="flex-shrink-0 w-44">
        <div class="flex items-center gap-1 mb-1">
          <span class="bg-white text-[#1a1a1a] text-xs px-1 font-black">▌</span>
          <span class="text-white text-2xl font-black tracking-tight" style="font-family: 'Arial Black', 'Helvetica', sans-serif;">BOSS</span>
        </div>
        <div class="text-[#88bbdd] text-sm italic font-medium">Dr.Rhythm</div>
        <div class="text-[#5588aa] text-3xl font-bold tracking-tight">DR-880</div>
        
        <!-- 4 Knobs -->
        <div class="flex gap-2 mt-3">
          {#each [
            { label: 'GUITAR/BASS\nINPUT', value: 50, store: null },
            { label: 'DRUM\nPART LEVEL', value: $drumVolume, store: drumVolume },
            { label: 'BASS\nPART LEVEL', value: $bassVolume, store: bassVolume },
            { label: 'MASTER\nVOLUME', value: $masterVolume, store: masterVolume }
          ] as knob, i}
            <div class="text-center">
              <div 
                class="w-8 h-8 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] border border-[#555] shadow-lg mx-auto cursor-pointer relative"
                onwheel={(e) => knob.store && handleKnobWheel(e, knob.store)}
                title="Scroll to adjust"
              >
                <div class="absolute inset-0.5 rounded-full bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] flex items-center justify-center">
                  <div class="w-0.5 h-3 bg-white rounded-full origin-bottom" style="transform: {getKnobRotation(knob.value)}; transform-origin: center 75%;"></div>
                </div>
              </div>
              <div class="text-[6px] text-[#6a8a9a] mt-1 whitespace-pre-line leading-tight">{knob.label}</div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Center: LCD Display -->
      <div class="flex-grow max-w-md">
        <div class="bg-[#5a8a4a] rounded border-4 border-[#2a2a2a] p-3 shadow-inner" style="box-shadow: inset 0 2px 10px rgba(0,0,0,0.6);">
          <div class="flex justify-between items-start">
            <!-- Left: Pattern info -->
            <div>
              <div class="text-[#2a4a2a] text-[8px] font-medium">PATTERN PRESET</div>
              <div class="text-[#1a3a1a] text-4xl font-mono font-black leading-none tracking-tighter" style="font-family: 'Courier New', monospace;">
                {String($currentPattern?.id || '500').padStart(3, '0').slice(-3)}
              </div>
              <div class="flex gap-6 mt-2">
                <div>
                  <div class="text-[#2a4a2a] text-[8px]">TEMPO</div>
                  <div class="text-[#1a3a1a] text-xl font-mono font-bold">{$tempo}</div>
                </div>
                <div>
                  <div class="text-[#2a4a2a] text-[8px]">KEY</div>
                  <div class="text-[#1a3a1a] text-xl font-mono font-bold">Am</div>
                </div>
              </div>
            </div>
            <!-- Right: Branding -->
            <div class="text-right">
              <div class="text-[#2a4a2a] text-[10px] font-black">▌BOSS</div>
              <div class="text-[#2a4a2a] text-xs italic">Dr.Rhythm</div>
              <div class="mt-1">
                <!-- Drummer icon placeholder -->
                <div class="text-[#2a4a2a] text-2xl">🥁</div>
              </div>
              <div class="text-[#1a3a1a] text-2xl font-bold mt-1">DR-880</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Value Dial -->
      <div class="flex-shrink-0 text-center">
        <div 
          class="w-24 h-24 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] border-2 border-[#444] shadow-xl relative cursor-pointer"
          onwheel={(e) => { e.preventDefault(); tempo.update(t => Math.max(20, Math.min(260, t + (e.deltaY > 0 ? -1 : 1)))); }}
          title="Scroll to adjust tempo"
        >
          <div class="absolute inset-2 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]">
            <div class="absolute inset-2 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#151515] flex items-center justify-center">
              <div class="w-1 h-6 bg-white rounded-full" style="transform: rotate(-30deg); transform-origin: center 100%;"></div>
            </div>
          </div>
        </div>
        <div class="text-[#8ab] text-xs mt-2 font-medium">VALUE</div>
      </div>
    </div>

    <!-- MIDDLE SECTION: Buttons on LEFT, Pads on RIGHT -->
    <div class="p-3 flex gap-4">
      
      <!-- LEFT: Control buttons -->
      <div class="flex-shrink-0 w-64 space-y-2">
        
        <!-- Row 1: Guitar/Bass + COSM + EZ Compose + Groove/TSC -->
        <div class="flex gap-1 flex-wrap">
          <div class="bg-[#7a9aaa]/50 rounded p-1">
            <div class="text-[6px] text-[#4a6a7a] mb-0.5">GUITAR/BASS INPUT</div>
            <div class="flex gap-0.5">
              <button class="px-1.5 py-0.5 bg-[#cc4444] hover:bg-[#dd5555] text-white text-[8px] font-bold rounded">EFFECT</button>
              <button class="px-1.5 py-0.5 bg-[#cc4444] hover:bg-[#dd5555] text-white text-[8px] font-bold rounded">TUNER</button>
            </div>
          </div>
          <div class="bg-[#7a9aaa]/50 rounded p-1">
            <div class="text-[6px] text-[#4a6a7a] mb-0.5">COSM</div>
            <button class="px-1.5 py-0.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[8px] rounded">OUTPUT<br/>SETTING</button>
          </div>
        </div>

        <!-- EZ Compose row -->
        <div class="flex gap-1 items-center">
          <div class="bg-[#7a9aaa]/50 rounded p-1 flex-grow">
            <div class="text-[6px] text-[#4a6a7a] mb-0.5 text-center">EZ COMPOSE</div>
            <div class="flex gap-0.5 justify-center">
              <button class="px-1.5 py-0.5 bg-[#338833] hover:bg-[#449944] text-white text-[7px] rounded">PATTERN</button>
              <button class="px-1.5 py-0.5 bg-[#338833] hover:bg-[#449944] text-white text-[7px] rounded">CHORD<br/>PROG</button>
              <button class="px-1.5 py-0.5 bg-[#338833] hover:bg-[#449944] text-white text-[7px] rounded">FILL IN</button>
            </div>
          </div>
          <div class="flex flex-col gap-0.5">
            <button class="px-1.5 py-0.5 bg-[#338833] hover:bg-[#449944] text-white text-[7px] rounded">GROOVE</button>
            <button class="px-1.5 py-1 bg-[#cc4444] hover:bg-[#dd5555] text-white text-[8px] font-bold rounded">TSC</button>
          </div>
        </div>

        <!-- Row 2: SONG KIT PAD + Cursor -->
        <div class="flex gap-2 items-center">
          <div>
            <div class="text-[6px] text-[#4a6a7a] mb-0.5">PATTERN</div>
            <div class="flex gap-0.5">
              <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[8px] rounded">SONG</button>
              <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[8px] rounded">KIT</button>
              <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[8px] rounded">PAD</button>
            </div>
          </div>
          <!-- Cursor diamond -->
          <div class="text-[6px] text-[#4a6a7a]">CURSOR</div>
          <div class="grid grid-cols-3 gap-0 w-12">
            <div></div>
            <button class="w-4 h-3 bg-[#d0d0d0] hover:bg-[#e0e0e0] flex items-center justify-center text-[8px] text-[#333]">▲</button>
            <div></div>
            <button class="w-4 h-3 bg-[#d0d0d0] hover:bg-[#e0e0e0] flex items-center justify-center text-[8px] text-[#333]">◀</button>
            <div class="w-4 h-3"></div>
            <button class="w-4 h-3 bg-[#d0d0d0] hover:bg-[#e0e0e0] flex items-center justify-center text-[8px] text-[#333]">▶</button>
            <div></div>
            <button class="w-4 h-3 bg-[#d0d0d0] hover:bg-[#e0e0e0] flex items-center justify-center text-[8px] text-[#333]">▼</button>
            <div></div>
          </div>
        </div>

        <!-- Row 3: SHIFT DISPLAY EDIT EXIT ENTER -->
        <div class="flex gap-0.5">
          <button class="px-1.5 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">SHIFT</button>
          <button class="px-1.5 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">DISPLAY</button>
          <button class="px-1.5 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">EDIT</button>
          <button class="px-1.5 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">EXIT</button>
          <button class="px-1.5 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">ENTER</button>
        </div>

        <!-- Row 4: Transport buttons -->
        <div class="flex gap-1 items-center">
          <button class="w-6 h-6 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded flex items-center justify-center text-white text-xs">⏮</button>
          <button class="w-6 h-6 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded flex items-center justify-center text-white text-xs">⏪</button>
          <button class="w-6 h-6 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded flex items-center justify-center text-white text-xs">⏩</button>
          <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">LOOP</button>
          <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">KEY</button>
          <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[7px] rounded">TEMPO</button>
        </div>

        <!-- Row 5: Stop Play Rec -->
        <div class="flex gap-2 items-center pt-1">
          <button onclick={handleStop} class="w-10 h-8 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded-lg shadow flex items-center justify-center">
            <div class="w-4 h-4 bg-[#666] rounded-sm"></div>
          </button>
          <button onclick={handlePlay} class="w-14 h-8 rounded-lg shadow flex items-center justify-center transition-colors {$isPlaying ? 'bg-[#55bb55]' : 'bg-[#44aa44] hover:bg-[#55bb55]'}">
            <div class="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
          </button>
          <button class="w-10 h-8 bg-[#3a3a3a] hover:bg-[#aa3333] rounded-lg shadow flex items-center justify-center">
            <div class="w-5 h-5 bg-[#cc3333] rounded-full border-2 border-[#aa2222]"></div>
          </button>
          <div class="text-[6px] text-[#4a6a7a] ml-1">WRITE</div>
        </div>
      </div>

      <!-- RIGHT: 4x5 Pad Grid -->
      <div class="flex-grow">
        <div class="grid grid-cols-5 gap-1.5">
          {#each DRUM1_INSTRUMENTS as inst, i}
            <button
              class="aspect-square bg-[#2a2a2a] hover:bg-[#3a3a3a] active:bg-[#4a4a4a] rounded shadow-md flex flex-col items-center justify-center p-1 transition-colors border border-[#1a1a1a]"
              onmousedown={() => playPad(i)}
            >
              <div class="text-[8px] text-[#888] absolute top-0.5 left-1">{inst.padNum}</div>
              <div class="text-[8px] text-[#888] absolute top-0.5 right-1">{inst.note}</div>
              <span class="text-[9px] text-[#aaa] font-medium text-center leading-tight mt-2">{inst.name}</span>
            </button>
          {/each}
        </div>
        <div class="text-right text-[8px] text-[#4a6a7a] mt-1">BANK SELECT</div>
      </div>
    </div>

    <!-- BOTTOM: Favorite buttons -->
    <div class="bg-[#8aa8bc] px-4 py-2 flex items-center gap-2 border-t border-[#7a98ac]">
      <div class="text-[8px] text-[#4a6a7a]">🎧 PHONES</div>
      <div class="flex-grow"></div>
      <div class="text-[9px] text-[#4a6a7a] italic mr-2">FAVORITE</div>
      <button class="w-10 h-6 bg-[#d8d8d8] hover:bg-[#e8e8e8] text-[#333] text-sm font-bold rounded shadow">1</button>
      <button class="w-10 h-6 bg-[#d8d8d8] hover:bg-[#e8e8e8] text-[#333] text-sm font-bold rounded shadow">2</button>
      <button class="w-10 h-6 bg-[#d8d8d8] hover:bg-[#e8e8e8] text-[#333] text-sm font-bold rounded shadow">3</button>
      <button class="w-10 h-6 bg-[#d8d8d8] hover:bg-[#e8e8e8] text-[#333] text-sm font-bold rounded shadow">4</button>
      <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[8px] rounded ml-2">BANK</button>
      <div class="flex-grow"></div>
      <div class="text-[8px] text-[#4a6a7a]">🎸 GUITAR/BASS INPUT</div>
    </div>
  </div>
</div>

<style>
  button {
    -webkit-tap-highlight-color: transparent;
  }
</style>
