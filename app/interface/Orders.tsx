export interface SelectedOrderData {
  checked: boolean;
  type: '0' | '1';
  quantity: string;
}

export interface SelectedOrders {
  [key: string]: SelectedOrderData;
}

export interface SegmentOrder {
  segmentId : string,
  segmentName : string,
  segmentOrders: SelectedOrders;
}