import { createContext } from 'react';

export type SubmittedOrder = {
  orderId: number;
  beatId: string;
  beatName: string;
  outletId: string;
  outletName: string;
  submittedAt: string;
};

type FinalOrderContextType = {
  finalOrderData: SubmittedOrder | null;
  setFinalOrderData: (order: SubmittedOrder) => void;
};

export const FinalOrderContext = createContext<FinalOrderContextType>({
  finalOrderData: null,
  setFinalOrderData: () => {},
});
