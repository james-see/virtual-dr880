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
  import { getDefaultKit, getDefaultPattern, DRUM1_INSTRUMENTS, DRUM2_INSTRUMENTS, DRUM3_INSTRUMENTS, BASS_NOTES } from '../../lib/data/presets';
  import { playSample } from '../../lib/audio/SamplePlayer';
  import { getSampleUrl } from '../../lib/data/presets';
  import { onMount } from 'svelte';
  import type { PadBank } from '../../lib/data/types';

  onMount(() => {
    if (!$currentKit) currentKit.set(getDefaultKit());
    if (!$currentPattern) currentPattern.set(getDefaultPattern());
  });

  // Menu state
  type MenuMode = 'default' | 'pad_select';
  let menuMode: MenuMode = 'default';
  let menuSelection = 0;

  const PAD_MENU_OPTIONS: { label: string; value: PadBank }[] = [
    { label: 'DRUM 1', value: 'DRUM1' },
    { label: 'DRUM 2', value: 'DRUM2' },
    { label: 'DRUM 3', value: 'DRUM3' },
    { label: 'BASS', value: 'BASS' },
  ];

  // Get current bank label
  function getBankLabel(bank: PadBank): string {
    const opt = PAD_MENU_OPTIONS.find(o => o.value === bank);
    return opt?.label || 'DRUM 1';
  }

  // Button handlers
  function handlePadButton() {
    menuMode = 'pad_select';
    // Set selection to current bank
    const idx = PAD_MENU_OPTIONS.findIndex(o => o.value === $currentPadBank);
    menuSelection = idx >= 0 ? idx : 0;
  }

  function handleCursorUp() {
    if (menuMode === 'pad_select') {
      menuSelection = Math.max(0, menuSelection - 1);
    }
  }

  function handleCursorDown() {
    if (menuMode === 'pad_select') {
      menuSelection = Math.min(PAD_MENU_OPTIONS.length - 1, menuSelection + 1);
    }
  }

  function handleEnter() {
    if (menuMode === 'pad_select') {
      currentPadBank.set(PAD_MENU_OPTIONS[menuSelection].value);
      menuMode = 'default';
    }
  }

  function handleExit() {
    menuMode = 'default';
  }

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

  // Get instruments for current bank
  function getCurrentInstruments() {
    switch ($currentPadBank) {
      case 'DRUM1': return DRUM1_INSTRUMENTS;
      case 'DRUM2': return DRUM2_INSTRUMENTS.map((inst, i) => ({ ...inst, padNum: i + 1, note: '' }));
      case 'DRUM3': return DRUM3_INSTRUMENTS.map((inst, i) => ({ ...inst, padNum: i + 1, note: '' }));
      case 'BASS':
      case 'BASS_LOW':
      case 'BASS_HIGH':
        return BASS_NOTES.map((note, i) => ({ 
          id: 'finger_bass', 
          name: note.name, 
          category: 'bass', 
          padNum: i + 1, 
          note: note.note,
          semitones: note.semitones 
        }));
      default: return DRUM1_INSTRUMENTS;
    }
  }

  // Play pad sound
  async function playPad(index: number) {
    const kit = $currentKit || getDefaultKit();
    const instruments = getCurrentInstruments();
    const inst = instruments[index];
    
    if (!inst) return;

    // For bass, use pitch shifting
    if ($currentPadBank === 'BASS' || $currentPadBank === 'BASS_LOW' || $currentPadBank === 'BASS_HIGH') {
      const bassUrl = getSampleUrl('finger_bass');
      const semitones = (inst as any).semitones || 0;
      await playSample(bassUrl, { velocity: 100, level: 100, pan: 0, pitch: semitones });
    } else {
      // Get pad assignment from kit based on bank offset
      let padIndex = index;
      if ($currentPadBank === 'DRUM2') padIndex = index + 20;
      if ($currentPadBank === 'DRUM3') padIndex = index + 40;
      
      const pad = kit.pads[padIndex];
      if (pad) {
        const url = getSampleUrl(pad.instrumentId);
        await playSample(url, { velocity: 100, level: pad.level, pan: pad.pan, pitch: pad.pitch });
      }
    }
  }

  $: currentInstruments = getCurrentInstruments();
</script>

