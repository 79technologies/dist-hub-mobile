import { type SQLiteDatabase } from 'expo-sqlite';
import { BeatsOutletData } from '@/constants/BeatsOutlet';
import { SegmentBrandData } from '@/constants/SegmentBrand';

// Increment SCHEMA_VERSION when adding/changing tables.
// Increment SEED_VERSION when reference data in constants changes.
const SCHEMA_VERSION = 1;
const SEED_VERSION = 2;

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await applySchema(db);
  await applySeed(db);
}

async function applySchema(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const applied = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM migrations WHERE version = ?',
    [SCHEMA_VERSION]
  );
  if (applied) return;

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS beats (
      beat_id   TEXT PRIMARY KEY,
      beat_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS outlets (
      outlet_id   TEXT PRIMARY KEY,
      outlet_name TEXT NOT NULL,
      beat_id     TEXT NOT NULL,
      FOREIGN KEY (beat_id) REFERENCES beats(beat_id)
    );

    CREATE TABLE IF NOT EXISTS segments (
      segment_id   TEXT PRIMARY KEY,
      segment_name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS brands (
      brand_id   TEXT PRIMARY KEY,
      brand_name TEXT NOT NULL,
      segment_id TEXT NOT NULL,
      FOREIGN KEY (segment_id) REFERENCES segments(segment_id)
    );

    CREATE TABLE IF NOT EXISTS skus (
      sku_key  TEXT NOT NULL,
      brand_id TEXT NOT NULL,
      PRIMARY KEY (sku_key, brand_id),
      FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      beat_id     TEXT NOT NULL,
      beat_name   TEXT NOT NULL,
      outlet_id   TEXT NOT NULL,
      outlet_name TEXT NOT NULL,
      created_at  TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'draft'
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id     INTEGER NOT NULL,
      segment_id   TEXT NOT NULL,
      segment_name TEXT NOT NULL,
      brand_id     TEXT NOT NULL,
      brand_name   TEXT NOT NULL,
      sku_key      TEXT NOT NULL,
      quantity     TEXT NOT NULL,
      type         TEXT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    );
  `);

  await db.runAsync(
    'INSERT INTO migrations (version, applied_at) VALUES (?, ?)',
    [SCHEMA_VERSION, new Date().toISOString()]
  );
}

async function applySeed(db: SQLiteDatabase): Promise<void> {
  const applied = await db.getFirstAsync<{ version: number }>(
    'SELECT version FROM migrations WHERE version = ?',
    [SEED_VERSION]
  );
  if (applied) return;

  await db.withTransactionAsync(async () => {
    for (const beat of BeatsOutletData) {
      await db.runAsync(
        'INSERT OR IGNORE INTO beats (beat_id, beat_name) VALUES (?, ?)',
        [beat.beatId, beat.beatName]
      );
      for (const outlet of beat.outlets) {
        await db.runAsync(
          'INSERT OR IGNORE INTO outlets (outlet_id, outlet_name, beat_id) VALUES (?, ?, ?)',
          [outlet.outletId, outlet.outletName, beat.beatId]
        );
      }
    }

    for (const segment of SegmentBrandData) {
      await db.runAsync(
        'INSERT OR IGNORE INTO segments (segment_id, segment_name) VALUES (?, ?)',
        [segment.segmentId, segment.segmentName]
      );
      for (const brand of segment.brands) {
        await db.runAsync(
          'INSERT OR IGNORE INTO brands (brand_id, brand_name, segment_id) VALUES (?, ?, ?)',
          [brand.id, brand.name, segment.segmentId]
        );
        for (const sku of brand.skus) {
          await db.runAsync(
            'INSERT OR IGNORE INTO skus (sku_key, brand_id) VALUES (?, ?)',
            [sku, brand.id]
          );
        }
      }
    }

    await db.runAsync(
      'INSERT INTO migrations (version, applied_at) VALUES (?, ?)',
      [SEED_VERSION, new Date().toISOString()]
    );
  });
}
