"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import type {
  DocumentType,
  VerificationResult,
} from "@/lib/verification"

import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

export interface VerificationRecord {
  id: string
  fileName: string
  docType: DocumentType
  result: VerificationResult
  createdAt: number
}

interface HistoryContextValue {
  records: VerificationRecord[]
  addRecord: (
    record: Omit<VerificationRecord, "id" | "createdAt">,
  ) => void
  clear: () => Promise<void>
  refresh: () => Promise<void>
}

const HistoryContext =
  createContext<HistoryContextValue | null>(null)

export function HistoryProvider({
  children,
}: {
  children: ReactNode
}) {
  const { user } = useAuth()
  const [records, setRecords] = useState<VerificationRecord[]>([])

  const refresh = async () => {
    if (!user) {
      setRecords([])
      return
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false })

    if (error) {
      console.error("Failed to load history:", error)
      return
    }

    const mapped: VerificationRecord[] = (data || []).map(
      (doc) => ({
        id: doc.id,
        fileName: doc.file_name,
        docType: doc.document_type as DocumentType,
        createdAt: new Date(doc.uploaded_at).getTime(),

        result: {
          riskScore: doc.risk_score ?? 0,

          status:
            doc.assessment === "likely_valid"
              ? "Likely Valid"
              : doc.assessment === "needs_review"
                ? "Needs Review"
                : "Suspicious",

          summary:
            "This is an AI-assisted assessment and is not a guarantee of authenticity.",

          checks: [],
        },
      }),
    )

    setRecords(mapped)
  }

  useEffect(() => {
    refresh()
  }, [user?.id])

  const addRecord = (
    record: Omit<VerificationRecord, "id" | "createdAt">,
  ) => {
    setRecords((prev) => [
      {
        ...record,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      },
      ...prev,
    ])
  }

  const clear = async () => {
    if (!user) return

    const { error } = await supabase
      .from("documents")
      .delete()
      .eq("user_id", user.id)

    if (error) {
      console.error("Failed to clear history:", error)
      return
    }

    setRecords([])
  }

  return (
    <HistoryContext.Provider
      value={{
        records,
        addRecord,
        clear,
        refresh,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const ctx = useContext(HistoryContext)

  if (!ctx) {
    throw new Error(
      "useHistory must be used within HistoryProvider",
    )
  }

  return ctx
}