<!-- Wide landscape layout matching DR-880 -->
<div class="w-full max-w-4xl mx-auto select-none" style="font-family: Arial, Helvetica, sans-serif;">
  
  <!-- Main Panel - Light blue/gray metallic with bevel -->
  <div class="rounded-lg overflow-hidden" style="background: linear-gradient(180deg, #b8c8d4 0%, #a8b8c8 50%, #98a8b8 100%); box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3);">
    
    <!-- Top connector strip -->
    <div class="px-4 py-1 flex justify-between text-[7px] tracking-wide border-b" style="background: #8898a8; color: #5a6a7a; border-color: #7888a0;">
      <span>L(MONO)</span><span>R</span><span>A-INDIVIDUAL-B</span><span>CH 1,2</span>
      <span>CH 3,4</span><span>DIGITAL OUT</span><span>IN—MIDI—OUT</span><span>USB</span><span>POWER</span><span>AC IN</span>
    </div>

    <!-- TOP DARK SECTION: Logo, Knobs, Display, Value Dial -->
    <div class="p-4 flex items-start gap-4" style="background: linear-gradient(180deg, #3a4a5a 0%, #2a3a4a 100%); box-shadow: inset 0 -4px 8px rgba(0,0,0,0.3);">
      
      <!-- Left: BOSS Logo, Model, and Knobs -->
      <div class="flex-shrink-0" style="width: 180px;">
        <!-- Logo -->
        <div class="flex items-center gap-1 mb-0.5">
          <span class="text-white text-[10px] font-black" style="background: white; color: #1a1a1a; padding: 1px 3px;">▌</span>
          <span class="text-white text-xl font-black tracking-tight" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">BOSS</span>
        </div>
        <div class="text-sm italic mb-0.5" style="color: #7ac; font-style: italic;">Dr.Rhythm</div>
        <div class="text-3xl font-bold tracking-tight mb-3" style="color: #6ab;">DR-880</div>
        
        <!-- 4 Knobs in a row -->
        <div class="flex gap-3">
          {#each [
            { label: 'GUITAR/BASS\nINPUT', value: 50, store: null },
            { label: 'DRUM\nPART LEVEL', value: $drumVolume, store: drumVolume },
            { label: 'BASS\nPART LEVEL', value: $bassVolume, store: bassVolume },
            { label: 'MASTER\nVOLUME', value: $masterVolume, store: masterVolume }
          ] as knob}
            <div class="text-center">
              <div 
                class="w-9 h-9 rounded-full cursor-pointer relative"
                style="background: linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%); box-shadow: 0 3px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);"
                onwheel={(e) => knob.store && handleKnobWheel(e, knob.store)}
                title="Scroll to adjust"
              >
                <div class="absolute inset-1 rounded-full" style="background: linear-gradient(180deg, #3a3a3a 0%, #252525 100%);">
                  <div class="w-0.5 h-3 bg-white rounded-full absolute left-1/2 top-1" style="transform: translateX(-50%) {getKnobRotation(knob.value)}; transform-origin: center 10px;"></div>
                </div>
              </div>
              <div class="text-[6px] mt-1 whitespace-pre-line leading-tight text-center" style="color: #9ab;">{knob.label}</div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Center: LCD Display -->
      <div class="flex-grow">
        <div class="rounded" style="background: linear-gradient(180deg, #4a8a3a 0%, #3a7a2a 100%); border: 4px solid #252525; padding: 12px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.5); min-height: 140px;">
          
          {#if menuMode === 'default'}
            <!-- Default display -->
            <div class="flex justify-between items-start">
              <!-- Left: Pattern info -->
              <div>
                <div class="text-[8px] font-medium" style="color: #2a5a2a;">PATTERN PRESET</div>
                <div class="text-5xl font-mono font-black leading-none tracking-tighter" style="color: #1a3a1a; font-family: 'Courier New', monospace; text-shadow: 1px 1px 0 rgba(0,0,0,0.2);">
                  {String($currentPattern?.id || '500').padStart(3, '0').slice(-3)}
                </div>
                <div class="flex gap-4 mt-2">
                  <div class="px-2 py-1 rounded" style="background: rgba(0,0,0,0.15);">
                    <div class="text-[7px]" style="color: #2a5a2a;">TEMPO</div>
                    <div class="text-2xl font-mono font-bold" style="color: #1a3a1a;">{$tempo}</div>
                  </div>
                  <div class="px-2 py-1 rounded" style="background: rgba(0,0,0,0.15);">
                    <div class="text-[7px]" style="color: #2a5a2a;">KEY</div>
                    <div class="text-2xl font-mono font-bold" style="color: #1a3a1a;">Am</div>
                  </div>
                  <div class="px-2 py-1 rounded" style="background: rgba(0,0,0,0.15);">
                    <div class="text-[7px]" style="color: #2a5a2a;">PAD</div>
                    <div class="text-lg font-mono font-bold" style="color: #1a3a1a;">{getBankLabel($currentPadBank)}</div>
                  </div>
                </div>
              </div>
              <!-- Right: Branding + Drummer -->
              <div class="text-right">
                <div class="flex items-center justify-end gap-1 mb-0.5">
                  <span class="text-[8px] font-black" style="background: #1a3a1a; color: #4a8a3a; padding: 1px 2px;">▌</span>
                  <span class="text-[10px] font-black" style="color: #1a3a1a;">BOSS</span>
                </div>
                <div class="text-[10px] italic" style="color: #2a5a2a;">Dr.Rhythm</div>
                <!-- Drummer icon -->
                <div class="my-2 flex justify-end">
                  <svg width="50" height="40" viewBox="0 0 50 40" style="fill: #1a3a1a;">
                    <circle cx="25" cy="8" r="5"/>
                    <rect x="20" y="14" width="10" height="12" rx="2"/>
                    <line x1="18" y1="18" x2="10" y2="28" stroke="#1a3a1a" stroke-width="2"/>
                    <line x1="32" y1="18" x2="40" y2="28" stroke="#1a3a1a" stroke-width="2"/>
                    <ellipse cx="12" cy="32" rx="8" ry="4"/>
                    <ellipse cx="38" cy="32" rx="8" ry="4"/>
                  </svg>
                </div>
                <div class="text-2xl font-bold" style="color: #1a3a1a;">DR-880</div>
              </div>
            </div>

          {:else if menuMode === 'pad_select'}
            <!-- PAD Select Menu -->
            <div>
              <div class="text-sm font-bold mb-3" style="color: #1a3a1a;">PAD SELECT</div>
              <div class="space-y-1">
                {#each PAD_MENU_OPTIONS as option, i}
                  <div 
                    class="px-3 py-1.5 rounded flex items-center gap-2"
                    style="background: {menuSelection === i ? '#1a3a1a' : 'transparent'}; color: {menuSelection === i ? '#4a8a3a' : '#1a3a1a'};"
                  >
                    <span class="w-4">{menuSelection === i ? '▶' : ''}</span>
                    <span class="font-mono font-bold">{option.label}</span>
                    {#if option.value === $currentPadBank}
                      <span class="text-xs ml-2">●</span>
                    {/if}
                  </div>
                {/each}
              </div>
              <div class="mt-3 text-[10px]" style="color: #2a5a2a;">
                ▲▼ Select • ENTER Confirm • EXIT Cancel
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Right: Value Dial -->
      <div class="flex-shrink-0 text-center">
        <div 
          class="w-20 h-20 rounded-full cursor-pointer relative"
          style="background: linear-gradient(145deg, #3a3a3a 0%, #1a1a1a 50%, #0a0a0a 100%); box-shadow: 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05);"
          onwheel={(e) => { e.preventDefault(); tempo.update(t => Math.max(20, Math.min(260, t + (e.deltaY > 0 ? -1 : 1)))); }}
          title="Scroll to adjust tempo"
        >
          <div class="absolute inset-2 rounded-full" style="background: linear-gradient(180deg, #2a2a2a 0%, #151515 100%);">
            <div class="absolute inset-2 rounded-full flex items-center justify-center" style="background: radial-gradient(circle, #252525 0%, #1a1a1a 100%);">
              <div class="w-1 h-8 bg-white rounded-full" style="transform: rotate(-30deg); transform-origin: center 70%;"></div>
            </div>
          </div>
        </div>
        <div class="text-sm mt-2 font-medium" style="color: #cda;">VALUE</div>
      </div>
    </div>

    <!-- MIDDLE SECTION: Controls + Pads -->
    <div class="p-3 flex gap-3">
      
      <!-- LEFT: Control buttons (compact) -->
      <div class="flex-shrink-0 space-y-2" style="width: 240px;">
        
        <!-- Row 1: Guitar/Bass Input + COSM + EZ Compose + Groove/TSC -->
        <div class="flex gap-2 items-start">
          <!-- Guitar/Bass Input -->
          <div>
            <div class="text-[7px] mb-1" style="color: #5a6a7a;">GUITAR/BASS INPUT</div>
            <div class="flex gap-1">
              <button class="px-2 py-1.5 text-[9px] font-bold rounded shadow" style="background: linear-gradient(180deg, #e85a5a 0%, #c84040 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);">EFFECT</button>
              <button class="px-2 py-1.5 text-[9px] font-bold rounded shadow" style="background: linear-gradient(180deg, #e85a5a 0%, #c84040 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);">TUNER</button>
            </div>
          </div>
          <!-- COSM -->
          <div>
            <div class="text-[7px] mb-1" style="color: #5a6a7a;">COSM</div>
            <button class="px-1.5 py-1.5 text-[8px] rounded shadow leading-tight" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">OUTPUT<br/>SETTING</button>
          </div>
        </div>

        <!-- Row 2: EZ Compose + Groove/TSC -->
        <div class="flex gap-2 items-start">
          <div>
            <div class="text-[7px] mb-1 text-center" style="color: #5a6a7a;">EZ COMPOSE</div>
            <div class="flex gap-1">
              <button class="px-1.5 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #4a9aba 0%, #3a8aaa 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">PATTERN</button>
              <button class="px-1 py-1.5 text-[7px] rounded shadow leading-tight" style="background: linear-gradient(180deg, #4a9aba 0%, #3a8aaa 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">CHORD<br/>PROG</button>
              <button class="px-1.5 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #4a9aba 0%, #3a8aaa 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">FILL IN</button>
            </div>
          </div>
          <div class="space-y-1">
            <div class="text-[7px]" style="color: #5a6a7a;">GROOVE MODIFY</div>
            <button class="px-2 py-1 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #4a9aba 0%, #3a8aaa 100%); color: white;">GROOVE</button>
          </div>
          <div class="space-y-1">
            <div class="text-[7px]" style="color: #5a6a7a;">TOTAL SOUND</div>
            <button class="px-2 py-1.5 text-[9px] font-bold rounded shadow" style="background: linear-gradient(180deg, #e85a5a 0%, #c84040 100%); color: white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">TSC</button>
          </div>
        </div>

        <!-- Row 3: Pattern + Cursor -->
        <div class="flex gap-3 items-center">
          <div>
            <div class="text-[7px] mb-1" style="color: #5a6a7a;">PATTERN</div>
            <div class="flex gap-1">
              <button class="px-2 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">SONG</button>
              <button class="px-2 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">KIT</button>
              <button 
                onclick={handlePadButton}
                class="px-2 py-1.5 text-[8px] rounded shadow transition-all"
                style="background: {menuMode === 'pad_select' ? 'linear-gradient(180deg, #7a7a7a 0%, #5a5a5a 100%)' : 'linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%)'}; color: white;"
              >PAD</button>
            </div>
            <div class="text-[6px] mt-0.5 flex justify-between px-1" style="color: #5a6a7a;">
              <span>DEMO PLAY</span><span>BASS PAD</span>
            </div>
          </div>
          <!-- Cursor diamond -->
          <div class="text-center">
            <div class="text-[7px] mb-1" style="color: #5a6a7a;">CURSOR</div>
            <div class="grid grid-cols-3 gap-0.5 w-14">
              <div></div>
              <button 
                onclick={handleCursorUp}
                class="w-4 h-4 flex items-center justify-center text-[10px] rounded-sm shadow active:scale-95" 
                style="background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%); color: #333; box-shadow: 0 2px 3px rgba(0,0,0,0.3);"
              >▲</button>
              <div></div>
              <button class="w-4 h-4 flex items-center justify-center text-[10px] rounded-sm shadow" style="background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%); color: #333;">◀</button>
              <div class="w-4 h-4"></div>
              <button class="w-4 h-4 flex items-center justify-center text-[10px] rounded-sm shadow" style="background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%); color: #333;">▶</button>
              <div></div>
              <button 
                onclick={handleCursorDown}
                class="w-4 h-4 flex items-center justify-center text-[10px] rounded-sm shadow active:scale-95" 
                style="background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%); color: #333;"
              >▼</button>
              <div></div>
            </div>
          </div>
        </div>

        <!-- Row 4: SHIFT DISPLAY EDIT EXIT ENTER -->
        <div class="flex gap-1">
          <button class="px-2 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">SHIFT</button>
          <button class="px-1.5 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">DISPLAY</button>
          <button class="px-2 py-1.5 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">EDIT</button>
          <button 
            onclick={handleExit}
            class="px-2 py-1.5 text-[8px] rounded shadow active:scale-95" 
            style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;"
          >EXIT</button>
          <button 
            onclick={handleEnter}
            class="px-2 py-1.5 text-[8px] rounded shadow active:scale-95" 
            style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;"
          >ENTER</button>
        </div>
        <div class="text-[6px] flex justify-center gap-16" style="color: #5a6a7a;">
          <span></span><span>ERASE</span>
        </div>

        <!-- Row 5: Transport nav + Loop/Key/Tempo -->
        <div class="flex gap-1 items-center">
          <button class="w-7 h-6 rounded shadow flex items-center justify-center" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">
            <span class="text-[10px]">|◀</span>
          </button>
          <button class="w-7 h-6 rounded shadow flex items-center justify-center" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">
            <span class="text-[10px]">◀◀</span>
          </button>
          <button class="w-7 h-6 rounded shadow flex items-center justify-center" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">
            <span class="text-[10px]">▶▶</span>
          </button>
          <button class="px-2 py-1 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">LOOP</button>
          <button class="px-2 py-1 text-[8px] rounded shadow" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">KEY</button>
          <button class="px-1.5 py-1 text-[7px] rounded shadow leading-tight" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">TEMPO<br/><span class="text-[5px]">TAP</span></button>
        </div>

        <!-- Row 6: Stop Play Rec -->
        <div class="flex gap-2 items-center pt-1">
          <button onclick={handleStop} class="w-12 h-8 rounded-lg shadow flex items-center justify-center" style="background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%); box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);">
            <div class="w-4 h-4 rounded-sm" style="background: #666;"></div>
          </button>
          <button onclick={handlePlay} class="w-16 h-8 rounded-full shadow flex items-center justify-center transition-all" style="background: {$isPlaying ? 'linear-gradient(180deg, #6c6 0%, #4a4)' : 'linear-gradient(180deg, #5b5 0%, #393)'}; box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);">
            <div class="w-0 h-0 ml-1" style="border-left: 12px solid white; border-top: 7px solid transparent; border-bottom: 7px solid transparent;"></div>
          </button>
          <button class="w-12 h-8 rounded-lg shadow flex items-center justify-center" style="background: linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%); box-shadow: 0 3px 6px rgba(0,0,0,0.4);">
            <div class="w-5 h-5 rounded-full flex items-center justify-center" style="background: #c44; border: 2px solid #a33;">
              <span class="text-[5px] text-white font-bold">REC</span>
            </div>
          </button>
          <div class="text-[7px] ml-1" style="color: #5a6a7a;">WRITE</div>
        </div>
      </div>

      <!-- RIGHT: 4x5 Pad Grid (rectangular pads) -->
      <div class="flex-grow">
        <div class="grid grid-cols-5 gap-1">
          {#each currentInstruments.slice(0, 20) as inst, i}
            <button
              class="relative overflow-hidden rounded shadow-md transition-all active:scale-95"
              style="height: 56px; background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #3a3a3a 100%); box-shadow: 0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);"
              onmousedown={() => playPad(i)}
            >
              <!-- Top section with number and note -->
              <div class="absolute top-0 left-0 right-0 h-5 flex justify-between items-center px-1.5" style="background: rgba(0,0,0,0.3);">
                <span class="text-[10px] font-bold" style="color: #8a8;">{inst.padNum || i + 1}</span>
                <span class="text-[10px] font-medium" style="color: #aa8;">{inst.note || ''}</span>
              </div>
              <!-- Bottom section with name -->
              <div class="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-1 pt-5">
                <span class="text-[9px] font-medium text-center leading-tight px-0.5" style="color: #aaa;">{inst.name}</span>
              </div>
            </button>
          {/each}
        </div>
        <div class="text-right text-[8px] mt-1" style="color: #5a6a7a;">BANK SELECT: {getBankLabel($currentPadBank)}</div>
      </div>
    </div>

    <!-- BOTTOM: Favorite buttons -->
    <div class="px-4 py-2.5 flex items-center gap-3" style="background: linear-gradient(180deg, #a8b8c8 0%, #98a8b8 100%); border-top: 1px solid #8898a8;">
      <!-- Phones jack -->
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded-full" style="background: #333; box-shadow: inset 0 1px 2px rgba(0,0,0,0.5);"></div>
        <span class="text-[8px] italic" style="color: #5a6a7a;">PHONES</span>
      </div>
      
      <div class="flex-grow"></div>
      
      <span class="text-[10px] italic font-medium" style="color: #4a5a6a;">FAVORITE</span>
      
      <!-- Favorite buttons -->
      {#each [1, 2, 3, 4] as num}
        <button class="w-14 h-7 rounded shadow text-sm font-bold" style="background: linear-gradient(180deg, #e8e8e8 0%, #c8c8c8 100%); color: #333; box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5);">{num}</button>
      {/each}
      
      <button class="px-3 py-1.5 rounded shadow text-[9px] font-medium" style="background: linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 100%); color: white;">BANK</button>
      
      <div class="flex-grow"></div>
      
      <!-- Guitar input jack -->
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 rounded-full" style="background: #333; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);"></div>
        <span class="text-[7px]" style="color: #5a6a7a;">GUITAR/BASS<br/>INPUT</span>
      </div>
    </div>
  </div>
</div>

<style>
  button {
    -webkit-tap-highlight-color: transparent;
  }
  button:active {
    filter: brightness(1.1);
  }
</style>
