<script lang="ts">
  import { isPlaying, tempo, currentTick, currentMeasure, currentBeat } from '../../lib/stores';
  import { startSequencer, stopSequencer, resetSequencer } from '../../lib/sequencer/Sequencer';

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

  function handleTempoChange(delta: number) {
    tempo.update(t => Math.max(20, Math.min(260, t + delta)));
  }

  function handleTempoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value)) {
      tempo.set(Math.max(20, Math.min(260, value)));
    }
  }
</script>

<div class="bg-dr880-panel rounded-lg p-4">
  <h3 class="text-sm font-medium text-gray-400 mb-3">Transport</h3>

  <!-- Transport Buttons -->
  <div class="flex gap-2 mb-4">
    <!-- Reset -->
    <button
      onclick={handleStop}
      class="flex-1 py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
      title="Stop & Reset"
    >
      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="1" />
      </svg>
    </button>

    <!-- Play/Pause -->
    <button
      onclick={handlePlay}
      class="flex-1 py-2 px-3 rounded-lg transition-colors
             {$isPlaying ? 'bg-dr880-accent hover:bg-orange-600' : 'bg-green-600 hover:bg-green-500'}"
      title={$isPlaying ? 'Pause' : 'Play'}
    >
      {#if $isPlaying}
        <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      {:else}
        <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      {/if}
    </button>

    <!-- Record (placeholder) -->
    <button
      class="flex-1 py-2 px-3 bg-gray-700 hover:bg-red-700 rounded-lg transition-colors"
      title="Record"
    >
      <svg class="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6" />
      </svg>
    </button>
  </div>

  <!-- Tempo Control -->
  <div class="flex items-center gap-3">
    <span class="text-gray-400 text-sm">Tempo:</span>
    
    <button
      onclick={() => handleTempoChange(-1)}
      class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
    >
      -
    </button>
    
    <input
      type="number"
      value={$tempo}
      oninput={handleTempoInput}
      min="20"
      max="260"
      class="w-16 bg-dr880-dark text-center text-dr880-accent font-mono rounded px-2 py-1
             border border-gray-600 focus:border-dr880-accent focus:outline-none"
    />
    
    <button
      onclick={() => handleTempoChange(1)}
      class="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center"
    >
      +
    </button>
    
    <span class="text-gray-500 text-sm">BPM</span>
  </div>

  <!-- Position Display -->
  <div class="mt-3 text-center">
    <span class="text-gray-500 text-sm">Position: </span>
    <span class="font-mono text-dr880-accent">{$currentMeasure}:{$currentBeat}</span>
  </div>
</div>
