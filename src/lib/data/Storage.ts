/**
 * Storage - IndexedDB persistence layer for Virtual DR-880
 * Handles saving and loading of user patterns, kits, and settings
 */

import { openDB, type IDBPDatabase } from 'idb';
import type { Kit, Pattern, Song, TSCPatch } from './types';

const DB_NAME = 'virtual-dr880';
const DB_VERSION = 1;

// Store names
const STORES = {
  PATTERNS: 'patterns',
  KITS: 'kits',
  SONGS: 'songs',
  TSC_PATCHES: 'tscPatches',
  SETTINGS: 'settings',
} as const;

// Settings keys
export const SETTINGS_KEYS = {
  LAST_PATTERN_ID: 'lastPatternId',
  LAST_KIT_ID: 'lastKitId',
  MASTER_VOLUME: 'masterVolume',
  DRUM_VOLUME: 'drumVolume',
  BASS_VOLUME: 'bassVolume',
  TEMPO: 'tempo',
  VIEW_MODE: 'viewMode',
} as const;

let db: IDBPDatabase | null = null;

/**
 * Initialize the database
 */
export async function initDatabase(): Promise<void> {
  if (db) return;

  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Patterns store
      if (!database.objectStoreNames.contains(STORES.PATTERNS)) {
        const patternStore = database.createObjectStore(STORES.PATTERNS, { keyPath: 'id' });
        patternStore.createIndex('name', 'name');
        patternStore.createIndex('isPreset', 'isPreset');
      }

      // Kits store
      if (!database.objectStoreNames.contains(STORES.KITS)) {
        const kitStore = database.createObjectStore(STORES.KITS, { keyPath: 'id' });
        kitStore.createIndex('name', 'name');
        kitStore.createIndex('isPreset', 'isPreset');
      }

      // Songs store
      if (!database.objectStoreNames.contains(STORES.SONGS)) {
        const songStore = database.createObjectStore(STORES.SONGS, { keyPath: 'id' });
        songStore.createIndex('name', 'name');
      }

      // TSC Patches store
      if (!database.objectStoreNames.contains(STORES.TSC_PATCHES)) {
        const tscStore = database.createObjectStore(STORES.TSC_PATCHES, { keyPath: 'id' });
        tscStore.createIndex('name', 'name');
        tscStore.createIndex('isPreset', 'isPreset');
      }

      // Settings store (key-value)
      if (!database.objectStoreNames.contains(STORES.SETTINGS)) {
        database.createObjectStore(STORES.SETTINGS);
      }
    },
  });

  console.log('Database initialized');
}

/**
 * Get database instance
 */
