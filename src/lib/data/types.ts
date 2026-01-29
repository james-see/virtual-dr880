// Pad bank types matching DR-880
export type PadBank = 'DRUM1' | 'DRUM2' | 'DRUM3' | 'BASS' | 'BASS_LOW' | 'BASS_HIGH';

// Instrument categories
export type InstrumentCategory = 
  | 'kick' 
  | 'snare' 
  | 'hihat' 
  | 'tom' 
  | 'cymbal' 
  | 'percussion' 
  | 'clap' 
  | 'fx'
  | 'bass';

// Single instrument/sample definition
export interface Instrument {
  id: string;
  name: string;
  category: InstrumentCategory;
  sampleUrl: string;
  defaultLevel: number;
  defaultPan: number;
}

// Pad assignment within a kit
export interface PadAssignment {
  instrumentId: string;
  level: number;      // 0-100
  pan: number;        // -50 to +50
  pitch: number;      // -50 to +50 semitones (coarse)
  pitchFine: number;  // -50 to +50 cents (fine)
  muteGroup: number | null; // 1-31 or null
  decay: number;      // 0-127
}

// Bass tone definition
export interface BassTone {
  id: string;
  name: string;
  sampleUrl: string;
  voices: number; // 1 or 2 (some bass tones use 2 voices)
}

// Complete kit definition (60 drum pads + 1 bass tone)
export interface Kit {
  id: string;
  name: string;
  isPreset: boolean;
  pads: PadAssignment[]; // 60 pads: DRUM1(0-19), DRUM2(20-39), DRUM3(40-59)
  bassTone: BassTone;
  drumLevel: number;     // 0-100
  bassLevel: number;     // 0-100
}

// Note event in a pattern
export interface NoteEvent {
  tick: number;          // Position in ticks (96 per quarter note)
  padIndex: number;      // 0-59 for drums, MIDI note for bass
  velocity: number;      // 1-127
  duration?: number;     // Duration in ticks (for bass notes)
}

// Chord for bass arrangement
export interface Chord {
  tick: number;
  root: string;          // C, C#, D, etc. or '--' for no chord
  type: string;          // Maj, m, 7, m7, etc.
  onBass?: string;       // Optional bass note override
  octaveShift: number;   // -1, 0, +1
}

// Fill-in definition
export interface FillIn {
  measure: number;
  fillId: string;        // Reference to fill library
}

// Pattern definition matching DR-880 structure
export interface Pattern {
  id: string;
  name: string;
  isPreset: boolean;
  timeSignature: [number, number]; // [beats, noteValue] e.g., [4, 4]
  measures: number;                // 1-999
  tempo: number;                   // 20-260 BPM
  kitId: string;
  tscPatchId?: string;
  arrange: boolean;                // Bass arrangement on/off
  key: string;                     // Pattern key (C-B, Cm-Bm)
  keyShift: number;                // -12 to +12
  drumTrack: NoteEvent[];
  bassTrack: NoteEvent[];
  chords: Chord[];
  fillIns: FillIn[];
}

// Song step (pattern placement)
export interface SongStep {
  patternId: string;
  repeat?: number;
}

// Song definition
export interface Song {
  id: string;
  name: string;
  steps: SongStep[];
  initTempo: number | null;  // null = use pattern tempos
  keyShift: number;
  loopStart: number;
  loopEnd: number;
  kitSelect: 'SONG' | 'PATTERN';
  kitId?: string;
  tscSelect: 'SONG' | 'PATTERN';
  tscPatchId?: string;
}

// TSC (Total Sound Control) patch
export interface TSCPatch {
  id: string;
  name: string;
  isPreset: boolean;
  eq: {
    enabled: boolean;
    inputGain: number;    // -20 to +20 dB
    low: { gain: number; freq: number; q: number | 'shelving' };
    mid: { gain: number; freq: number; q: number };
    high: { gain: number; freq: number; q: number | 'shelving' };
  };
  ambience: {
    enabled: boolean;
    type: 'AMBIENCE' | 'ROOM' | 'HALL' | 'PLATE';
    time: number;         // 0.1-10.0 seconds
    level: number;        // 0-100
    preDelay: number;     // 0-20 ms
  };
}

// MIDI note mapping for drum pads (matching DR-880)
export const DRUM1_MIDI_NOTES = [
  49, 57, 55, 53, 51,  // Row 1 (top)
  50, 48, 45, 41, 52,  // Row 2
  37, 39, 56, 44, 46,  // Row 3
  36, 35, 38, 40, 42   // Row 4 (bottom)
];

export const DRUM2_MIDI_NOTES = [
  89, 90, 93, 84, 59,
  69, 94, 70, 82, 92,
  54, 91, 95, 96, 97,
  60, 61, 62, 63, 64
];

export const DRUM3_MIDI_NOTES = [
  73, 74, 58, 80, 81,
  71, 72, 75, 67, 68,
  76, 77, 85, 66, 65,
  86, 87, 78, 79, 83
];
