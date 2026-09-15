export function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Base vertical wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.24_0.05_265)_0%,transparent_60%)]" />

      {/* Slow-moving glowing gradient blobs */}
      <div className="animate-aurora absolute -top-1/3 left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.18_235/0.28)_0%,transparent_65%)] blur-3xl" />
      <div className="animate-aurora-slow absolute top-1/4 -left-1/4 h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,oklch(0.55_0.2_300/0.22)_0%,transparent_65%)] blur-3xl" />
      <div className="animate-aurora absolute bottom-[-20%] right-[-10%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,oklch(0.6_0.16_195/0.2)_0%,transparent_65%)] blur-3xl" />

      {/* Subtle drifting particle grid */}
      <div className="animate-drift absolute inset-0 opacity-[0.35] [background-image:radial-gradient(oklch(1_0_0/0.14)_1px,transparent_1px)] [background-size:44px_44px]" />

      {/* Vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,oklch(0.1_0.02_265/0.7)_100%)]" />
    </div>
  )
}
