import { FileText } from "lucide-react"
import type { VerificationRecord } from "@/components/history-provider"
import { docTypeLabel, STATUS_STYLE } from "@/lib/verification"

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function HistoryList({ records }: { records: VerificationRecord[] }) {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Verification history</h2>
        <span className="text-xs text-muted-foreground">{records.length} total</span>
      </div>

      <ul className="space-y-2.5">
        {records.map((record) => {
          const style = STATUS_STYLE[record.result.status]
          return (
            <li
              key={record.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-background/30 p-3 sm:p-4"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground ring-1 ring-white/10">
                <FileText className="size-5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{record.fileName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {docTypeLabel(record.docType)} · {timeAgo(record.createdAt)}
                </p>
              </div>

              <div className="hidden w-28 shrink-0 sm:block">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Risk</span>
                  <span className="font-medium text-foreground">{record.result.riskScore}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${record.result.riskScore}%` }} />
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${style.text} ${style.bg} ${style.ring}`}
              >
                {record.result.status}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
