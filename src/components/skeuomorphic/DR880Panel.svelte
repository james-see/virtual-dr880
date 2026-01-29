<script lang="ts">
  import KeyPadGrid from '../ui/KeyPadGrid.svelte';
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
  import { getDefaultKit, getDefaultPattern } from '../../lib/data/presets';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!$currentKit) {
      currentKit.set(getDefaultKit());
    }
    if (!$currentPattern) {
      currentPattern.set(getDefaultPattern());
    }
  });

  function handlePlay() {
    if ($isPlaying) {
      stopSequencer();
    } else {
      startSequencer();
    }
  }

  function handleStop() {
    stopSequencer();
    resetSequencer();
  }

  function adjustTempo(delta: number) {
    tempo.update(t => Math.max(20, Math.min(260, t + delta)));
  }

  // Knob rotation based on value (0-100 maps to -135deg to 135deg)
  function getKnobRotation(value: number): string {
    const rotation = (value / 100) * 270 - 135;
    return `rotate(${rotation}deg)`;
  }
</script>

<div class="max-w-4xl mx-auto select-none">
  <!-- Main Panel - Blue/Gray metallic finish -->
  <div class="relative bg-gradient-to-b from-[#8ba4b8] via-[#7a96ab] to-[#6a889d] rounded-lg shadow-2xl overflow-hidden">
    
    <!-- Top connector labels -->
    <div class="bg-[#5a7a8d] px-4 py-1 flex justify-between text-[8px] text-[#3a5a6d] font-medium tracking-wide">
      <span>L(MONO)</span>
      <span>R</span>
      <span>A-INDIVIDUAL-B</span>
      <span>CH 1,2</span>
      <span>CH 3,4 DIGITAL OUT</span>
      <span>IN—MIDI—OUT</span>
      <span>USB</span>
      <span>POWER</span>
      <span>AC IN</span>
    </div>

    <!-- Main content area -->
    <div class="p-4">
      
      <!-- Top Section: Logo, Display, Value Dial -->
      <div class="flex items-start gap-4 mb-4">
        
        <!-- Left: Logo and Knobs -->
        <div class="flex-shrink-0 w-48">
          <!-- BOSS Logo -->
          <div class="mb-2">
            <div class="text-white font-black text-2xl tracking-tight" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
              <span class="inline-block bg-white text-[#1a1a1a] px-1 rounded-sm text-lg mr-1">▪</span>BOSS
            </div>
            <div class="text-white text-sm font-medium italic">Dr.Rhythm</div>
            <div class="text-[#1a3a4a] text-2xl font-bold" style="text-shadow: 1px 1px 0 rgba(255,255,255,0.3);">DR-880</div>
          </div>
          
          <!-- Knobs Row -->
          <div class="flex gap-3 mt-4">
            <!-- Guitar/Bass Input -->
            <div class="text-center">
              <div 
                class="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#444] shadow-lg mx-auto relative"
                style="box-shadow: inset 0 -2px 4px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.5);"
              >
                <div class="absolute inset-1 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a]">
                  <div class="absolute top-1 left-1/2 w-0.5 h-2 bg-white rounded-full transform -translate-x-1/2" style={getKnobRotation(50)}></div>
                </div>
              </div>
              <div class="text-[7px] text-[#2a4a5a] mt-1 leading-tight">GUITAR/BASS<br/>INPUT</div>
            </div>
            <!-- Drum Part Level -->
            <div class="text-center">
              <div 
                class="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#444] shadow-lg mx-auto relative"
              >
                <div class="absolute inset-1 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a]">
                  <div class="absolute top-1 left-1/2 w-0.5 h-2 bg-white rounded-full transform -translate-x-1/2" style={getKnobRotation($drumVolume)}></div>
                </div>
              </div>
              <div class="text-[7px] text-[#2a4a5a] mt-1 leading-tight">DRUM<br/>PART LEVEL</div>
            </div>
            <!-- Bass Part Level -->
            <div class="text-center">
              <div 
                class="w-8 h-8 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#444] shadow-lg mx-auto relative"
              >
                <div class="absolute inset-1 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a]">
                  <div class="absolute top-1 left-1/2 w-0.5 h-2 bg-white rounded-full transform -translate-x-1/2" style={getKnobRotation($bassVolume)}></div>
                </div>
              </div>
              <div class="text-[7px] text-[#2a4a5a] mt-1 leading-tight">BASS<br/>PART LEVEL</div>
            </div>
            <!-- Master Volume -->
            <div class="text-center">
              <div 
                class="w-10 h-10 rounded-full bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] border border-[#444] shadow-lg mx-auto relative"
              >
                <div class="absolute inset-1 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#2a2a2a]">
                  <div class="absolute top-1 left-1/2 w-0.5 h-3 bg-white rounded-full transform -translate-x-1/2" style={getKnobRotation($masterVolume)}></div>
                </div>
              </div>
              <div class="text-[7px] text-[#2a4a5a] mt-1">MASTER<br/>VOLUME</div>
            </div>
          </div>
        </div>

        <!-- Center: LCD Display -->
        <div class="flex-grow">
          <div class="bg-[#4a6a3a] rounded border-4 border-[#3a3a3a] p-3 shadow-inner" style="box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);">
            <!-- Display content -->
            <div class="flex gap-4">
              <!-- Left side: Pattern number and tempo -->
              <div class="flex-shrink-0">
                <div class="text-[#1a3a1a] text-[8px] mb-1">PATTERN PRESET</div>
                <div class="text-[#0a2a0a] text-4xl font-mono font-bold leading-none" style="font-family: 'LCD', monospace;">
                  {String($currentPattern?.id || '001').padStart(3, '0').slice(-3)}
                </div>
                <div class="flex gap-4 mt-2">
                  <div>
                    <div class="text-[#1a3a1a] text-[8px]">TEMPO</div>
                    <div class="text-[#0a2a0a] text-lg font-mono font-bold">{$tempo}</div>
                  </div>
                  <div>
                    <div class="text-[#1a3a1a] text-[8px]">KEY</div>
                    <div class="text-[#0a2a0a] text-lg font-mono font-bold">Am</div>
                  </div>
                </div>
              </div>
              <!-- Right side: Logo and info -->
              <div class="flex-grow text-right">
                <div class="text-[#1a3a1a] text-xs font-bold">▪BOSS</div>
                <div class="text-[#1a3a1a] text-sm italic">Dr.Rhythm</div>
                <div class="text-[#0a2a0a] text-2xl font-bold mt-2">DR-880</div>
                <div class="text-[#1a3a1a] text-xs mt-2">
                  {$currentMeasure}:{$currentBeat} | {$isPlaying ? '▶ PLAY' : '■ STOP'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Value Dial -->
        <div class="flex-shrink-0 text-center">
          <div 
            class="w-20 h-20 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] border-2 border-[#555] shadow-xl relative mx-auto"
            style="box-shadow: 0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1);"
          >
            <div class="absolute inset-2 rounded-full bg-gradient-to-br from-[#4a4a4a] to-[#2a2a2a]">
              <div class="absolute inset-2 rounded-full bg-gradient-to-b from-[#3a3a3a] to-[#252525]">
                <div class="absolute top-2 left-1/2 w-1 h-4 bg-white rounded-full transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <div class="text-[#2a4a5a] text-xs mt-2 font-medium">VALUE</div>
        </div>
      </div>

      <!-- Middle Section: Function Buttons -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <!-- Guitar/Bass Input Section -->
        <div class="bg-[#5a7a8a] rounded p-2">
          <div class="text-[8px] text-[#2a4a5a] mb-1">GUITAR/BASS INPUT</div>
          <div class="flex gap-1">
            <button class="px-2 py-1 bg-[#cc3333] hover:bg-[#dd4444] text-white text-[10px] font-bold rounded shadow">EFFECT</button>
            <button class="px-2 py-1 bg-[#cc3333] hover:bg-[#dd4444] text-white text-[10px] font-bold rounded shadow">TUNER</button>
          </div>
        </div>

        <!-- COSM Section -->
        <div class="bg-[#5a7a8a] rounded p-2">
          <div class="text-[8px] text-[#2a4a5a] mb-1">COSM</div>
          <button class="px-2 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-[10px] rounded shadow">OUTPUT SETTING</button>
        </div>

        <!-- Cursor buttons -->
        <div class="flex items-center gap-1">
          <div class="text-[8px] text-[#2a4a5a]">CURSOR</div>
          <div class="grid grid-cols-3 gap-0.5">
            <div></div>
            <button class="w-6 h-5 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded-t text-white text-[10px]">▲</button>
            <div></div>
            <button class="w-6 h-5 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded-l text-white text-[10px]">◀</button>
            <div class="w-6 h-5"></div>
            <button class="w-6 h-5 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded-r text-white text-[10px]">▶</button>
            <div></div>
            <button class="w-6 h-5 bg-[#4a4a4a] hover:bg-[#5a5a5a] rounded-b text-white text-[10px]">▼</button>
            <div></div>
          </div>
        </div>

        <!-- EZ Compose Section -->
        <div class="bg-[#5a7a8a] rounded p-2">
          <div class="text-[8px] text-[#2a4a5a] mb-1">EZ COMPOSE</div>
          <div class="flex gap-1">
            <button class="px-2 py-1 bg-[#336633] hover:bg-[#447744] text-white text-[10px] rounded shadow">PATTERN</button>
            <button class="px-2 py-1 bg-[#336633] hover:bg-[#447744] text-white text-[10px] rounded shadow">CHORD</button>
            <button class="px-2 py-1 bg-[#336633] hover:bg-[#447744] text-white text-[10px] rounded shadow">FILL IN</button>
          </div>
        </div>

        <!-- Groove/TSC -->
        <div class="flex gap-1">
          <button class="px-2 py-1 bg-[#336633] hover:bg-[#447744] text-white text-[10px] rounded shadow">GROOVE</button>
          <button class="px-3 py-1 bg-[#cc3333] hover:bg-[#dd4444] text-white text-[10px] font-bold rounded shadow">TSC</button>
        </div>
      </div>

      <!-- Mode and Edit Buttons Row -->
      <div class="flex gap-2 mb-4 items-center">
        <div class="text-[8px] text-[#2a4a5a]">PATTERN</div>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">SONG</button>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">KIT</button>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">PAD</button>
        
        <div class="ml-4 flex gap-1">
          <button class="px-2 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">SHIFT</button>
          <button class="px-2 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">DISPLAY</button>
          <button class="px-2 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">EDIT</button>
          <button class="px-2 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">EXIT</button>
          <button class="px-2 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">ENTER</button>
        </div>
      </div>

      <!-- Transport Row -->
      <div class="flex gap-2 mb-4 items-center">
        <button class="w-8 h-8 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white rounded shadow flex items-center justify-center">⏮</button>
        <button class="w-8 h-8 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white rounded shadow flex items-center justify-center">⏪</button>
        <button class="w-8 h-8 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white rounded shadow flex items-center justify-center">⏩</button>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">LOOP</button>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">KEY</button>
        <button 
          onclick={() => adjustTempo(-1)}
          class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow"
        >
          TEMPO-
        </button>
        <button 
          onclick={() => adjustTempo(1)}
          class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow"
        >
          TEMPO+
        </button>
        
        <div class="ml-auto flex gap-2">
          <!-- Stop -->
          <button
            onclick={handleStop}
            class="w-12 h-10 bg-[#3a3a3a] hover:bg-[#4a4a4a] rounded shadow-lg flex items-center justify-center"
          >
            <div class="w-4 h-4 bg-[#666] rounded-sm"></div>
          </button>
          <!-- Play -->
          <button
            onclick={handlePlay}
            class="w-16 h-10 rounded shadow-lg flex items-center justify-center transition-colors
                   {$isPlaying ? 'bg-[#44aa44]' : 'bg-[#338833] hover:bg-[#44aa44]'}"
          >
            <div class="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
          </button>
          <!-- Record -->
          <button
            class="w-12 h-10 bg-[#3a3a3a] hover:bg-[#aa3333] rounded shadow-lg flex items-center justify-center"
          >
            <div class="w-5 h-5 bg-[#cc3333] rounded-full"></div>
          </button>
        </div>
      </div>

      <!-- Pad Grid Section -->
      <div class="bg-[#5a7a8a] rounded-lg p-3">
        <KeyPadGrid />
      </div>

      <!-- Bottom: Favorite Buttons -->
      <div class="flex items-center gap-2 mt-4">
        <div class="text-[10px] text-[#2a4a5a]">🎧 PHONES</div>
        <div class="flex-grow"></div>
        <div class="text-[10px] text-[#2a4a5a] italic">FAVORITE</div>
        <button class="w-12 h-8 bg-[#d4d4d4] hover:bg-[#e4e4e4] text-[#333] text-sm font-bold rounded shadow">1</button>
        <button class="w-12 h-8 bg-[#d4d4d4] hover:bg-[#e4e4e4] text-[#333] text-sm font-bold rounded shadow">2</button>
        <button class="w-12 h-8 bg-[#d4d4d4] hover:bg-[#e4e4e4] text-[#333] text-sm font-bold rounded shadow">3</button>
        <button class="w-12 h-8 bg-[#d4d4d4] hover:bg-[#e4e4e4] text-[#333] text-sm font-bold rounded shadow">4</button>
        <button class="px-3 py-1.5 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white text-xs rounded shadow">BANK</button>
        <div class="flex-grow"></div>
        <div class="text-[10px] text-[#2a4a5a]">🎸 GUITAR/BASS INPUT</div>
      </div>
    </div>
  </div>
</div>

<style>
  /* LCD-style font simulation */
  @font-face {
    font-family: 'LCD';
    src: local('Courier New');
  }
</style>
