/**
 * Mixer - High-level mixing controls for Virtual DR-880
 * Provides reactive volume control tied to Svelte stores
 */

import { 
  setMasterVolume, 
  setDrumVolume, 
  setBassVolume,
  getAudioContext 
} from './AudioEngine';
import { masterVolume, drumVolume, bassVolume } from '../stores';

// Subscribe to store changes and update audio engine
let unsubscribeMaster: (() => void) | null = null;
let unsubscribeDrum: (() => void) | null = null;
let unsubscribeBass: (() => void) | null = null;

/**
 * Initialize mixer - connects stores to audio engine
 * Call after audio engine is initialized
 */
export function initMixer(): void {
  // Subscribe to volume stores and update audio
  unsubscribeMaster = masterVolume.subscribe(value => {
    setMasterVolume(value);
  });

  unsubscribeDrum = drumVolume.subscribe(value => {
    setDrumVolume(value);
  });

  unsubscribeBass = bassVolume.subscribe(value => {
    setBassVolume(value);
  });
}

/**
 * Clean up mixer subscriptions
 */
export function destroyMixer(): void {
  unsubscribeMaster?.();
  unsubscribeDrum?.();
  unsubscribeBass?.();
}

/**
 * Convert decibels to linear gain
 */
export function dbToGain(db: number): number {
  return Math.pow(10, db / 20);
}

/**
 * Convert linear gain to decibels
 */
export function gainToDb(gain: number): number {
  if (gain <= 0) return -Infinity;
  return 20 * Math.log10(gain);
}

/**
 * Convert 0-100 percentage to dB (-60 to 0 dB range)
 */
export function percentToDb(percent: number): number {
  if (percent <= 0) return -Infinity;
  // Map 0-100 to -60dB to 0dB with a curve
  const normalizedPercent = Math.max(0, Math.min(100, percent)) / 100;
  return -60 * (1 - normalizedPercent);
}

/**
 * Convert dB to 0-100 percentage
 */
export function dbToPercent(db: number): number {
  if (db <= -60) return 0;
  if (db >= 0) return 100;
  return (1 - (db / -60)) * 100;
}

/**
 * Meter data for visualization
 */
export interface MeterData {
  peak: number;    // 0-1
  rms: number;     // 0-1
  clip: boolean;   // True if clipping
}

// Analyser nodes for metering (created on demand)
let masterAnalyser: AnalyserNode | null = null;
let drumAnalyser: AnalyserNode | null = null;
let bassAnalyser: AnalyserNode | null = null;

/**
 * Create an analyser node for metering
 */
function createAnalyser(): AnalyserNode {
  const ctx = getAudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.3;
  return analyser;
}

/**
 * Get meter data from an analyser node
 */
export function getMeterData(analyser: AnalyserNode): MeterData {
  const dataArray = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(dataArray);

  let peak = 0;
  let sum = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const sample = Math.abs(dataArray[i]);
    if (sample > peak) peak = sample;
    sum += sample * sample;
  }

  const rms = Math.sqrt(sum / dataArray.length);
  
  return {
    peak: Math.min(1, peak),
    rms: Math.min(1, rms),
    clip: peak >= 1
  };
}

/**
 * Utility to create a simple envelope for volume automation
 */
export function createEnvelope(
  gainNode: GainNode,
  attack: number,  // seconds
  decay: number,   // seconds
  sustain: number, // 0-1
  release: number  // seconds
): { 
  trigger: (velocity: number) => void; 
  release: () => void; 
} {
  const ctx = getAudioContext();
  
  return {
    trigger: (velocity: number) => {
      const now = ctx.currentTime;
      const maxGain = velocity / 127;
      
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(maxGain, now + attack);
      gainNode.gain.linearRampToValueAtTime(maxGain * sustain, now + attack + decay);
    },
    release: () => {
      const now = ctx.currentTime;
      const currentGain = gainNode.gain.value;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(currentGain, now);
      gainNode.gain.linearRampToValueAtTime(0, now + release);
    }
  };
}
