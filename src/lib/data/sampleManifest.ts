/**
 * Sample Manifest - Defines all available samples for the Virtual DR-880
 * Maps instrument IDs to their sample file paths
 */

export interface SampleInfo {
  id: string;
  name: string;
  file: string;
  category: string;
}

// Kick samples
export const KICK_SAMPLES: SampleInfo[] = [
  { id: 'kick1', name: 'Studio Kick 1', file: 'kicks/kick1.mp3', category: 'kick' },
  { id: 'kick2', name: 'Studio Kick 2', file: 'kicks/kick2.mp3', category: 'kick' },
  { id: '808_kick', name: '808 Kick', file: 'kicks/808_kick.mp3', category: 'kick' },
  { id: '909_kick', name: '909 Kick', file: 'kicks/909_kick.mp3', category: 'kick' },
];

// Snare samples
export const SNARE_SAMPLES: SampleInfo[] = [
  { id: 'snare1', name: 'Studio Snare 1', file: 'snares/snare1.mp3', category: 'snare' },
  { id: 'snare2', name: 'Studio Snare 2', file: 'snares/snare2.mp3', category: 'snare' },
  { id: '808_snare', name: '808 Snare', file: 'snares/808_snare.mp3', category: 'snare' },
  { id: '909_snare', name: '909 Snare', file: 'snares/909_snare.mp3', category: 'snare' },
];

// Hi-hat samples
export const HIHAT_SAMPLES: SampleInfo[] = [
  { id: 'hihat_closed', name: 'Closed HH', file: 'hihats/hihat_closed.mp3', category: 'hihat' },
  { id: 'hihat_open', name: 'Open HH', file: 'hihats/hihat_open.mp3', category: 'hihat' },
  { id: 'hihat_pedal', name: 'Pedal HH', file: 'hihats/hihat_pedal.mp3', category: 'hihat' },
  { id: '808_hihat_c', name: '808 Closed HH', file: 'hihats/808_hihat_c.mp3', category: 'hihat' },
  { id: '808_hihat_o', name: '808 Open HH', file: 'hihats/808_hihat_o.mp3', category: 'hihat' },
  { id: '909_hihat_c', name: '909 Closed HH', file: 'hihats/909_hihat_c.mp3', category: 'hihat' },
  { id: '909_hihat_o', name: '909 Open HH', file: 'hihats/909_hihat_o.mp3', category: 'hihat' },
];

// Tom samples
export const TOM_SAMPLES: SampleInfo[] = [
  { id: 'tom1', name: 'High Tom', file: 'toms/tom1.mp3', category: 'tom' },
  { id: 'tom2', name: 'Mid Tom', file: 'toms/tom2.mp3', category: 'tom' },
  { id: 'tom3', name: 'Low Tom', file: 'toms/tom3.mp3', category: 'tom' },
  { id: 'tom4', name: 'Floor Tom', file: 'toms/tom4.mp3', category: 'tom' },
];

// Cymbal samples
export const CYMBAL_SAMPLES: SampleInfo[] = [
  { id: 'crash1', name: 'Crash 1', file: 'cymbals/crash1.mp3', category: 'cymbal' },
  { id: 'crash2', name: 'Crash 2', file: 'cymbals/crash2.mp3', category: 'cymbal' },
  { id: 'ride1', name: 'Ride 1', file: 'cymbals/ride1.mp3', category: 'cymbal' },
  { id: 'ride2', name: 'Ride 2', file: 'cymbals/ride2.mp3', category: 'cymbal' },
  { id: 'ride_bell', name: 'Ride Bell', file: 'cymbals/ride_bell.mp3', category: 'cymbal' },
  { id: 'china', name: 'China', file: 'cymbals/china.mp3', category: 'cymbal' },
  { id: 'splash', name: 'Splash', file: 'cymbals/splash.mp3', category: 'cymbal' },
];

