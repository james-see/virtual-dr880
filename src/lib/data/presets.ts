/**
 * Preset data for Virtual DR-880
 * Contains default kit, sample mappings, and pad labels
 */

import type { Kit, PadAssignment, BassTone, PadBank, Pattern } from './types';

// Bass note mappings (chromatic layout for 20 pads)
export const BASS_NOTES: Array<{ name: string; note: string; semitones: number }> = [
  // Row 1 (top) - C3 to E3
  { name: 'C', note: 'C3', semitones: 0 },
  { name: 'C#', note: 'C#3', semitones: 1 },
  { name: 'D', note: 'D3', semitones: 2 },
  { name: 'D#', note: 'D#3', semitones: 3 },
  { name: 'E', note: 'E3', semitones: 4 },
  // Row 2
  { name: 'F', note: 'F3', semitones: 5 },
  { name: 'F#', note: 'F#3', semitones: 6 },
  { name: 'G', note: 'G3', semitones: 7 },
  { name: 'G#', note: 'G#3', semitones: 8 },
  { name: 'A', note: 'A3', semitones: 9 },
  // Row 3
  { name: 'A#', note: 'A#3', semitones: 10 },
  { name: 'B', note: 'B3', semitones: 11 },
  { name: 'C', note: 'C4', semitones: 12 },
  { name: 'C#', note: 'C#4', semitones: 13 },
  { name: 'D', note: 'D4', semitones: 14 },
  // Row 4 (bottom)
  { name: 'D#', note: 'D#4', semitones: 15 },
  { name: 'E', note: 'E4', semitones: 16 },
  { name: 'F', note: 'F4', semitones: 17 },
  { name: 'F#', note: 'F#4', semitones: 18 },
  { name: 'G', note: 'G4', semitones: 19 },
];

// Default DRUM 1 instruments (matching DR-880 exact layout)
// Grid displays top-to-bottom, left-to-right
// Row 1 (top): pads 16-20, Row 2: pads 11-15, Row 3: pads 6-10, Row 4 (bottom): pads 1-5
export const DRUM1_INSTRUMENTS = [
  // Row 1 (top) - Pads 16-20
  { id: 'crash1', name: 'CRASH 1', category: 'cymbal', padNum: 16, note: 'G' },
  { id: 'crash2', name: 'CRASH 2', category: 'cymbal', padNum: 17, note: 'G#' },
  { id: 'splash', name: 'SPLASH', category: 'cymbal', padNum: 18, note: 'A' },
  { id: 'ride_bell', name: 'BELL', category: 'cymbal', padNum: 19, note: 'Bb' },
  { id: 'ride1', name: 'RIDE', category: 'cymbal', padNum: 20, note: 'B' },
  // Row 2 - Pads 11-15
  { id: 'tom1', name: 'TOM 1', category: 'tom', padNum: 11, note: 'D' },
  { id: 'tom2', name: 'TOM 2', category: 'tom', padNum: 12, note: 'Eb' },
  { id: 'tom3', name: 'TOM 3', category: 'tom', padNum: 13, note: 'E' },
  { id: 'tom4', name: 'TOM 4', category: 'tom', padNum: 14, note: 'F' },
  { id: 'china', name: 'CHINA', category: 'cymbal', padNum: 15, note: 'F#' },
  // Row 3 - Pads 6-10
  { id: 'stick', name: 'CROSS STICK', category: 'percussion', padNum: 6, note: 'A' },
  { id: 'clap', name: 'CLAP', category: 'clap', padNum: 7, note: 'Bb' },
  { id: 'cowbell', name: 'COWBELL', category: 'percussion', padNum: 8, note: 'B' },
  { id: 'hihat_pedal', name: 'PEDAL HH', category: 'hihat', padNum: 9, note: 'C' },
  { id: 'hihat_open', name: 'OPEN HH', category: 'hihat', padNum: 10, note: 'C#' },
  // Row 4 (bottom) - Pads 1-5
  { id: 'kick1', name: 'KICK 1', category: 'kick', padNum: 1, note: 'E' },
  { id: 'kick2', name: 'KICK 2', category: 'kick', padNum: 2, note: 'F' },
  { id: 'snare1', name: 'SNARE 1', category: 'snare', padNum: 3, note: 'F#' },
  { id: 'snare2', name: 'SNARE 2', category: 'snare', padNum: 4, note: 'G' },
  { id: 'hihat_closed', name: 'CLOSED HH', category: 'hihat', padNum: 5, note: 'G#' },
];

