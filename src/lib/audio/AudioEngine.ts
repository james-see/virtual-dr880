/**
 * AudioEngine - Core Web Audio API management for Virtual DR-880
 * Handles audio context initialization, routing, and master output
 */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let drumBus: GainNode | null = null;
let bassBus: GainNode | null = null;
let compressor: DynamicsCompressorNode | null = null;

// Sample cache to avoid reloading
const sampleCache = new Map<string, AudioBuffer>();

/**
 * Initialize the Web Audio engine
 * Must be called after user interaction (click/touch) due to browser policies
 */
export async function initAudioEngine(): Promise<void> {
  if (audioContext) {
    // Already initialized, just resume if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    return;
  }

  // Create audio context
  audioContext = new AudioContext({
    sampleRate: 44100,
    latencyHint: 'interactive'
  });

  // Create master compressor for overall dynamics control
  compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -12;
  compressor.knee.value = 10;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;

  // Create master gain node
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.8;

  // Create drum and bass bus gain nodes
  drumBus = audioContext.createGain();
  drumBus.gain.value = 0.8;

  bassBus = audioContext.createGain();
  bassBus.gain.value = 0.8;

  // Connect routing: drums/bass -> compressor -> master -> destination
  drumBus.connect(compressor);
  bassBus.connect(compressor);
  compressor.connect(masterGain);
  masterGain.connect(audioContext.destination);

  console.log('Audio engine initialized');
}

/**
 * Get the audio context (initializes if needed)
 */
export function getAudioContext(): AudioContext {
  if (!audioContext) {
    throw new Error('Audio engine not initialized. Call initAudioEngine() first.');
  }
  return audioContext;
}

/**
 * Get the master gain node
 */
export function getMasterGain(): GainNode {
  if (!masterGain) {
    throw new Error('Audio engine not initialized');
  }
  return masterGain;
}

/**
 * Get the drum bus gain node
 */
export function getDrumBus(): GainNode {
  if (!drumBus) {
    throw new Error('Audio engine not initialized');
  }
  return drumBus;
}

/**
 * Get the bass bus gain node
 */
export function getBassBus(): GainNode {
  if (!bassBus) {
    throw new Error('Audio engine not initialized');
  }
  return bassBus;
}

/**
 * Set master volume (0-100)
 */
export function setMasterVolume(volume: number): void {
  if (masterGain) {
    masterGain.gain.setTargetAtTime(volume / 100, audioContext!.currentTime, 0.01);
  }
}

/**
 * Set drum bus volume (0-100)
 */
export function setDrumVolume(volume: number): void {
  if (drumBus) {
    drumBus.gain.setTargetAtTime(volume / 100, audioContext!.currentTime, 0.01);
  }
}

/**
 * Set bass bus volume (0-100)
 */
export function setBassVolume(volume: number): void {
  if (bassBus) {
    bassBus.gain.setTargetAtTime(volume / 100, audioContext!.currentTime, 0.01);
  }
}

/**
 * Load an audio sample from URL
 * Uses caching to avoid reloading
 */
export async function loadSample(url: string): Promise<AudioBuffer> {
  // Check cache first
  if (sampleCache.has(url)) {
    return sampleCache.get(url)!;
  }

  const ctx = getAudioContext();
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load sample: ${url}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    
    // Cache the decoded buffer
    sampleCache.set(url, audioBuffer);
    
    return audioBuffer;
  } catch (error) {
    console.error(`Error loading sample ${url}:`, error);
    throw error;
  }
}

/**
 * Get current audio time (for precise scheduling)
 */
export function getCurrentTime(): number {
  return audioContext?.currentTime ?? 0;
}

/**
 * Check if audio context is running
 */
export function isAudioRunning(): boolean {
  return audioContext?.state === 'running';
}

/**
 * Resume audio context (needed after tab becomes inactive)
 */
export async function resumeAudio(): Promise<void> {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}

/**
 * Clear the sample cache (for memory management)
 */
export function clearSampleCache(): void {
  sampleCache.clear();
}

/**
 * Preload multiple samples
 */
export async function preloadSamples(urls: string[]): Promise<void> {
  await Promise.all(urls.map(url => loadSample(url)));
}
