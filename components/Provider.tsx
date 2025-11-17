"use client";

import { Provider as ReduxProvider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/lib/redux/store";
import { Toaster } from "@/components/ui/sonner";

const persistor = persistStore(store);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Toaster />
        {children}
      </PersistGate>
    </ReduxProvider>
  );
}