// Default DRUM 2 instruments (percussion)
export const DRUM2_INSTRUMENTS = [
  { id: 'conga_hi_slap', name: 'Conga H Slp', category: 'percussion' },
  { id: 'conga_hi_open', name: 'Conga H Op', category: 'percussion' },
  { id: 'conga_lo_open', name: 'Conga L Op', category: 'percussion' },
  { id: 'bongo_hi', name: 'Bongo Hi', category: 'percussion' },
  { id: 'bongo_lo', name: 'Bongo Lo', category: 'percussion' },
  { id: 'timbale_hi', name: 'Timb Hi', category: 'percussion' },
  { id: 'timbale_lo', name: 'Timb Lo', category: 'percussion' },
  { id: 'cowbell', name: 'Cowbell', category: 'percussion' },
  { id: 'agogo_hi', name: 'Agogo Hi', category: 'percussion' },
  { id: 'agogo_lo', name: 'Agogo Lo', category: 'percussion' },
  { id: 'cabasa', name: 'Cabasa', category: 'percussion' },
  { id: 'maracas', name: 'Maracas', category: 'percussion' },
  { id: 'shaker', name: 'Shaker', category: 'percussion' },
  { id: 'tambourine', name: 'Tamb', category: 'percussion' },
  { id: 'triangle', name: 'Triangle', category: 'percussion' },
  { id: 'woodblock_hi', name: 'WdBlk Hi', category: 'percussion' },
  { id: 'woodblock_lo', name: 'WdBlk Lo', category: 'percussion' },
  { id: 'claves', name: 'Claves', category: 'percussion' },
  { id: 'guiro', name: 'Guiro', category: 'percussion' },
  { id: 'vibraslap', name: 'Vibraslap', category: 'percussion' },
];

// Default DRUM 3 instruments (electronic/fx)
export const DRUM3_INSTRUMENTS = [
  { id: '808_kick', name: '808 Kick', category: 'kick' },
  { id: '808_snare', name: '808 Snare', category: 'snare' },
  { id: '808_clap', name: '808 Clap', category: 'clap' },
  { id: '808_hihat_c', name: '808 HH C', category: 'hihat' },
  { id: '808_hihat_o', name: '808 HH O', category: 'hihat' },
  { id: '909_kick', name: '909 Kick', category: 'kick' },
  { id: '909_snare', name: '909 Snare', category: 'snare' },
  { id: '909_clap', name: '909 Clap', category: 'clap' },
  { id: '909_hihat_c', name: '909 HH C', category: 'hihat' },
  { id: '909_hihat_o', name: '909 HH O', category: 'hihat' },
  { id: 'scratch1', name: 'Scratch 1', category: 'fx' },
  { id: 'scratch2', name: 'Scratch 2', category: 'fx' },
  { id: 'zap1', name: 'Zap 1', category: 'fx' },
  { id: 'zap2', name: 'Zap 2', category: 'fx' },
  { id: 'hit1', name: 'Hit 1', category: 'fx' },
  { id: 'voice_kick', name: 'Vox Kick', category: 'fx' },
  { id: 'voice_snare', name: 'Vox Snare', category: 'fx' },
  { id: 'voice_hh', name: 'Vox HH', category: 'fx' },
  { id: 'snap', name: 'Snap', category: 'clap' },
  { id: 'noise', name: 'Noise', category: 'fx' },
];

// Create a default pad assignment
function createPadAssignment(instrumentId: string): PadAssignment {
  return {
    instrumentId,
    level: 100,
    pan: 0,
    pitch: 0,
    pitchFine: 0,
    muteGroup: null,
    decay: 64,
  };
}

