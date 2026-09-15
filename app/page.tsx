import { AppShell } from "@/components/app-shell"
import { VerificationFlow } from "@/components/verification-flow"

export default function Page() {
  return (
    <AppShell>
      <section className="mx-auto w-full max-w-2xl px-4 pt-16 pb-10 text-center sm:px-6 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted-foreground">
          AI-assisted document analysis
        </span>
        <h1 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          <span className="text-gradient">AI-Powered Document Verification</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Upload your document and let DocuSure AI analyze it for inconsistencies and suspicious indicators.
        </p>
      </section>

      <div className="px-4 pb-8 sm:px-6">
        <VerificationFlow />
      </div>
    </AppShell>
  )
}
