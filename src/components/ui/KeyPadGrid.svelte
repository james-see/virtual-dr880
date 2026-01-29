<script lang="ts">
  import Pad from './Pad.svelte';
  import { currentPadBank, currentKit } from '../../lib/stores';
  import { playSample } from '../../lib/audio/SamplePlayer';
  import type { PadBank, PadAssignment } from '../../lib/data/types';
  import { getDefaultKit, getPadLabels, BASS_NOTES, getSampleUrl } from '../../lib/data/presets';

  // Get current pad bank index offset
  function getPadOffset(bank: PadBank): number {
    switch (bank) {
      case 'DRUM1': return 0;
      case 'DRUM2': return 20;
      case 'DRUM3': return 40;
      default: return 0;
    }
  }

  // Check if current bank is bass
  $: isBass = $currentPadBank === 'BASS' || 
              $currentPadBank === 'BASS_LOW' || 
              $currentPadBank === 'BASS_HIGH';

  // Get octave offset for bass
  function getBassOctaveOffset(bank: PadBank): number {
    switch (bank) {
      case 'BASS_LOW': return -12;
      case 'BASS_HIGH': return 12;
      default: return 0;
    }
  }

  // Handle pad trigger
  async function handlePadTrigger(padIndex: number, velocity: number) {
    const kit = $currentKit || getDefaultKit();
    
    if (isBass) {
      // Play bass note
      const bassTone = kit.bassTone;
      const octaveOffset = getBassOctaveOffset($currentPadBank);
      const noteOffset = BASS_NOTES[padIndex]?.semitones || 0;
      
      await playSample(bassTone.sampleUrl, {
        velocity,
        pitch: noteOffset + octaveOffset,
        level: kit.bassLevel,
        isBass: true
      });
    } else {
      // Play drum pad
      const offset = getPadOffset($currentPadBank);
      const pad = kit.pads[offset + padIndex];
      
      if (pad) {
        // Get sample URL from instrument ID
        const sampleUrl = getSampleUrl(pad.instrumentId);
        
        await playSample(sampleUrl, {
          velocity,
          pitch: pad.pitch,
          pitchFine: pad.pitchFine,
          pan: pad.pan,
          level: pad.level,
          muteGroup: pad.muteGroup,
          isBass: false
        });
      }
    }
  }

  // Get pad labels based on current bank
  $: padLabels = getPadLabels($currentPadBank, $currentKit || getDefaultKit());
</script>

<div class="w-full max-w-xl mx-auto">
  <!-- Pad Bank Selector -->
  <div class="flex gap-2 mb-4 justify-center flex-wrap">
    <button
      class="px-3 py-1 rounded text-sm font-medium transition-colors
             {$currentPadBank === 'DRUM1' ? 'bg-dr880-accent text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
      onclick={() => currentPadBank.set('DRUM1')}
    >
      DRUM 1
    </button>
    <button
      class="px-3 py-1 rounded text-sm font-medium transition-colors
             {$currentPadBank === 'DRUM2' ? 'bg-dr880-accent text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
      onclick={() => currentPadBank.set('DRUM2')}
    >
      DRUM 2
    </button>
    <button
      class="px-3 py-1 rounded text-sm font-medium transition-colors
             {$currentPadBank === 'DRUM3' ? 'bg-dr880-accent text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
      onclick={() => currentPadBank.set('DRUM3')}
    >
      DRUM 3
    </button>
    <button
      class="px-3 py-1 rounded text-sm font-medium transition-colors
             {$currentPadBank === 'BASS' ? 'bg-dr880-accent text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
      onclick={() => currentPadBank.set('BASS')}
    >
      BASS
    </button>
  </div>

  <!-- Bass octave selector (only shown when bass is selected) -->
  {#if isBass}
    <div class="flex gap-2 mb-4 justify-center">
      <button
        class="px-2 py-1 rounded text-xs font-medium transition-colors
               {$currentPadBank === 'BASS_LOW' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        onclick={() => currentPadBank.set('BASS_LOW')}
      >
        -1 OCT
      </button>
      <button
        class="px-2 py-1 rounded text-xs font-medium transition-colors
               {$currentPadBank === 'BASS' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        onclick={() => currentPadBank.set('BASS')}
      >
        NORMAL
      </button>
      <button
        class="px-2 py-1 rounded text-xs font-medium transition-colors
               {$currentPadBank === 'BASS_HIGH' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
        onclick={() => currentPadBank.set('BASS_HIGH')}
      >
        +1 OCT
      </button>
    </div>
  {/if}

  <!-- 4x5 Pad Grid (matching DR-880 layout) -->
  <div class="grid grid-cols-5 gap-2 sm:gap-3">
    {#each Array(20) as _, i}
      <Pad
        index={i}
        padNum={padLabels[i]?.padNum}
        label={padLabels[i]?.name || ''}
        sublabel={padLabels[i]?.note || ''}
        color={isBass ? 'blue' : 'default'}
        onTrigger={(velocity) => handlePadTrigger(i, velocity)}
      />
    {/each}
  </div>
</div>
