"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, ScanSearch, ShieldCheck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { AuthDialog } from "@/components/auth-dialog"

type Mode = "login" | "signup"

export function SiteNavbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [dialog, setDialog] = useState<{ open: boolean; mode: Mode }>({ open: false, mode: "login" })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [menuOpen])

  const openDialog = (mode: Mode) => setDialog({ open: true, mode })

  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : ""

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-base font-semibold tracking-tight">DocuSure AI</span>
            </Link>

            {user && (
              <nav className="hidden items-center gap-1 sm:flex">
                <NavLink href="/" active={pathname === "/"} icon={<ScanSearch className="size-4" />}>
                  Verify
                </NavLink>
                <NavLink
                  href="/dashboard"
                  active={pathname === "/dashboard"}
                  icon={<LayoutDashboard className="size-4" />}
                >
                  Dashboard
                </NavLink>
              </nav>
            )}
          </div>

          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="h-9 px-3 text-sm" onClick={() => openDialog("login")}>
                Login
              </Button>
              <Button className="h-9 px-4 text-sm" onClick={() => openDialog("signup")}>
                Signup
              </Button>
            </div>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-label="Open profile menu"
                className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-primary/30 transition-colors hover:bg-primary/25"
              >
                {initials || <User className="size-4" />}
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="glass animate-fade-up absolute right-0 mt-2 w-64 rounded-xl p-2 shadow-2xl"
                >
                  <div className="flex items-center gap-3 rounded-lg p-2">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary ring-1 ring-primary/30">
                      {initials || <User className="size-4" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="my-1.5 h-px bg-white/10" />
                  <Link
                    role="menuitem"
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/10 sm:hidden"
                  >
                    <LayoutDashboard className="size-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                  <button
                    role="menuitem"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-foreground transition-colors hover:bg-white/10"
                  >
                    <LogOut className="size-4 text-muted-foreground" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <AuthDialog
        open={dialog.open}
        mode={dialog.mode}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
        onSwitchMode={(mode) => setDialog({ open: true, mode })}
      />
    </>
  )
}

function NavLink({
  href,
  active,
  icon,
  children,
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </Link>
  )
}
