<script lang="ts">
  import KeyPadGrid from '../ui/KeyPadGrid.svelte';
  import TransportControls from '../ui/TransportControls.svelte';
  import VolumeControls from '../ui/VolumeControls.svelte';
  import Display from '../ui/Display.svelte';
  import PatternEditor from './PatternEditor.svelte';
  import { tempo, currentPattern, currentKit } from '../../lib/stores';
  import { getDefaultKit, getDefaultPattern } from '../../lib/data/presets';
  import { onMount } from 'svelte';

  // Initialize default kit and pattern
  onMount(() => {
    if (!$currentKit) {
      currentKit.set(getDefaultKit());
    }
    if (!$currentPattern) {
      currentPattern.set(getDefaultPattern());
    }
  });
</script>

<div class="max-w-4xl mx-auto">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left Column: Display and Transport -->
    <div class="lg:col-span-1 space-y-4">
      <!-- LCD Display -->
      <Display />

      <!-- Transport Controls -->
      <TransportControls />

      <!-- Volume Controls -->
      <VolumeControls />

      <!-- Kit/Pattern Info -->
      <div class="bg-dr880-panel rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-400 mb-3">Current Setup</h3>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Kit:</span>
            <span class="text-white">{$currentKit?.name || 'None'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Pattern:</span>
            <span class="text-white">{$currentPattern?.name || 'None'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Tempo:</span>
            <span class="text-dr880-accent font-mono">{$tempo} BPM</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Pad Grid -->
    <div class="lg:col-span-2">
      <div class="bg-dr880-panel rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-400 mb-4 text-center">Key Pads</h3>
        <KeyPadGrid />
      </div>
    </div>
  </div>

  <!-- Pattern Grid (Step Sequencer View) -->
  <div class="mt-6">
    <PatternEditor />
  </div>
</div>
