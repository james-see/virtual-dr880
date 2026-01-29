<script lang="ts">
  import { viewMode, audioReady, masterVolume, drumVolume, bassVolume, tempo } from '../lib/stores';
  import ModernLayout from './modern/ModernLayout.svelte';
  import DR880Panel from './skeuomorphic/DR880Panel.svelte';
  import { onMount } from 'svelte';
  import { initAudioEngine } from '../lib/audio/AudioEngine';
  import { initMixer } from '../lib/audio/Mixer';
  import { initDatabase, getSetting, saveSetting, SETTINGS_KEYS } from '../lib/data/Storage';

  let audioInitialized = false;
  let showStartPrompt = true;

  // Load saved settings on mount
  onMount(async () => {
    try {
      await initDatabase();
      
      // Load saved settings
      const savedVolume = await getSetting<number>(SETTINGS_KEYS.MASTER_VOLUME);
      const savedDrumVolume = await getSetting<number>(SETTINGS_KEYS.DRUM_VOLUME);
      const savedBassVolume = await getSetting<number>(SETTINGS_KEYS.BASS_VOLUME);
      const savedTempo = await getSetting<number>(SETTINGS_KEYS.TEMPO);
      const savedViewMode = await getSetting<'modern' | 'skeuomorphic'>(SETTINGS_KEYS.VIEW_MODE);
      
      if (savedVolume !== undefined) masterVolume.set(savedVolume);
      if (savedDrumVolume !== undefined) drumVolume.set(savedDrumVolume);
      if (savedBassVolume !== undefined) bassVolume.set(savedBassVolume);
      if (savedTempo !== undefined) tempo.set(savedTempo);
      if (savedViewMode !== undefined) viewMode.set(savedViewMode);
    } catch (e) {
      console.warn('Could not load saved settings:', e);
    }
  });

  // Save settings when they change
  $: if (audioInitialized) {
    saveSetting(SETTINGS_KEYS.MASTER_VOLUME, $masterVolume).catch(() => {});
    saveSetting(SETTINGS_KEYS.DRUM_VOLUME, $drumVolume).catch(() => {});
    saveSetting(SETTINGS_KEYS.BASS_VOLUME, $bassVolume).catch(() => {});
    saveSetting(SETTINGS_KEYS.TEMPO, $tempo).catch(() => {});
    saveSetting(SETTINGS_KEYS.VIEW_MODE, $viewMode).catch(() => {});
  }

  async function startAudio() {
    if (!audioInitialized) {
      await initAudioEngine();
      initMixer();
      audioInitialized = true;
      audioReady.set(true);
      showStartPrompt = false;
    }
  }

  function toggleView() {
    viewMode.update(v => v === 'modern' ? 'skeuomorphic' : 'modern');
  }
</script>

<div class="min-h-screen bg-gray-900 text-white">
  <!-- Start Audio Prompt (required for Web Audio on mobile) -->
  {#if showStartPrompt}
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div class="bg-dr880-panel p-8 rounded-lg text-center max-w-md mx-4">
        <h1 class="text-3xl font-bold text-dr880-accent mb-4">Virtual DR-880</h1>
        <p class="text-gray-300 mb-6">Browser-based Boss DR-880 Drum Machine Emulator</p>
        <button 
          onclick={startAudio}
          class="bg-dr880-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          Start
        </button>
        <p class="text-gray-500 text-sm mt-4">Click to enable audio</p>
      </div>
    </div>
  {/if}

  <!-- Header -->
  <header class="bg-dr880-dark border-b border-gray-700 p-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold">
          <span class="text-dr880-accent">Virtual</span> DR-880
        </h1>
        <span class="text-gray-500 text-sm">Dr. Rhythm</span>
      </div>
      
      <div class="flex items-center gap-4">
        <!-- View Toggle -->
        <button
          onclick={toggleView}
          class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
        >
          <span class="text-sm text-gray-300">View:</span>
          <span class="font-medium">
            {$viewMode === 'modern' ? 'Modern' : 'Hardware'}
          </span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="p-4">
    {#if $viewMode === 'modern'}
      <ModernLayout />
    {:else}
      <DR880Panel />
    {/if}
  </main>

  <!-- Footer -->
  <footer class="bg-dr880-dark border-t border-gray-700 p-4 text-center text-gray-500 text-sm">
    <p>Virtual DR-880 | Not affiliated with Roland/BOSS Corporation</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
</style>
