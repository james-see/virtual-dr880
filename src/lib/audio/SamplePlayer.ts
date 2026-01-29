/**
 * SamplePlayer - Handles playback of individual drum/bass samples
 * Supports velocity, pitch shifting, panning, and mute groups
 */

import { getAudioContext, getDrumBus, getBassBus, loadSample } from './AudioEngine';

// Track active voices for mute groups
const muteGroupVoices = new Map<number, AudioBufferSourceNode[]>();

// Track all active voices for polyphony management
const activeVoices: Set<AudioBufferSourceNode> = new Set();
const MAX_POLYPHONY = 32;

export interface PlayOptions {
  velocity?: number;      // 1-127, default 100
  pitch?: number;         // Semitones, -50 to +50
  pitchFine?: number;     // Cents, -50 to +50
  pan?: number;           // -50 to +50
  level?: number;         // 0-100
  muteGroup?: number | null;
  isBass?: boolean;       // Route to bass bus instead of drum bus
  startTime?: number;     // Scheduled start time (for sequencer)
  duration?: number;      // For bass notes - stop after duration
}

/**
 * Play a sample with the given options
 */
export async function playSample(
  sampleUrl: string,
  options: PlayOptions = {}
): Promise<AudioBufferSourceNode | null> {
  const ctx = getAudioContext();
  
  // Manage polyphony - stop oldest voice if at limit
  if (activeVoices.size >= MAX_POLYPHONY) {
    const oldestVoice = activeVoices.values().next().value;
    if (oldestVoice) {
      try {
        oldestVoice.stop();
      } catch (e) {
        // Voice may have already stopped
      }
      activeVoices.delete(oldestVoice);
    }
  }

  try {
    const buffer = await loadSample(sampleUrl);
    
    const {
      velocity = 100,
      pitch = 0,
      pitchFine = 0,
      pan = 0,
      level = 100,
      muteGroup = null,
      isBass = false,
      startTime = ctx.currentTime,
      duration
    } = options;

    // Handle mute groups - stop any playing sounds in same group
    if (muteGroup !== null) {
      const existingVoices = muteGroupVoices.get(muteGroup);
      if (existingVoices) {
        existingVoices.forEach(voice => {
          try {
            voice.stop();
            activeVoices.delete(voice);
          } catch (e) {
            // Voice may have already stopped
          }
        });
      }
      muteGroupVoices.set(muteGroup, []);
    }

    // Create source node
    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Calculate playback rate for pitch shift
    // Each semitone is a factor of 2^(1/12)
    const semitoneRatio = Math.pow(2, 1/12);
    const totalPitchShift = pitch + (pitchFine / 100);
    source.playbackRate.value = Math.pow(semitoneRatio, totalPitchShift);

    // Create gain node for velocity and level
    const gainNode = ctx.createGain();
    // Velocity curve: quadratic for more natural response
    const velocityGain = Math.pow(velocity / 127, 2);
    const levelGain = level / 100;
    gainNode.gain.value = velocityGain * levelGain;

    // Create stereo panner for pan control
    const panNode = ctx.createStereoPanner();
    panNode.pan.value = pan / 50; // Convert -50..+50 to -1..+1

    // Connect the chain
    source.connect(gainNode);
    gainNode.connect(panNode);
    
    // Route to appropriate bus
    if (isBass) {
      panNode.connect(getBassBus());
    } else {
      panNode.connect(getDrumBus());
    }

    // Track voice for polyphony and mute groups
    activeVoices.add(source);
    if (muteGroup !== null) {
      const voices = muteGroupVoices.get(muteGroup) || [];
      voices.push(source);
      muteGroupVoices.set(muteGroup, voices);
    }

    // Clean up when voice ends
    source.onended = () => {
      activeVoices.delete(source);
      if (muteGroup !== null) {
        const voices = muteGroupVoices.get(muteGroup);
        if (voices) {
          const index = voices.indexOf(source);
          if (index > -1) {
            voices.splice(index, 1);
          }
        }
      }
    };

    // Start playback
    source.start(startTime);

    // For bass notes with duration, schedule stop
    if (duration !== undefined && duration > 0) {
      const stopTime = startTime + duration;
      source.stop(stopTime);
    }

    return source;
  } catch (error) {
    console.error('Error playing sample:', error);
    return null;
  }
}

/**
 * Trigger a pad hit (convenience method)
 */
export async function triggerPad(
  sampleUrl: string,
  velocity: number,
  padOptions: Omit<PlayOptions, 'velocity'>
): Promise<void> {
  await playSample(sampleUrl, { ...padOptions, velocity });
}

/**
 * Stop all sounds in a mute group
 */
export function stopMuteGroup(muteGroup: number): void {
  const voices = muteGroupVoices.get(muteGroup);
  if (voices) {
    voices.forEach(voice => {
      try {
        voice.stop();
        activeVoices.delete(voice);
      } catch (e) {
        // Voice may have already stopped
      }
    });
    muteGroupVoices.set(muteGroup, []);
  }
}

/**
 * Stop all playing sounds
 */
export function stopAllSounds(): void {
  activeVoices.forEach(voice => {
    try {
      voice.stop();
    } catch (e) {
      // Voice may have already stopped
    }
  });
  activeVoices.clear();
  muteGroupVoices.clear();
}

/**
 * Get current polyphony count
 */
export function getActiveVoiceCount(): number {
  return activeVoices.size;
}
