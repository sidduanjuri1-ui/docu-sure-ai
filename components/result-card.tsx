import { AlertTriangle, CheckCircle2, ShieldQuestion, X } from "lucide-react"
import type { VerificationResult, VerificationStatus } from "@/lib/verification"

const STATUS_STYLES: Record<
  VerificationStatus,
  { text: string; ring: string; bg: string; bar: string; Icon: typeof CheckCircle2 }
> = {
  "Likely Valid": {
    text: "text-emerald-300",
    ring: "ring-emerald-400/30",
    bg: "bg-emerald-400/10",
    bar: "bg-emerald-400",
    Icon: CheckCircle2,
  },
  "Needs Review": {
    text: "text-amber-300",
    ring: "ring-amber-400/30",
    bg: "bg-amber-400/10",
    bar: "bg-amber-400",
    Icon: ShieldQuestion,
  },
  Suspicious: {
    text: "text-red-300",
    ring: "ring-red-400/30",
    bg: "bg-red-400/10",
    bar: "bg-red-400",
    Icon: AlertTriangle,
  },
}

export function ResultCard({ result }: { result: VerificationResult }) {
  const style = STATUS_STYLES[result.status]
  const { Icon } = style

  return (
    <div className="glass animate-fade-up rounded-2xl p-6 sm:p-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Risk Score</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight">
            {result.riskScore}
            <span className="text-lg text-muted-foreground"> / 100</span>
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-2 self-start rounded-full px-3.5 py-1.5 text-sm font-medium ring-1 ${style.text} ${style.bg} ${style.ring} sm:self-auto`}
        >
          <Icon className="size-4" />
          {result.status}
        </div>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${result.riskScore}%` }}
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Individual checks</p>
        <ul className="space-y-2.5">
          {result.checks.map((check) => (
            <li key={check.label} className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3">
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  check.passed ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
                }`}
              >
                {check.passed ? <CheckCircle2 className="size-3.5" /> : <X className="size-3.5" />}
              </span>
              <div>
                <p className="text-sm font-medium">{check.label}</p>
                <p className="text-xs text-muted-foreground">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
