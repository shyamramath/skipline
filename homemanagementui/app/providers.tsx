"use client";

import { AuthProvider } from "./context/AuthContext";
import PhoneSetupModal from "./components/PhoneSetupModal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <PhoneSetupModal />
    </AuthProvider>
  );
}
