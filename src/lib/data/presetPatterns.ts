/**
 * DR-880 Preset Patterns (500 patterns)
 * Pattern IDs match the DR-880: P001-P500
 */

import type { Pattern, NoteEvent } from './types';

// Pattern name database matching DR-880 categories
const PATTERN_NAMES: string[] = [
  // P001-P050: Rock
  'Rock 1', 'Rock 2', 'Rock 3', 'Hard Rock 1', 'Hard Rock 2',
  'Soft Rock 1', 'Soft Rock 2', 'Classic Rock', 'Blues Rock', 'Alt Rock 1',
  'Alt Rock 2', 'Punk Rock 1', 'Punk Rock 2', 'Grunge 1', 'Grunge 2',
  'Metal 1', 'Metal 2', 'Heavy Metal', 'Thrash', 'Power Rock',
  'Arena Rock', 'Prog Rock 1', 'Prog Rock 2', 'Indie Rock 1', 'Indie Rock 2',
  'Garage Rock', 'Surf Rock', 'Rockabilly', 'Southern Rock', 'Roots Rock',
  'Rock Ballad 1', 'Rock Ballad 2', 'Rock Shuffle', 'Rock Swing', 'Rock 12/8',
  'Rock 6/8', 'Rock Waltz', 'Rock Train', 'Rock Stomp', 'Rock Drive',
  'Rock Groove 1', 'Rock Groove 2', 'Rock Fill 1', 'Rock Fill 2', 'Rock Anthem',
  'Stadium Rock', 'Rock Power', 'Rock Edge', 'Rock Solid', 'Rock Steady',
  
  // P051-P100: Pop
  'Pop 1', 'Pop 2', 'Pop 3', 'Pop 4', 'Dance Pop 1',
  'Dance Pop 2', 'Synth Pop 1', 'Synth Pop 2', 'Electro Pop', 'Indie Pop',
  'Teen Pop', 'Bubblegum', 'Power Pop', 'Pop Rock 1', 'Pop Rock 2',
  'Pop Ballad 1', 'Pop Ballad 2', 'Pop Shuffle', 'Pop Swing', 'Pop Groove 1',
  'Pop Groove 2', 'Pop Drive', 'Pop Lite', 'Pop Bright', 'Pop Smooth',
  'Adult Pop', 'Soft Pop', 'Easy Pop', 'Pop Country', 'Pop Latin',
  'Pop World', 'Pop Funk', 'Pop Soul', 'Pop R&B', 'Pop Hip Hop',
  'Pop 6/8', 'Pop 12/8', 'Pop Waltz', 'Pop March', 'Pop Reggae',
  '80s Pop 1', '80s Pop 2', '90s Pop 1', '90s Pop 2', '2000s Pop',
  'Modern Pop 1', 'Modern Pop 2', 'Chart Pop', 'Radio Pop', 'Crossover',
  
  // P101-P150: R&B/Soul
  'R&B 1', 'R&B 2', 'R&B 3', 'R&B 4', 'Modern R&B 1',
  'Modern R&B 2', 'Neo Soul 1', 'Neo Soul 2', 'Classic Soul', 'Northern Soul',
  'Southern Soul', 'Motown 1', 'Motown 2', 'Philly Soul', 'Memphis Soul',
  'Soul Ballad 1', 'Soul Ballad 2', 'Soul Shuffle', 'Soul Groove 1', 'Soul Groove 2',
  'Quiet Storm', 'Slow Jam 1', 'Slow Jam 2', 'R&B Swing', 'R&B Hip Hop',
  'New Jack Swing', 'Urban 1', 'Urban 2', 'Contemporary R&B', 'Adult R&B',
  'R&B Pop', 'R&B Dance', 'R&B Funk', 'R&B Jazz', 'R&B Blues',
  'R&B 6/8', 'R&B 12/8', 'R&B Waltz', 'R&B Mid', 'R&B Up',
  'R&B Lite', 'R&B Heavy', 'R&B Smooth', 'R&B Groovy', 'R&B Chill',
  'Soul Train', 'Soul Power', 'Soul Fire', 'Soul Deep', 'Soul Brother',
  
  // P151-P200: Funk
  'Funk 1', 'Funk 2', 'Funk 3', 'Funk 4', 'Classic Funk',
  'P-Funk', 'Go-Go', 'Funk Rock', 'Funk Pop', 'Funk Soul',
  'Funk Jazz', 'Acid Funk', 'Funk Shuffle', 'Funk Swing', 'Funk Groove 1',
  'Funk Groove 2', 'Funk Groove 3', 'Slap Funk', 'Synth Funk', 'Electro Funk',
  'Funk Ballad', 'Funk Mid', 'Funk Up', 'Funk Drive', 'Funk Fire',
  'Parliament', 'Ohio Style', 'Minneapolis', 'L.A. Funk', 'NYC Funk',
  'Funk Brothers', 'Funk Machine', 'Funk Box', 'Funk Street', 'Funk Club',
  'Funk 70s', 'Funk 80s', 'Funk 90s', 'Modern Funk', 'Nu Funk',
  'Funk Lite', 'Funk Heavy', 'Funk Smooth', 'Funk Raw', 'Funk Dirty',
  'Bootsy', 'James Brown', 'Sly Stone', 'Prince Style', 'Funk Master',
  
  // P201-P250: Jazz
  'Jazz 1', 'Jazz 2', 'Jazz 3', 'Jazz 4', 'Swing 1',
  'Swing 2', 'Swing 3', 'Big Band 1', 'Big Band 2', 'Bebop 1',
  'Bebop 2', 'Hard Bop', 'Cool Jazz', 'Modal Jazz', 'Free Jazz',
  'Fusion 1', 'Fusion 2', 'Jazz Funk', 'Jazz Rock', 'Jazz Blues',
  'Jazz Ballad 1', 'Jazz Ballad 2', 'Jazz Waltz 1', 'Jazz Waltz 2', 'Jazz 5/4',
  'Jazz 7/4', 'Jazz Shuffle', 'Jazz Brush 1', 'Jazz Brush 2', 'Jazz Brush 3',
  'Smooth Jazz 1', 'Smooth Jazz 2', 'Acid Jazz 1', 'Acid Jazz 2', 'Nu Jazz',
  'Jazz Latin', 'Jazz Bossa', 'Jazz Samba', 'Jazz Afro', 'Jazz World',
  'Trio Jazz', 'Quartet Jazz', 'Small Combo', 'Jazz Club', 'Jazz Lounge',
  'Jazz Cafe', 'Jazz Night', 'Jazz Groove', 'Jazz Chill', 'Jazz Soul',
  
  // P251-P300: Blues
  'Blues 1', 'Blues 2', 'Blues 3', 'Blues 4', 'Chicago Blues',
  'Delta Blues', 'Texas Blues', 'Memphis Blues', 'Electric Blues', 'Acoustic Blues',
  'Blues Rock 1', 'Blues Rock 2', 'Blues Shuffle 1', 'Blues Shuffle 2', 'Blues Swing',
  'Slow Blues 1', 'Slow Blues 2', 'Blues Ballad', 'Blues 12/8', 'Blues 6/8',
  'Jump Blues', 'Boogie Blues', 'Blues Groove 1', 'Blues Groove 2', 'Blues Walk',
  'Blues Band', 'Blues Trio', 'Blues Duo', 'Solo Blues', 'Blues Jam',
  'Modern Blues', 'Classic Blues', 'Country Blues', 'Urban Blues', 'Blues Jazz',
  'Blues Funk', 'Blues Soul', 'Blues Pop', 'Blues Latin', 'Blues World',
  'BB King', 'SRV Style', 'Hendrix Blues', 'Clapton Style', 'Muddy Waters',
  'Robert Johnson', 'Blues Legend', 'Blues Master', 'Blues King', 'Blues Fire',
  
  // P301-P350: Latin
  'Bossa Nova 1', 'Bossa Nova 2', 'Samba 1', 'Samba 2', 'Salsa 1',
  'Salsa 2', 'Mambo 1', 'Mambo 2', 'Cha Cha 1', 'Cha Cha 2',
  'Rumba 1', 'Rumba 2', 'Merengue 1', 'Merengue 2', 'Cumbia 1',
  'Cumbia 2', 'Reggaeton 1', 'Reggaeton 2', 'Bachata 1', 'Bachata 2',
  'Bolero 1', 'Bolero 2', 'Tango 1', 'Tango 2', 'Flamenco 1',
  'Flamenco 2', 'Latin Rock', 'Latin Pop', 'Latin Jazz 1', 'Latin Jazz 2',
  'Latin Funk', 'Latin Soul', 'Latin Ballad', 'Latin Groove 1', 'Latin Groove 2',
  'Afro Cuban 1', 'Afro Cuban 2', 'Son 1', 'Son 2', 'Guaguanco',
  'Latin 6/8', 'Latin Waltz', 'Latin Shuffle', 'Latin Swing', 'Latin Fire',
  'Brazil 1', 'Brazil 2', 'Caribbean', 'Tropical', 'Island Groove',
  
  // P351-P400: Dance/Electronic
  'House 1', 'House 2', 'Deep House', 'Tech House', 'Progressive House',
  'Electro House', 'Techno 1', 'Techno 2', 'Detroit Techno', 'Minimal',
  'Trance 1', 'Trance 2', 'Psy Trance', 'Uplifting Trance', 'Progressive',
  'Drum & Bass 1', 'Drum & Bass 2', 'Jungle', 'Breakbeat 1', 'Breakbeat 2',
  'Dubstep 1', 'Dubstep 2', 'EDM 1', 'EDM 2', 'Big Room',
  'Trap 1', 'Trap 2', 'Future Bass', 'Chill Trap', 'Hard Trap',
  'Garage 1', 'Garage 2', 'UK Garage', '2-Step', 'Grime',
  'Ambient 1', 'Ambient 2', 'Downtempo 1', 'Downtempo 2', 'Trip Hop',
  'Industrial 1', 'Industrial 2', 'EBM', 'Synth Wave', 'Retro Wave',
  'Lo-Fi 1', 'Lo-Fi 2', 'Chillhop', 'Vaporwave', 'Electronica',
  
  // P401-P450: Hip Hop
  'Hip Hop 1', 'Hip Hop 2', 'Hip Hop 3', 'Hip Hop 4', 'Old School',
  'New School', 'East Coast 1', 'East Coast 2', 'West Coast 1', 'West Coast 2',
  'Dirty South 1', 'Dirty South 2', 'Crunk', 'Snap Music', 'Hyphy',
  'Boom Bap 1', 'Boom Bap 2', 'Golden Era', '90s Hip Hop', '2000s Hip Hop',
  'Modern Hip Hop', 'Trap Beat 1', 'Trap Beat 2', 'Drill 1', 'Drill 2',
  'Cloud Rap', 'Emo Rap', 'Mumble Rap', 'Conscious', 'Gangsta',
  'Underground', 'Alternative Hip Hop', 'Jazz Rap', 'Abstract', 'Experimental',
  'G-Funk', 'Mobb Deep Style', 'Wu-Tang Style', 'Outkast Style', 'Kanye Style',
  'Drake Style', 'Travis Style', 'Hip Hop Ballad', 'Hip Hop R&B', 'Hip Hop Soul',
  'Hip Hop Pop', 'Hip Hop Rock', 'Hip Hop Latin', 'Hip Hop World', 'Hip Hop Club',
  
  // P451-P500: World/Other
  'Reggae 1', 'Reggae 2', 'Dub 1', 'Dub 2', 'Ska 1',
  'Ska 2', 'Rocksteady', 'Dancehall 1', 'Dancehall 2', 'Ragga',
  'Afrobeat 1', 'Afrobeat 2', 'Highlife', 'Soukous', 'Juju',
  'Middle Eastern 1', 'Middle Eastern 2', 'Arabic', 'Turkish', 'Persian',
  'Indian 1', 'Indian 2', 'Bollywood', 'Bhangra', 'Tabla',
  'Asian 1', 'Asian 2', 'J-Pop', 'K-Pop', 'C-Pop',
  'Country 1', 'Country 2', 'Country Rock', 'Country Pop', 'Bluegrass',
  'Folk 1', 'Folk 2', 'Celtic', 'Irish', 'Scottish',
  'Polka', 'Waltz', 'March 1', 'March 2', 'Military',
  'Gospel 1', 'Gospel 2', 'Christian Rock', 'Worship', 'Hymn',
];

