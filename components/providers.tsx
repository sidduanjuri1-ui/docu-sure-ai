"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { HistoryProvider } from "@/components/history-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <HistoryProvider>{children}</HistoryProvider>
    </AuthProvider>
  )
}
