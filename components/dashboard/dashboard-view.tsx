"use client"

import Link from "next/link"
import { FileSearch, Lock, ScanSearch, Trash2 } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { useHistory } from "@/components/history-provider"
import { StatCards } from "@/components/dashboard/stat-cards"
import { HistoryList } from "@/components/dashboard/history-list"

export function DashboardView() {
  const { user } = useAuth()
  const { records, clear } = useHistory()

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
          <Lock className="size-6" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Sign in to view your dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to track your verification history, risk trends, and flagged documents.
        </p>
        <Link href="/" className={cn(buttonVariants(), "mt-6 h-11 px-6")}>
          Back to verification
        </Link>
      </div>
    )
  }

  const firstName = user.name.split(" ")[0]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An overview of your document verifications this session.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <Button
              variant="ghost"
              className="h-10 px-3 text-sm text-muted-foreground hover:text-foreground"
              onClick={clear}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          )}
          <Link href="/" className={cn(buttonVariants(), "h-10 px-4 text-sm")}>
            <ScanSearch className="size-4" />
            New verification
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <StatCards records={records} />

        {records.length > 0 ? (
          <HistoryList records={records} />
        ) : (
          <div className="glass flex flex-col items-center rounded-2xl p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground ring-1 ring-white/10">
              <FileSearch className="size-6" />
            </span>
            <p className="mt-4 text-sm font-medium">No verifications yet</p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Run your first document verification to start building your history.
            </p>
            <Link href="/" className={cn(buttonVariants(), "mt-5 h-10 px-4 text-sm")}>
              <ScanSearch className="size-4" />
              Verify a document
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
