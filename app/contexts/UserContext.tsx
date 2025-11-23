"use client"

import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'

export type Profile = {
  nome_completo: string | null
  url_avatar: string | null
  tipo_perfil: string | null
}

type UserContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error("Erro ao buscar perfil:", error)
        setProfile(null)
      } else {
        setProfile(profileData)
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    let isMounted = true

    const getSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
      } catch (error) {
        console.error("Erro ao obter sessão:", error)
        if (isMounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    getSessionAndProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return
        
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            await fetchProfile(session.user.id)
          } catch (error) {
            console.error("Erro ao buscar perfil no listener:", error)
            if (isMounted) {
              setProfile(null)
            }
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = { session, user, profile, isLoading, refreshProfile }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}