// Default bass tone
// Get default bass tone with correct base URL
function getDefaultBassTone(): BassTone {
  return {
    id: 'finger_bass',
    name: 'Finger Bass',
    sampleUrl: `${BASE_URL}samples/bass/finger_bass.mp3`,
    voices: 1,
  };
}

// Create default kit
export function getDefaultKit(): Kit {
  const pads: PadAssignment[] = [];

  // DRUM 1 pads (0-19)
  DRUM1_INSTRUMENTS.forEach(inst => {
    const pad = createPadAssignment(inst.id);
    // Set hi-hat mute group
    if (inst.id.includes('hihat')) {
      pad.muteGroup = 1;
    }
    pads.push(pad);
  });

  // DRUM 2 pads (20-39)
  DRUM2_INSTRUMENTS.forEach(inst => {
    pads.push(createPadAssignment(inst.id));
  });

  // DRUM 3 pads (40-59)
  DRUM3_INSTRUMENTS.forEach(inst => {
    const pad = createPadAssignment(inst.id);
    // Set 808/909 hi-hat mute groups
    if (inst.id === '808_hihat_c' || inst.id === '808_hihat_o') {
      pad.muteGroup = 2;
    }
    if (inst.id === '909_hihat_c' || inst.id === '909_hihat_o') {
      pad.muteGroup = 3;
    }
    pads.push(pad);
  });

  return {
    id: 'default',
    name: 'Studio 1',
    isPreset: true,
    pads,
    bassTone: getDefaultBassTone(),
    drumLevel: 80,
    bassLevel: 80,
  };
}

// Get pad labels for display
export function getPadLabels(
  bank: PadBank, 
  kit: Kit
): Array<{ name: string; note?: string; padNum?: number }> {
  switch (bank) {
    case 'DRUM1':
      return DRUM1_INSTRUMENTS.map(inst => ({ 
        name: inst.name, 
        note: inst.note,
        padNum: inst.padNum 
      }));
    case 'DRUM2':
      return DRUM2_INSTRUMENTS.map(inst => ({ name: inst.name }));
    case 'DRUM3':
      return DRUM3_INSTRUMENTS.map(inst => ({ name: inst.name }));
    case 'BASS':
    case 'BASS_LOW':
    case 'BASS_HIGH':
      return BASS_NOTES.map(note => ({ name: note.name, note: note.note }));
    default:
      return DRUM1_INSTRUMENTS.map(inst => ({ name: inst.name }));
  }
}

// Base URL for samples (handles GitHub Pages subpath)
// Ensure BASE_URL has trailing slash
const rawBaseUrl = import.meta.env.BASE_URL || '/';
const BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

