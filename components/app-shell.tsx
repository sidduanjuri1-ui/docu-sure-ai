import type { ReactNode } from "react"
import { AnimatedBackground } from "@/components/animated-background"
import { SiteNavbar } from "@/components/site-navbar"
import { SiteFooter } from "@/components/site-footer"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div id="top" className="relative flex min-h-screen flex-col">
      <AnimatedBackground />
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
