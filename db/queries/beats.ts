import { type SQLiteDatabase } from 'expo-sqlite';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';

type BeatRow = { beat_id: string; beat_name: string };
type OutletRow = { outlet_id: string; outlet_name: string };

export async function getBeats(db: SQLiteDatabase): Promise<BeatsOutletSegmentInterface[]> {
  const rows = await db.getAllAsync<BeatRow>(
    'SELECT beat_id, beat_name FROM beats ORDER BY beat_name'
  );
  return rows.map((r) => ({ id: r.beat_id, name: r.beat_name }));
}

export async function getOutletsByBeat(
  db: SQLiteDatabase,
  beatId: string
): Promise<BeatsOutletSegmentInterface[]> {
  const rows = await db.getAllAsync<OutletRow>(
    'SELECT outlet_id, outlet_name FROM outlets WHERE beat_id = ? ORDER BY outlet_name',
    [beatId]
  );
  return rows.map((r) => ({ id: r.outlet_id, name: r.outlet_name }));
}