function getDb(): IDBPDatabase {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// =====================
// PATTERNS
// =====================

/**
 * Save a pattern
 */
export async function savePattern(pattern: Pattern): Promise<void> {
  const database = getDb();
  await database.put(STORES.PATTERNS, pattern);
}

/**
 * Get a pattern by ID
 */
export async function getPattern(id: string): Promise<Pattern | undefined> {
  const database = getDb();
  return database.get(STORES.PATTERNS, id);
}

/**
 * Get all patterns
 */
export async function getAllPatterns(): Promise<Pattern[]> {
  const database = getDb();
  return database.getAll(STORES.PATTERNS);
}

/**
 * Get user patterns only
 */
export async function getUserPatterns(): Promise<Pattern[]> {
  const database = getDb();
  const all = await database.getAll(STORES.PATTERNS);
  return all.filter(p => !p.isPreset);
}

/**
 * Delete a pattern
 */
export async function deletePattern(id: string): Promise<void> {
  const database = getDb();
  await database.delete(STORES.PATTERNS, id);
}

// =====================
// KITS
// =====================

/**
 * Save a kit
 */
export async function saveKit(kit: Kit): Promise<void> {
  const database = getDb();
  await database.put(STORES.KITS, kit);
}

/**
 * Get a kit by ID
 */
export async function getKit(id: string): Promise<Kit | undefined> {
  const database = getDb();
  return database.get(STORES.KITS, id);
}

/**
 * Get all kits
 */
export async function getAllKits(): Promise<Kit[]> {
  const database = getDb();
  return database.getAll(STORES.KITS);
}

/**
 * Get user kits only
 */
export async function getUserKits(): Promise<Kit[]> {
  const database = getDb();
  const all = await database.getAll(STORES.KITS);
  return all.filter(k => !k.isPreset);
}

/**
 * Delete a kit
 */
export async function deleteKit(id: string): Promise<void> {
  const database = getDb();
  await database.delete(STORES.KITS, id);
}

// =====================
// SONGS
// =====================

/**
 * Save a song
 */
export async function saveSong(song: Song): Promise<void> {
  const database = getDb();
  await database.put(STORES.SONGS, song);
}

/**
 * Get a song by ID
 */
export async function getSong(id: string): Promise<Song | undefined> {
  const database = getDb();
  return database.get(STORES.SONGS, id);
}

/**
 * Get all songs
 */
export async function getAllSongs(): Promise<Song[]> {
  const database = getDb();
  return database.getAll(STORES.SONGS);
}

/**
 * Delete a song
 */
export async function deleteSong(id: string): Promise<void> {
  const database = getDb();
  await database.delete(STORES.SONGS, id);
}

// =====================
// SETTINGS
// =====================

/**
 * Save a setting
 */
export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const database = getDb();
  await database.put(STORES.SETTINGS, value, key);
}

/**
 * Get a setting
 */
export async function getSetting<T>(key: string): Promise<T | undefined> {
  const database = getDb();
  return database.get(STORES.SETTINGS, key);
}

/**
 * Get multiple settings
 */
export async function getSettings<T extends Record<string, unknown>>(
  keys: string[]
): Promise<Partial<T>> {
  const database = getDb();
  const result: Partial<T> = {};
  
  for (const key of keys) {
    const value = await database.get(STORES.SETTINGS, key);
    if (value !== undefined) {
      (result as Record<string, unknown>)[key] = value;
    }
  }
  
  return result;
}

/**
 * Save multiple settings
 */
export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  const database = getDb();
  const tx = database.transaction(STORES.SETTINGS, 'readwrite');
  
  for (const [key, value] of Object.entries(settings)) {
    await tx.store.put(value, key);
  }
  
  await tx.done;
}

// =====================
// UTILITY
// =====================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Export all data as JSON
 */
export async function exportAllData(): Promise<string> {
  const database = getDb();
  
  const data = {
    patterns: await database.getAll(STORES.PATTERNS),
    kits: await database.getAll(STORES.KITS),
    songs: await database.getAll(STORES.SONGS),
    tscPatches: await database.getAll(STORES.TSC_PATCHES),
    exportDate: new Date().toISOString(),
    version: DB_VERSION,
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON
 */
export async function importData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  const database = getDb();
  
  // Import patterns
  if (data.patterns) {
    const tx = database.transaction(STORES.PATTERNS, 'readwrite');
    for (const pattern of data.patterns) {
      await tx.store.put(pattern);
    }
    await tx.done;
  }
  
  // Import kits
  if (data.kits) {
    const tx = database.transaction(STORES.KITS, 'readwrite');
    for (const kit of data.kits) {
      await tx.store.put(kit);
    }
    await tx.done;
  }
  
  // Import songs
  if (data.songs) {
    const tx = database.transaction(STORES.SONGS, 'readwrite');
    for (const song of data.songs) {
      await tx.store.put(song);
    }
    await tx.done;
  }
}

/**
 * Clear all user data
 */
export async function clearAllData(): Promise<void> {
  const database = getDb();
  
  await database.clear(STORES.PATTERNS);
  await database.clear(STORES.KITS);
  await database.clear(STORES.SONGS);
  await database.clear(STORES.TSC_PATCHES);
  await database.clear(STORES.SETTINGS);
}
