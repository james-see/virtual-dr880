import { writable, derived } from 'svelte/store';
import type { Kit, Pattern, PadBank } from './data/types';

// View mode: 'skeuomorphic' or 'modern'
export const viewMode = writable<'skeuomorphic' | 'modern'>('modern');

// Current pad bank selection
export const currentPadBank = writable<PadBank>('DRUM1');

// Current kit
export const currentKit = writable<Kit | null>(null);

// Current pattern number (1-500 for presets)
export const currentPatternNumber = writable(1);

// Current pattern
export const currentPattern = writable<Pattern | null>(null);

// Transport state
export const isPlaying = writable(false);
export const tempo = writable(120);
export const currentTick = writable(0);
export const currentMeasure = writable(1);
export const currentBeat = writable(1);

// Master volume levels (0-100)
export const masterVolume = writable(80);
export const drumVolume = writable(80);
export const bassVolume = writable(80);

// Audio engine ready state
export const audioReady = writable(false);

// Active pads (for visual feedback)
export const activePads = writable<Set<number>>(new Set());

// Derived store for current position display
export const positionDisplay = derived(
  [currentMeasure, currentBeat],
  ([$measure, $beat]) => `${$measure}:${$beat}`
);
