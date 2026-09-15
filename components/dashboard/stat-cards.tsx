import { AlertTriangle, CheckCircle2, FileStack, Gauge } from "lucide-react"
import type { VerificationRecord } from "@/components/history-provider"

export function StatCards({ records }: { records: VerificationRecord[] }) {
  const total = records.length
  const valid = records.filter((r) => r.result.status === "Likely Valid").length
  const flagged = records.filter((r) => r.result.status !== "Likely Valid").length
  const avgRisk =
    total === 0 ? 0 : Math.round(records.reduce((sum, r) => sum + r.result.riskScore, 0) / total)

  const stats = [
    { label: "Total verifications", value: total, Icon: FileStack, tone: "text-primary bg-primary/10 ring-primary/30" },
    {
      label: "Likely valid",
      value: valid,
      Icon: CheckCircle2,
      tone: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/30",
    },
    {
      label: "Flagged for review",
      value: flagged,
      Icon: AlertTriangle,
      tone: "text-amber-300 bg-amber-400/10 ring-amber-400/30",
    },
    {
      label: "Avg. risk score",
      value: `${avgRisk}`,
      Icon: Gauge,
      tone: "text-sky-300 bg-sky-400/10 ring-sky-400/30",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, tone }) => (
        <div key={label} className="glass rounded-2xl p-5">
          <span className={`flex size-9 items-center justify-center rounded-xl ring-1 ${tone}`}>
            <Icon className="size-5" />
          </span>
          <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  )
}