// Basic drum patterns for different styles (simplified)
// Tick positions: 0, 24, 48, 72, 96... (24 = 16th note, 48 = 8th note, 96 = quarter)

function createBasicRockPattern(): NoteEvent[] {
  // 4/4 rock beat: kick on 1&3, snare on 2&4, hihat 8ths
  const events: NoteEvent[] = [];
  const KICK = 15; // Pad index for kick1 (DRUM1_INSTRUMENTS array position)
  const SNARE = 17; // Pad index for snare1
  const HH_CLOSED = 19; // Pad index for closed hihat
  
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384; // 4 beats * 96 ticks
    
    // Kick on 1 and 3
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 100 });
    events.push({ tick: offset + 192, padIndex: KICK, velocity: 100 });
    
    // Snare on 2 and 4
    events.push({ tick: offset + 96, padIndex: SNARE, velocity: 100 });
    events.push({ tick: offset + 288, padIndex: SNARE, velocity: 100 });
    
    // Hi-hat on every 8th note
    for (let i = 0; i < 8; i++) {
      events.push({ tick: offset + i * 48, padIndex: HH_CLOSED, velocity: 80 });
    }
  }
  return events;
}

function createFunkPattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const HH_CLOSED = 19;
  const HH_OPEN = 14;
  
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384;
    
    // Syncopated kick
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 100 });
    events.push({ tick: offset + 72, padIndex: KICK, velocity: 90 });
    events.push({ tick: offset + 192, padIndex: KICK, velocity: 95 });
    events.push({ tick: offset + 312, padIndex: KICK, velocity: 85 });
    
    // Ghost notes and backbeat
    events.push({ tick: offset + 96, padIndex: SNARE, velocity: 100 });
    events.push({ tick: offset + 168, padIndex: SNARE, velocity: 50 }); // ghost
    events.push({ tick: offset + 288, padIndex: SNARE, velocity: 100 });
    
    // 16th note hi-hats with accents
    for (let i = 0; i < 16; i++) {
      const vel = i % 4 === 0 ? 90 : i % 2 === 0 ? 70 : 50;
      events.push({ tick: offset + i * 24, padIndex: HH_CLOSED, velocity: vel });
    }
  }
  return events;
}

function createHipHopPattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const HH_CLOSED = 19;
  
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384;
    
    // Boom bap kick pattern
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 100 });
    events.push({ tick: offset + 168, padIndex: KICK, velocity: 90 });
    events.push({ tick: offset + 288, padIndex: KICK, velocity: 85 });
    
    // Snare on 2 and 4
    events.push({ tick: offset + 96, padIndex: SNARE, velocity: 100 });
    events.push({ tick: offset + 288, padIndex: SNARE, velocity: 100 });
    
    // Hi-hat pattern
    events.push({ tick: offset + 0, padIndex: HH_CLOSED, velocity: 80 });
    events.push({ tick: offset + 48, padIndex: HH_CLOSED, velocity: 60 });
    events.push({ tick: offset + 96, padIndex: HH_CLOSED, velocity: 80 });
    events.push({ tick: offset + 144, padIndex: HH_CLOSED, velocity: 60 });
    events.push({ tick: offset + 192, padIndex: HH_CLOSED, velocity: 80 });
    events.push({ tick: offset + 240, padIndex: HH_CLOSED, velocity: 60 });
    events.push({ tick: offset + 288, padIndex: HH_CLOSED, velocity: 80 });
    events.push({ tick: offset + 336, padIndex: HH_CLOSED, velocity: 60 });
  }
  return events;
}

function createJazzPattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const RIDE = 4; // Ride cymbal
  
  // Jazz swing pattern
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384;
    
    // Feathered kick on beats
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 60 });
    events.push({ tick: offset + 96, padIndex: KICK, velocity: 50 });
    events.push({ tick: offset + 192, padIndex: KICK, velocity: 60 });
    events.push({ tick: offset + 288, padIndex: KICK, velocity: 50 });
    
    // Cross-stick on 2 and 4
    events.push({ tick: offset + 96, padIndex: 10, velocity: 70 }); // stick
    events.push({ tick: offset + 288, padIndex: 10, velocity: 70 });
    
    // Ride cymbal swing pattern (triplet feel)
    events.push({ tick: offset + 0, padIndex: RIDE, velocity: 80 });
    events.push({ tick: offset + 64, padIndex: RIDE, velocity: 60 }); // swing 8th
    events.push({ tick: offset + 96, padIndex: RIDE, velocity: 80 });
    events.push({ tick: offset + 160, padIndex: RIDE, velocity: 60 });
    events.push({ tick: offset + 192, padIndex: RIDE, velocity: 80 });
    events.push({ tick: offset + 256, padIndex: RIDE, velocity: 60 });
    events.push({ tick: offset + 288, padIndex: RIDE, velocity: 80 });
    events.push({ tick: offset + 352, padIndex: RIDE, velocity: 60 });
  }
  return events;
}

function createHousePattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const HH_CLOSED = 19;
  const HH_OPEN = 14;
  const CLAP = 11;
  
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384;
    
    // Four on the floor
    for (let i = 0; i < 4; i++) {
      events.push({ tick: offset + i * 96, padIndex: KICK, velocity: 100 });
    }
    
    // Clap on 2 and 4
    events.push({ tick: offset + 96, padIndex: CLAP, velocity: 90 });
    events.push({ tick: offset + 288, padIndex: CLAP, velocity: 90 });
    
    // Off-beat hi-hats
    for (let i = 0; i < 4; i++) {
      events.push({ tick: offset + 48 + i * 96, padIndex: HH_OPEN, velocity: 70 });
    }
  }
  return events;
}

function createLatinPattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const HH_CLOSED = 19;
  const COWBELL = 12;
  
  // Bossa nova pattern
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 384;
    
    // Bossa kick pattern
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 90 });
    events.push({ tick: offset + 144, padIndex: KICK, velocity: 80 });
    events.push({ tick: offset + 192, padIndex: KICK, velocity: 85 });
    events.push({ tick: offset + 336, padIndex: KICK, velocity: 80 });
    
    // Cross-stick pattern
    events.push({ tick: offset + 96, padIndex: 10, velocity: 70 });
    events.push({ tick: offset + 288, padIndex: 10, velocity: 70 });
    
    // Shaker/hi-hat 16ths
    for (let i = 0; i < 16; i++) {
      events.push({ tick: offset + i * 24, padIndex: HH_CLOSED, velocity: 50 + (i % 4 === 0 ? 20 : 0) });
    }
  }
  return events;
}

