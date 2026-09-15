"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

export interface AppUser {
  id: string
  name: string
  email: string
}

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  login: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>
  signup: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function convertUser(user: SupabaseUser): AppUser {
  return {
    id: user.id,
    name:
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User",
    email: user.email || "",
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (mounted) {
        setUser(user ? convertUser(user) : null)
        setLoading(false)
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? convertUser(session.user) : null)
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error: error?.message || null }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    return { error: error?.message || null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }

  return ctx
}