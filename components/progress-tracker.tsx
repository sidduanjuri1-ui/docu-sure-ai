import { Check, Loader2 } from "lucide-react"

export type Phase = "select" | "ready" | "analysing" | "done"
type StepState = "completed" | "active" | "pending"

const STEPS = ["Document Uploaded", "Analysing", "Result"] as const

function stepStates(phase: Phase): StepState[] {
  switch (phase) {
    case "select":
      return ["pending", "pending", "pending"]
    case "ready":
      return ["completed", "pending", "pending"]
    case "analysing":
      return ["completed", "active", "pending"]
    case "done":
      return ["completed", "completed", "active"]
  }
}

export function ProgressTracker({ phase }: { phase: Phase }) {
  const states = stepStates(phase)

  return (
    <ol className="flex items-center">
      {STEPS.map((label, i) => {
        const state = states[i]
        const isLast = i === STEPS.length - 1
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className={`flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                  state === "completed"
                    ? "border-primary bg-primary text-primary-foreground"
                    : state === "active"
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background/40 text-muted-foreground"
                }`}
              >
                {state === "completed" ? (
                  <Check className="size-4" />
                ) : state === "active" ? (
                  <Loader2 className="size-4 animate-spin-slow" />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`text-[0.7rem] font-medium sm:text-xs ${
                  state === "pending" ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div className="mx-2 h-0.5 flex-1 rounded-full bg-border sm:mx-3">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: states[i] === "completed" ? "100%" : "0%" }}
                />
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
