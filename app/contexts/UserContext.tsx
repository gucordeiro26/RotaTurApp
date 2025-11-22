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
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData, error } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) {
          console.error("Erro ao buscar perfil:", error)
        } else {
          setProfile(profileData)
        }
      }
      setIsLoading(false)
    }

    getSessionAndProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const { data: profileData } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', session.user.id)
            .single()
          setProfile(profileData)
        } else {
          setProfile(null)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const value = { session, user, profile, isLoading }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}