// Percussion samples
export const PERCUSSION_SAMPLES: SampleInfo[] = [
  { id: 'clap', name: 'Hand Clap', file: 'percussion/clap.mp3', category: 'clap' },
  { id: '808_clap', name: '808 Clap', file: 'percussion/808_clap.mp3', category: 'clap' },
  { id: '909_clap', name: '909 Clap', file: 'percussion/909_clap.mp3', category: 'clap' },
  { id: 'stick', name: 'Stick', file: 'percussion/stick.mp3', category: 'percussion' },
  { id: 'snap', name: 'Finger Snap', file: 'percussion/snap.mp3', category: 'clap' },
  { id: 'conga_hi_slap', name: 'Conga Hi Slap', file: 'percussion/conga_hi_slap.mp3', category: 'percussion' },
  { id: 'conga_hi_open', name: 'Conga Hi Open', file: 'percussion/conga_hi_open.mp3', category: 'percussion' },
  { id: 'conga_lo_open', name: 'Conga Lo Open', file: 'percussion/conga_lo_open.mp3', category: 'percussion' },
  { id: 'bongo_hi', name: 'Bongo Hi', file: 'percussion/bongo_hi.mp3', category: 'percussion' },
  { id: 'bongo_lo', name: 'Bongo Lo', file: 'percussion/bongo_lo.mp3', category: 'percussion' },
  { id: 'timbale_hi', name: 'Timbale Hi', file: 'percussion/timbale_hi.mp3', category: 'percussion' },
  { id: 'timbale_lo', name: 'Timbale Lo', file: 'percussion/timbale_lo.mp3', category: 'percussion' },
  { id: 'cowbell', name: 'Cowbell', file: 'percussion/cowbell.mp3', category: 'percussion' },
  { id: 'agogo_hi', name: 'Agogo Hi', file: 'percussion/agogo_hi.mp3', category: 'percussion' },
  { id: 'agogo_lo', name: 'Agogo Lo', file: 'percussion/agogo_lo.mp3', category: 'percussion' },
  { id: 'cabasa', name: 'Cabasa', file: 'percussion/cabasa.mp3', category: 'percussion' },
  { id: 'maracas', name: 'Maracas', file: 'percussion/maracas.mp3', category: 'percussion' },
  { id: 'shaker', name: 'Shaker', file: 'percussion/shaker.mp3', category: 'percussion' },
  { id: 'tambourine', name: 'Tambourine', file: 'percussion/tambourine.mp3', category: 'percussion' },
  { id: 'triangle', name: 'Triangle', file: 'percussion/triangle.mp3', category: 'percussion' },
  { id: 'woodblock_hi', name: 'Wood Block Hi', file: 'percussion/woodblock_hi.mp3', category: 'percussion' },
  { id: 'woodblock_lo', name: 'Wood Block Lo', file: 'percussion/woodblock_lo.mp3', category: 'percussion' },
  { id: 'claves', name: 'Claves', file: 'percussion/claves.mp3', category: 'percussion' },
  { id: 'guiro', name: 'Guiro', file: 'percussion/guiro.mp3', category: 'percussion' },
  { id: 'vibraslap', name: 'Vibraslap', file: 'percussion/vibraslap.mp3', category: 'percussion' },
  // Electronic FX
  { id: 'scratch1', name: 'Scratch 1', file: 'percussion/scratch1.mp3', category: 'fx' },
  { id: 'scratch2', name: 'Scratch 2', file: 'percussion/scratch2.mp3', category: 'fx' },
  { id: 'zap1', name: 'Zap 1', file: 'percussion/zap1.mp3', category: 'fx' },
  { id: 'zap2', name: 'Zap 2', file: 'percussion/zap2.mp3', category: 'fx' },
  { id: 'hit1', name: 'Hit 1', file: 'percussion/hit1.mp3', category: 'fx' },
  { id: 'voice_kick', name: 'Voice Kick', file: 'percussion/voice_kick.mp3', category: 'fx' },
  { id: 'voice_snare', name: 'Voice Snare', file: 'percussion/voice_snare.mp3', category: 'fx' },
  { id: 'voice_hh', name: 'Voice HH', file: 'percussion/voice_hh.mp3', category: 'fx' },
  { id: 'noise', name: 'Noise', file: 'percussion/noise.mp3', category: 'fx' },
];

// Bass samples
export const BASS_SAMPLES: SampleInfo[] = [
  { id: 'finger_bass', name: 'Finger Bass', file: 'bass/finger_bass.mp3', category: 'bass' },
  { id: 'pick_bass', name: 'Pick Bass', file: 'bass/pick_bass.mp3', category: 'bass' },
  { id: 'slap_bass', name: 'Slap Bass', file: 'bass/slap_bass.mp3', category: 'bass' },
  { id: 'synth_bass', name: 'Synth Bass', file: 'bass/synth_bass.mp3', category: 'bass' },
  { id: '808_bass', name: '808 Bass', file: 'bass/808_bass.mp3', category: 'bass' },
];

// All samples combined
export const ALL_SAMPLES: SampleInfo[] = [
  ...KICK_SAMPLES,
  ...SNARE_SAMPLES,
  ...HIHAT_SAMPLES,
  ...TOM_SAMPLES,
  ...CYMBAL_SAMPLES,
  ...PERCUSSION_SAMPLES,
  ...BASS_SAMPLES,
];

// Get sample by ID
export function getSampleById(id: string): SampleInfo | undefined {
  return ALL_SAMPLES.find(s => s.id === id);
}

// Get sample URL with base path
export function getSamplePath(id: string, basePath: string = '/samples'): string {
  const sample = getSampleById(id);
  if (sample) {
    return `${basePath}/${sample.file}`;
  }
  // Fallback to kick1
  return `${basePath}/kicks/kick1.mp3`;
}
