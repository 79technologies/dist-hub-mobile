import { type SQLiteDatabase } from 'expo-sqlite';
import { SegmentOrder, SelectedOrders } from '@/interface/Orders';

// segmentOrders is typed as SelectedOrders in the interface but holds { [brandId]: SelectedOrders }
// at runtime. This local alias makes the cast explicit in one place.
type BrandsOrdersList = { [brandId: string]: SelectedOrders };

type SaveOrderParams = {
  beatId: string;
  beatName: string;
  outletId: string;
  outletName: string;
  segmentOrderData: SegmentOrder[];
};

export async function saveOrder(
  db: SQLiteDatabase,
  params: SaveOrderParams
): Promise<number> {
  const { beatId, beatName, outletId, outletName, segmentOrderData } = params;
  let orderId = 0;

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
      `INSERT INTO orders (beat_id, beat_name, outlet_id, outlet_name, created_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [beatId, beatName, outletId, outletName, new Date().toISOString(), 'pending']
    );
    orderId = result.lastInsertRowId;

    for (const segment of segmentOrderData) {
      const brandOrders = segment.segmentOrders as unknown as BrandsOrdersList;
      for (const [brandId, skus] of Object.entries(brandOrders)) {
        const brand = await db.getFirstAsync<{ brand_name: string }>(
          'SELECT brand_name FROM brands WHERE brand_id = ?',
          [brandId]
        );
        for (const [skuKey, skuDetail] of Object.entries(skus)) {
          if (!skuDetail.checked || skuDetail.quantity === '0') continue;
          await db.runAsync(
            `INSERT INTO order_items
               (order_id, segment_id, segment_name, brand_id, brand_name, sku_key, quantity, type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              orderId,
              segment.segmentId,
              segment.segmentName,
              brandId,
              brand?.brand_name ?? brandId,
              skuKey,
              skuDetail.quantity,
              skuDetail.type,
            ]
          );
        }
      }
    }
  });

  return orderId;
}
