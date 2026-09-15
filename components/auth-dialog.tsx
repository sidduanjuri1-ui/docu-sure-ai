"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface AuthDialogProps {
  open: boolean
  onClose: () => void
  initialMode?: "login" | "signup"
}

export function AuthDialog({
  open,
  onClose,
  initialMode = "login",
}: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()

  if (!open) return null

  const isSignup = mode === "signup"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    const cleanEmail = email.trim()

    const response = isSignup
      ? await signup(
          name.trim() || cleanEmail.split("@")[0],
          cleanEmail,
          password,
        )
      : await login(cleanEmail, password)

    setLoading(false)

    if (response.error) {
      setError(response.error)
      return
    }

    setName("")
    setEmail("")
    setPassword("")
    onClose()
  }

  const switchMode = () => {
    setMode(isSignup ? "login" : "signup")
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {isSignup ? "Create account" : "Welcome back"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isSignup
                ? "Create your DocuSure AI account"
                : "Log in to continue to DocuSure AI"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-muted-foreground transition hover:text-foreground"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-white/30"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-white/30"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none transition focus:border-white/30"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full text-sm"
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </Button>
        </form>

        <div className="mt-5 text-center text-sm text-muted-foreground">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  )
}