function createBallad6_8Pattern(): NoteEvent[] {
  const events: NoteEvent[] = [];
  const KICK = 15;
  const SNARE = 17;
  const HH_CLOSED = 19;
  
  // 6/8 ballad (compound meter)
  // 6 eighth notes per measure, 48 ticks each = 288 ticks per measure
  for (let measure = 0; measure < 2; measure++) {
    const offset = measure * 288;
    
    // Kick on 1 and 4
    events.push({ tick: offset + 0, padIndex: KICK, velocity: 90 });
    events.push({ tick: offset + 144, padIndex: KICK, velocity: 80 });
    
    // Snare on 4
    events.push({ tick: offset + 144, padIndex: SNARE, velocity: 85 });
    
    // Hi-hat on all 6 8ths
    for (let i = 0; i < 6; i++) {
      events.push({ tick: offset + i * 48, padIndex: HH_CLOSED, velocity: 70 });
    }
  }
  return events;
}

// Get pattern based on style category
function getPatternForIndex(index: number): NoteEvent[] {
  // Different pattern types based on index ranges
  if (index < 50) return createBasicRockPattern();
  if (index < 100) return createBasicRockPattern(); // Pop uses rock basis
  if (index < 150) return createFunkPattern(); // R&B
  if (index < 200) return createFunkPattern(); // Funk
  if (index < 250) return createJazzPattern(); // Jazz
  if (index < 300) return createBasicRockPattern(); // Blues uses rock shuffle
  if (index < 350) return createLatinPattern(); // Latin
  if (index < 400) return createHousePattern(); // Dance/Electronic
  if (index < 450) return createHipHopPattern(); // Hip Hop
  return createBasicRockPattern(); // World/Other
}

// Generate all 500 preset patterns
export function getPresetPatterns(): Pattern[] {
  return PATTERN_NAMES.map((name, index) => {
    const id = String(index + 1).padStart(3, '0');
    const tempo = getTempoForStyle(index);
    const timeSignature = getTimeSignatureForStyle(index);
    
    return {
      id: `P${id}`,
      name,
      isPreset: true,
      timeSignature,
      measures: 2,
      tempo,
      kitId: 'default',
      arrange: false,
      key: 'C',
      keyShift: 0,
      drumTrack: getPatternForIndex(index),
      bassTrack: [],
      chords: [],
      fillIns: [],
    };
  });
}

function getTempoForStyle(index: number): number {
  // Return appropriate tempo for style
  if (index < 50) return 100 + Math.floor(Math.random() * 40); // Rock: 100-140
  if (index < 100) return 100 + Math.floor(Math.random() * 30); // Pop: 100-130
  if (index < 150) return 70 + Math.floor(Math.random() * 30); // R&B: 70-100
  if (index < 200) return 95 + Math.floor(Math.random() * 25); // Funk: 95-120
  if (index < 250) return 100 + Math.floor(Math.random() * 80); // Jazz: 100-180
  if (index < 300) return 60 + Math.floor(Math.random() * 40); // Blues: 60-100
  if (index < 350) return 100 + Math.floor(Math.random() * 40); // Latin: 100-140
  if (index < 400) return 120 + Math.floor(Math.random() * 20); // Dance: 120-140
  if (index < 450) return 80 + Math.floor(Math.random() * 20); // Hip Hop: 80-100
  return 100 + Math.floor(Math.random() * 30); // World: 100-130
}

function getTimeSignatureForStyle(index: number): [number, number] {
  // Most patterns are 4/4, some special cases
  const name = PATTERN_NAMES[index];
  if (name.includes('Waltz') || name.includes('3/4')) return [3, 4];
  if (name.includes('6/8') || name.includes('12/8')) return [6, 8];
  if (name.includes('5/4')) return [5, 4];
  if (name.includes('7/4')) return [7, 4];
  return [4, 4];
}

// Get a single preset pattern by ID (1-500)
export function getPresetPattern(id: number): Pattern | null {
  if (id < 1 || id > 500) return null;
  const patterns = getPresetPatterns();
  return patterns[id - 1] || null;
}

// Get pattern name by ID
export function getPatternName(id: number): string {
  if (id < 1 || id > 500) return 'Unknown';
  return PATTERN_NAMES[id - 1] || 'Unknown';
}
