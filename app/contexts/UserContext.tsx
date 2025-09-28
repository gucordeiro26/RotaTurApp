// app/contexts/UserContext.tsx
"use client"

import { createContext, useState, useEffect, useContext, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'

// Definimos o tipo para os dados do perfil
type Profile = {
  nome_completo: string | null
  url_avatar: string | null
  tipo_perfil: string | null
}

// Definimos o tipo para o nosso contexto
type UserContextType = {
  user: User | null
  session: Session | null
  profile: Profile | null
  isLoading: boolean
}

// Criamos o Context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Criamos o Provedor do Contexto
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      // Pega a sessão ativa
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      // Se houver uma sessão, busca o perfil
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

    // Escuta por mudanças na autenticação (login/logout)
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

  const value = {
    session,
    user,
    profile,
    isLoading,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook customizado para usar o contexto mais facilmente
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}