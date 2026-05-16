import { type SQLiteDatabase } from 'expo-sqlite';
import { BeatsOutletSegmentInterface } from '@/interface/BeatsOutletSegment';
import { Brand } from '@/interface/BrandSelectionScreen';

type SegmentRow = { segment_id: string; segment_name: string };
type BrandRow = { brand_id: string; brand_name: string };
type SkuRow = { sku_key: string };

export async function getSegments(db: SQLiteDatabase): Promise<BeatsOutletSegmentInterface[]> {
  const rows = await db.getAllAsync<SegmentRow>(
    'SELECT segment_id, segment_name FROM segments ORDER BY segment_name'
  );
  return rows.map((r) => ({ id: r.segment_id, name: r.segment_name }));
}

export async function getBrandsBySegment(
  db: SQLiteDatabase,
  segmentId: string
): Promise<Brand[]> {
  const brandRows = await db.getAllAsync<BrandRow>(
    'SELECT brand_id, brand_name FROM brands WHERE segment_id = ? ORDER BY brand_name',
    [segmentId]
  );

  return Promise.all(
    brandRows.map(async (b) => {
      const skuRows = await db.getAllAsync<SkuRow>(
        'SELECT sku_key FROM skus WHERE brand_id = ?',
        [b.brand_id]
      );
      return { id: b.brand_id, name: b.brand_name, skus: skuRows.map((s) => s.sku_key) };
    })
  );
}