// Get sample URL for an instrument
export function getSampleUrl(instrumentId: string): string {
  // Map instrument IDs to their sample files
  // Using WAV for drums (from LinnDrum, TR-909, CR-78 - Public Domain)
  // Using MP3 for bass
  const sampleMap: Record<string, string> = {
    // DRUM 1 - Standard kit (LinnDrum samples)
    'crash1': 'cymbals/crash1.wav',
    'crash2': 'cymbals/crash2.wav',
    'china': 'cymbals/china.wav',
    'splash': 'cymbals/splash.wav',
    'ride_bell': 'cymbals/ride_bell.wav',
    'ride1': 'cymbals/ride1.wav',
    'ride2': 'cymbals/ride1.wav',  // Use same as ride1
    'tom1': 'toms/tom1.wav',
    'tom2': 'toms/tom2.wav',
    'tom3': 'toms/tom3.wav',
    'tom4': 'toms/tom4.wav',
    'stick': 'percussion/stick.wav',
    'clap': 'percussion/clap.wav',
    'hihat_pedal': 'hihats/hihat_pedal.wav',
    'hihat_closed': 'hihats/hihat_closed.wav',
    'hihat_open': 'hihats/hihat_open.wav',
    'kick1': 'kicks/kick1.wav',
    'kick2': 'kicks/kick2.wav',
    'snare1': 'snares/snare1.wav',
    'snare2': 'snares/snare2.wav',
    
    // DRUM 2 - Percussion (LinnDrum + CR-78)
    'conga_hi_slap': 'percussion/conga_hi_slap.wav',
    'conga_hi_open': 'percussion/conga_hi_open.wav',
    'conga_lo_open': 'percussion/conga_lo_open.wav',
    'bongo_hi': 'percussion/bongo_hi.wav',
    'bongo_lo': 'percussion/bongo_lo.wav',
    'timbale_hi': 'percussion/cowbell.wav',  // Use cowbell as fallback
    'timbale_lo': 'percussion/cowbell.wav',
    'cowbell': 'percussion/cowbell.wav',
    'agogo_hi': 'percussion/cowbell.wav',
    'agogo_lo': 'percussion/cowbell.wav',
    'cabasa': 'percussion/shaker.wav',
    'maracas': 'percussion/shaker.wav',
    'shaker': 'percussion/shaker.wav',
    'tambourine': 'percussion/tambourine.wav',
    'triangle': 'percussion/stick.wav',
    'woodblock_hi': 'percussion/stick.wav',
    'woodblock_lo': 'percussion/stick.wav',
    'claves': 'percussion/stick.wav',
    'guiro': 'percussion/guiro.wav',
    'vibraslap': 'percussion/shaker.wav',
    
    // DRUM 3 - Electronic (TR-909, CR-78)
    '808_kick': 'kicks/808_kick.wav',
    '808_snare': 'snares/808_snare.wav',
    '808_clap': 'percussion/808_clap.wav',
    '808_hihat_c': 'hihats/808_hihat_c.wav',
    '808_hihat_o': 'hihats/808_hihat_o.wav',
    '909_kick': 'kicks/909_kick.wav',
    '909_snare': 'snares/909_snare.wav',
    '909_clap': 'percussion/909_clap.wav',
    '909_hihat_c': 'hihats/909_hihat_c.wav',
    '909_hihat_o': 'hihats/909_hihat_o.wav',
    'scratch1': 'percussion/shaker.wav',
    'scratch2': 'percussion/shaker.wav',
    'zap1': 'snares/snare1.wav',
    'zap2': 'snares/snare2.wav',
    'hit1': 'percussion/clap.wav',
    'voice_kick': 'kicks/kick1.wav',
    'voice_snare': 'snares/snare1.wav',
    'voice_hh': 'hihats/hihat_closed.wav',
    'snap': 'percussion/clap.wav',
    'noise': 'hihats/hihat_open.wav',
    
    // Bass (MP3 - generated)
    'finger_bass': 'bass/finger_bass.mp3',
    'pick_bass': 'bass/finger_bass.mp3',
    'slap_bass': 'bass/finger_bass.mp3',
    'synth_bass': 'bass/finger_bass.mp3',
    '808_bass': 'bass/finger_bass.mp3',
  };

  const samplePath = sampleMap[instrumentId];
  if (samplePath) {
    return `${BASE_URL}samples/${samplePath}`;
  }
  
  // Fallback to kick1
  return `${BASE_URL}samples/kicks/kick1.wav`;
}

// Default pattern for testing
export function getDefaultPattern(): Pattern {
  return {
    id: 'default',
    name: 'New Pattern',
    isPreset: false,
    timeSignature: [4, 4],
    measures: 1,
    tempo: 120,
    kitId: 'default',
    arrange: false,
    key: 'C',
    keyShift: 0,
    drumTrack: [],
    bassTrack: [],
    chords: [],
    fillIns: [],
  };
}

// List of all preset kits (just names for now)
export const PRESET_KIT_NAMES = [
  'Studio 1', 'Studio 2', 'Studio 3', 'Room 1', 'Room 2',
  'Rock 1', 'Rock 2', 'Power 1', 'Power 2', 'Jazz 1',
  'Jazz 2', 'Brush 1', 'Funk 1', 'Funk 2', 'R&B 1',
  'R&B 2', 'Hip Hop 1', 'Hip Hop 2', 'House 1', 'Techno 1',
];
