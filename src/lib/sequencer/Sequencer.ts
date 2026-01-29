/**
 * Sequencer - High-resolution pattern playback engine for Virtual DR-880
 * Uses Web Audio API timing for precise scheduling at 96 PPQN (pulses per quarter note)
 */

import { get } from 'svelte/store';
import { 
  isPlaying, 
  tempo, 
  currentTick, 
  currentMeasure, 
  currentBeat,
  currentPattern,
  currentKit,
  activePads
} from '../stores';
import { getAudioContext, getCurrentTime } from '../audio/AudioEngine';
import { playSample } from '../audio/SamplePlayer';
import { getSampleUrl } from '../data/presets';
import type { Pattern, NoteEvent } from '../data/types';

// Constants
const TICKS_PER_BEAT = 96;  // Standard MIDI resolution
const LOOKAHEAD_MS = 25;    // How far ahead to schedule (ms)
const SCHEDULE_AHEAD_TIME = 0.1; // How far ahead to schedule audio (seconds)

// State
let schedulerTimer: ReturnType<typeof setInterval> | null = null;
let nextNoteTime = 0;
let currentTickPosition = 0;
let scheduledEvents: Map<number, NoteEvent[]> = new Map();

/**
 * Convert tempo (BPM) to seconds per tick
 */
function getSecondsPerTick(bpm: number): number {
  const secondsPerBeat = 60 / bpm;
  return secondsPerBeat / TICKS_PER_BEAT;
}

/**
 * Get total ticks in the current pattern
 */
function getTotalTicks(pattern: Pattern): number {
  const [beatsPerMeasure] = pattern.timeSignature;
  return pattern.measures * beatsPerMeasure * TICKS_PER_BEAT;
}

/**
 * Build a map of tick positions to events for efficient playback
 */
function buildEventMap(pattern: Pattern): Map<number, NoteEvent[]> {
  const map = new Map<number, NoteEvent[]>();
  
  // Add all drum events
  for (const event of pattern.drumTrack) {
    const tick = event.tick;
    if (!map.has(tick)) {
      map.set(tick, []);
    }
    map.get(tick)!.push(event);
  }
  
  // Add all bass events
  for (const event of pattern.bassTrack) {
    const tick = event.tick;
    if (!map.has(tick)) {
      map.set(tick, []);
    }
    map.get(tick)!.push({ ...event, padIndex: event.padIndex + 1000 }); // Mark as bass
  }
  
  return map;
}

/**
 * Schedule events at a specific time
 */
async function scheduleEvents(events: NoteEvent[], time: number): Promise<void> {
  const kit = get(currentKit);
  if (!kit) return;

  const padSet = new Set<number>();

  for (const event of events) {
    const isBass = event.padIndex >= 1000;
    const padIndex = isBass ? event.padIndex - 1000 : event.padIndex;
    
    if (isBass) {
      // Play bass note
      const bassTone = kit.bassTone;
      await playSample(bassTone.sampleUrl, {
        velocity: event.velocity,
        pitch: padIndex, // For bass, padIndex represents semitone offset
        level: kit.bassLevel,
        isBass: true,
        startTime: time,
        duration: event.duration ? event.duration * getSecondsPerTick(get(tempo)) : undefined
      });
    } else {
      // Play drum sound
      const pad = kit.pads[padIndex];
      if (pad) {
        const sampleUrl = getSampleUrl(pad.instrumentId);
        await playSample(sampleUrl, {
          velocity: event.velocity,
          pitch: pad.pitch,
          pitchFine: pad.pitchFine,
          pan: pad.pan,
          level: pad.level,
          muteGroup: pad.muteGroup,
          isBass: false,
          startTime: time
        });
        
        padSet.add(padIndex % 20); // Add to active pads for visual feedback
      }
    }
  }

  // Update active pads for visual feedback (brief flash)
  if (padSet.size > 0) {
    activePads.set(padSet);
    setTimeout(() => {
      activePads.update(current => {
        const newSet = new Set(current);
        padSet.forEach(p => newSet.delete(p));
        return newSet;
      });
    }, 100);
  }
}

