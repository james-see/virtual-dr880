<script lang="ts">
  import { 
    currentPattern, 
    currentKit, 
    tempo, 
    isPlaying,
    currentTick
  } from '../../lib/stores';
  import { getDefaultPattern, DRUM1_INSTRUMENTS } from '../../lib/data/presets';
  import type { Pattern, NoteEvent } from '../../lib/data/types';

  // Quantization options
  const QUANTIZE_OPTIONS = [
    { value: 24, label: '1/16' },
    { value: 48, label: '1/8' },
    { value: 96, label: '1/4' },
  ];

  let quantize = 24; // 16th notes by default
  let selectedTrack: 'drums' | 'bass' = 'drums';

  // Calculate grid based on pattern
  $: pattern = $currentPattern || getDefaultPattern();
  $: stepsPerMeasure = (96 * pattern.timeSignature[0]) / quantize;
  $: totalSteps = pattern.measures * stepsPerMeasure;

  // Get visible instruments (first 8 for drums grid)
  $: visibleInstruments = DRUM1_INSTRUMENTS.slice(0, 8);

  // Check if a step has a note
  function hasNote(instrumentIndex: number, step: number): boolean {
    const tickPosition = step * quantize;
    const track = pattern.drumTrack;
    return track.some(event => 
      event.padIndex === instrumentIndex && 
      event.tick >= tickPosition && 
      event.tick < tickPosition + quantize
    );
  }

  // Get note velocity at step (for display intensity)
  function getNoteVelocity(instrumentIndex: number, step: number): number {
    const tickPosition = step * quantize;
    const track = pattern.drumTrack;
    const event = track.find(e => 
      e.padIndex === instrumentIndex && 
      e.tick >= tickPosition && 
      e.tick < tickPosition + quantize
    );
    return event?.velocity || 0;
  }

  // Toggle note at step
  function toggleNote(instrumentIndex: number, step: number) {
    const tickPosition = step * quantize;
    
    currentPattern.update(p => {
      if (!p) return p;
      
      const existingIndex = p.drumTrack.findIndex(e => 
        e.padIndex === instrumentIndex && 
        e.tick >= tickPosition && 
        e.tick < tickPosition + quantize
      );

      if (existingIndex >= 0) {
        // Remove note
        p.drumTrack.splice(existingIndex, 1);
      } else {
        // Add note
        p.drumTrack.push({
          tick: tickPosition,
          padIndex: instrumentIndex,
          velocity: 100
        });
        // Sort by tick
        p.drumTrack.sort((a, b) => a.tick - b.tick);
      }

      return { ...p };
    });
  }

  // Check if step is current playback position
  function isCurrentStep(step: number): boolean {
    const tickPosition = step * quantize;
    return $currentTick >= tickPosition && $currentTick < tickPosition + quantize;
  }

  // Handle pattern length change
  function setMeasures(measures: number) {
    currentPattern.update(p => {
      if (!p) return p;
      return { ...p, measures: Math.max(1, Math.min(16, measures)) };
    });
  }

  // Clear all notes
  function clearPattern() {
    currentPattern.update(p => {
      if (!p) return p;
      return { ...p, drumTrack: [], bassTrack: [] };
    });
  }
</script>

<div class="bg-dr880-panel rounded-lg p-4">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-sm font-medium text-gray-400">Pattern Editor</h3>
    
    <div class="flex items-center gap-4">
      <!-- Quantize selector -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Grid:</span>
        <select 
          bind:value={quantize}
          class="bg-dr880-dark text-white text-sm rounded px-2 py-1 border border-gray-600"
        >
          {#each QUANTIZE_OPTIONS as opt}
            <option value={opt.value}>{opt.label}</option>
          {/each}
        </select>
      </div>

      <!-- Measures selector -->
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500">Measures:</span>
        <button
          onclick={() => setMeasures(pattern.measures - 1)}
          class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >-</button>
        <span class="text-white font-mono w-6 text-center">{pattern.measures}</span>
        <button
          onclick={() => setMeasures(pattern.measures + 1)}
          class="w-6 h-6 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >+</button>
      </div>

      <!-- Clear button -->
      <button
        onclick={clearPattern}
        class="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
      >
        Clear
      </button>
    </div>
  </div>

  <!-- Step Grid -->
  <div class="overflow-x-auto">
    <div class="min-w-max">
      <!-- Header: Step numbers -->
      <div class="flex mb-1">
        <div class="w-24 shrink-0"></div>
        {#each Array(Math.min(totalSteps, 64)) as _, step}
          <div 
            class="w-6 h-4 flex items-center justify-center text-[8px]
                   {step % stepsPerMeasure === 0 ? 'text-dr880-accent' : 'text-gray-600'}
                   {isCurrentStep(step) ? 'bg-dr880-accent/30' : ''}"
          >
            {step % stepsPerMeasure === 0 ? Math.floor(step / stepsPerMeasure) + 1 : ''}
          </div>
        {/each}
      </div>

      <!-- Instrument rows -->
      {#each visibleInstruments as instrument, instIdx}
        <div class="flex items-center mb-0.5">
          <!-- Instrument label -->
          <div class="w-24 shrink-0 text-xs text-gray-400 truncate pr-2">
            {instrument.name}
          </div>

          <!-- Steps -->
          {#each Array(Math.min(totalSteps, 64)) as _, step}
            {@const hasNoteHere = hasNote(instIdx, step)}
            {@const velocity = getNoteVelocity(instIdx, step)}
            {@const isCurrent = isCurrentStep(step)}
            {@const isDownbeat = step % stepsPerMeasure === 0}
            <button
              onclick={() => toggleNote(instIdx, step)}
              class="w-6 h-6 border transition-all
                     {hasNoteHere 
                       ? 'bg-dr880-accent border-dr880-accent' 
                       : isDownbeat 
                         ? 'bg-gray-700 border-gray-600' 
                         : 'bg-gray-800 border-gray-700'}
                     {isCurrent ? 'ring-1 ring-white' : ''}
                     hover:border-dr880-accent"
              style={hasNoteHere ? `opacity: ${0.5 + (velocity / 127) * 0.5}` : ''}
            >
            </button>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  <!-- Pattern info footer -->
  <div class="mt-4 pt-3 border-t border-gray-700 flex justify-between text-xs text-gray-500">
    <span>
      Time: {pattern.timeSignature[0]}/{pattern.timeSignature[1]} | 
      Steps: {totalSteps}
    </span>
    <span>
      Notes: {pattern.drumTrack.length} drum, {pattern.bassTrack.length} bass
    </span>
  </div>
</div>
