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
    bassVolume
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
</script>

<div class="max-w-5xl mx-auto">
  <!-- Main Panel -->
  <div class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
    
    <!-- Top Section: Brand and Display -->
    <div class="flex items-start justify-between mb-6">
      <!-- BOSS Logo Area -->
      <div class="text-left">
        <div class="text-red-500 font-bold text-2xl tracking-wider">BOSS</div>
        <div class="text-gray-400 text-xs mt-1">DR-880</div>
        <div class="text-dr880-accent text-sm font-medium">Dr. Rhythm</div>
      </div>

      <!-- LCD Display -->
      <div class="bg-dr880-lcd-bg rounded border-4 border-gray-600 p-4 w-80 font-lcd shadow-inner">
        <div class="flex justify-between text-dr880-lcd-text text-xs mb-1">
          <span>PATTERN</span>
          <span>{$isPlaying ? '▶' : '■'}</span>
        </div>
        <div class="text-dr880-lcd-text text-lg font-bold truncate mb-2">
          {$currentPattern?.name || 'NO PATTERN'}
        </div>
        <div class="flex justify-between text-dr880-lcd-text">
          <span class="text-xl font-bold">{$currentMeasure}:{$currentBeat}</span>
          <span class="text-xl font-bold">♩={$tempo}</span>
        </div>
        <div class="flex justify-between text-dr880-lcd-text text-xs mt-2 pt-2 border-t border-dr880-lcd-text/30">
          <span>{$currentKit?.name || '--'}</span>
          <span>KEY: C</span>
        </div>
      </div>

      <!-- Volume Knobs Section -->
      <div class="flex gap-6">
        <!-- Master Volume Knob -->
        <div class="text-center">
          <div class="w-12 h-12 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                      border-2 border-gray-500 shadow-knob mx-auto mb-1
                      flex items-center justify-center">
            <div class="w-1 h-4 bg-white rounded-full transform -rotate-45"></div>
          </div>
          <span class="text-gray-400 text-xs">MASTER</span>
        </div>

        <!-- Drum Volume Knob -->
        <div class="text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                      border-2 border-gray-500 shadow-knob mx-auto mb-1
                      flex items-center justify-center">
            <div class="w-1 h-3 bg-white rounded-full"></div>
          </div>
          <span class="text-gray-400 text-xs">DRUM</span>
        </div>

        <!-- Bass Volume Knob -->
        <div class="text-center">
          <div class="w-10 h-10 rounded-full bg-gradient-to-b from-gray-600 to-gray-800 
                      border-2 border-gray-500 shadow-knob mx-auto mb-1
                      flex items-center justify-center">
            <div class="w-1 h-3 bg-white rounded-full"></div>
          </div>
          <span class="text-gray-400 text-xs">BASS</span>
        </div>
      </div>
    </div>

    <!-- Middle Section: Controls -->
    <div class="flex gap-4 mb-6 justify-center">
      <!-- Transport Controls -->
      <div class="flex gap-2">
        <button
          onclick={handleStop}
          class="w-12 h-10 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 
                 flex items-center justify-center transition-colors"
        >
          <div class="w-4 h-4 bg-white rounded-sm"></div>
        </button>
        <button
          onclick={handlePlay}
          class="w-12 h-10 rounded border border-gray-600 flex items-center justify-center transition-colors
                 {$isPlaying ? 'bg-dr880-accent' : 'bg-gray-700 hover:bg-gray-600'}"
        >
          {#if $isPlaying}
            <div class="flex gap-1">
              <div class="w-1.5 h-4 bg-white rounded-sm"></div>
              <div class="w-1.5 h-4 bg-white rounded-sm"></div>
            </div>
          {:else}
            <div class="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1"></div>
          {/if}
        </button>
        <button
          class="w-12 h-10 bg-gray-700 hover:bg-red-700 rounded border border-gray-600 
                 flex items-center justify-center transition-colors"
        >
          <div class="w-4 h-4 bg-red-500 rounded-full"></div>
        </button>
      </div>

      <!-- Tempo Display -->
      <div class="bg-dr880-dark rounded px-4 py-2 border border-gray-600">
        <span class="text-dr880-accent font-mono text-xl">{$tempo}</span>
        <span class="text-gray-500 text-sm ml-1">BPM</span>
      </div>

      <!-- Mode Buttons -->
      <div class="flex gap-2">
        <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">
          PATTERN
        </button>
        <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">
          SONG
        </button>
        <button class="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">
          KIT
        </button>
      </div>
    </div>

    <!-- Bottom Section: Pad Grid -->
    <div class="bg-dr880-dark rounded-xl p-4 border border-gray-700">
      <KeyPadGrid />
    </div>

    <!-- Footer: Additional Controls Placeholder -->
    <div class="flex justify-between mt-4 text-xs text-gray-500">
      <span>GUITAR/BASS INPUT</span>
      <span>EFFECT</span>
      <span>TSC</span>
      <span>EZ COMPOSE</span>
    </div>
  </div>
</div>