/**
 * Main scheduler function - called periodically to schedule upcoming events
 */
function scheduler(): void {
  const pattern = get(currentPattern);
  if (!pattern) return;

  const ctx = getAudioContext();
  const currentTime = ctx.currentTime;
  const bpm = get(tempo);
  const secondsPerTick = getSecondsPerTick(bpm);
  const totalTicks = getTotalTicks(pattern);

  // Schedule events until we've scheduled enough ahead
  while (nextNoteTime < currentTime + SCHEDULE_AHEAD_TIME) {
    // Get events at current tick
    const events = scheduledEvents.get(currentTickPosition);
    if (events && events.length > 0) {
      scheduleEvents(events, nextNoteTime);
    }

    // Update position display
    const [beatsPerMeasure] = pattern.timeSignature;
    const ticksPerMeasure = beatsPerMeasure * TICKS_PER_BEAT;
    const measureNum = Math.floor(currentTickPosition / ticksPerMeasure) + 1;
    const tickInMeasure = currentTickPosition % ticksPerMeasure;
    const beatNum = Math.floor(tickInMeasure / TICKS_PER_BEAT) + 1;

    currentTick.set(currentTickPosition);
    currentMeasure.set(measureNum);
    currentBeat.set(beatNum);

    // Advance to next tick
    nextNoteTime += secondsPerTick;
    currentTickPosition++;

    // Loop pattern
    if (currentTickPosition >= totalTicks) {
      currentTickPosition = 0;
    }
  }
}

/**
 * Start the sequencer
 */
export function startSequencer(): void {
  if (get(isPlaying)) return;

  const pattern = get(currentPattern);
  if (!pattern) {
    console.warn('No pattern loaded');
    return;
  }

  // Build event map for efficient lookup
  scheduledEvents = buildEventMap(pattern);

  // Initialize timing
  const ctx = getAudioContext();
  nextNoteTime = ctx.currentTime;

  // Start scheduler
  schedulerTimer = setInterval(scheduler, LOOKAHEAD_MS);
  isPlaying.set(true);

  console.log('Sequencer started');
}

/**
 * Stop the sequencer
 */
export function stopSequencer(): void {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  isPlaying.set(false);
  activePads.set(new Set());
  
  console.log('Sequencer stopped');
}

/**
 * Reset sequencer to beginning
 */
export function resetSequencer(): void {
  currentTickPosition = 0;
  currentTick.set(0);
  currentMeasure.set(1);
  currentBeat.set(1);
  
  if (get(isPlaying)) {
    const ctx = getAudioContext();
    nextNoteTime = ctx.currentTime;
  }
}

/**
 * Set playback position (in ticks)
 */
export function setPosition(tick: number): void {
  const pattern = get(currentPattern);
  if (!pattern) return;

  const totalTicks = getTotalTicks(pattern);
  currentTickPosition = tick % totalTicks;
  
  const [beatsPerMeasure] = pattern.timeSignature;
  const ticksPerMeasure = beatsPerMeasure * TICKS_PER_BEAT;
  const measureNum = Math.floor(currentTickPosition / ticksPerMeasure) + 1;
  const tickInMeasure = currentTickPosition % ticksPerMeasure;
  const beatNum = Math.floor(tickInMeasure / TICKS_PER_BEAT) + 1;

  currentTick.set(currentTickPosition);
  currentMeasure.set(measureNum);
  currentBeat.set(beatNum);

  if (get(isPlaying)) {
    const ctx = getAudioContext();
    nextNoteTime = ctx.currentTime;
  }
}

/**
 * Check if sequencer is running
 */
export function isSequencerRunning(): boolean {
  return get(isPlaying);
}

/**
 * Get current tick position
 */
export function getCurrentTick(): number {
  return currentTickPosition;
}
