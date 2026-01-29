<script lang="ts">
  import { masterVolume, drumVolume, bassVolume } from '../../lib/stores';

  function handleSliderChange(store: typeof masterVolume, event: Event) {
    const input = event.target as HTMLInputElement;
    store.set(parseInt(input.value, 10));
  }
</script>

<div class="bg-dr880-panel rounded-lg p-4">
  <h3 class="text-sm font-medium text-gray-400 mb-3">Volume</h3>

  <div class="space-y-4">
    <!-- Master Volume -->
    <div class="flex items-center gap-3">
      <label class="text-sm text-gray-400 w-16">Master</label>
      <input
        type="range"
        min="0"
        max="100"
        value={$masterVolume}
        oninput={(e) => handleSliderChange(masterVolume, e)}
        class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
               accent-dr880-accent"
      />
      <span class="text-sm text-dr880-accent font-mono w-10 text-right">
        {$masterVolume}
      </span>
    </div>

    <!-- Drum Volume -->
    <div class="flex items-center gap-3">
      <label class="text-sm text-gray-400 w-16">Drums</label>
      <input
        type="range"
        min="0"
        max="100"
        value={$drumVolume}
        oninput={(e) => handleSliderChange(drumVolume, e)}
        class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
               accent-blue-500"
      />
      <span class="text-sm text-blue-400 font-mono w-10 text-right">
        {$drumVolume}
      </span>
    </div>

    <!-- Bass Volume -->
    <div class="flex items-center gap-3">
      <label class="text-sm text-gray-400 w-16">Bass</label>
      <input
        type="range"
        min="0"
        max="100"
        value={$bassVolume}
        oninput={(e) => handleSliderChange(bassVolume, e)}
        class="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
               accent-green-500"
      />
      <span class="text-sm text-green-400 font-mono w-10 text-right">
        {$bassVolume}
      </span>
    </div>
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: currentColor;
    cursor: pointer;
    margin-top: -6px;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: #374151;
  }
</style>
