import { Stack } from 'expo-router';
import { useState } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { FinalOrderContext, SubmittedOrder } from '@/contexts/FinalOrderContext';
import { initializeDatabase } from '@/db/database';

export default function RootLayout() {
  const [finalOrderData, setFinalOrderData] = useState<SubmittedOrder | null>(null);

  return (
    <SQLiteProvider databaseName="disthub.db" onInit={initializeDatabase}>
      <FinalOrderContext.Provider value={{ finalOrderData, setFinalOrderData }}>
        <Stack screenOptions={{ headerShown: false }} />
      </FinalOrderContext.Provider>
    </SQLiteProvider>
  );
}
