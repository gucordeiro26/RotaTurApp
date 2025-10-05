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

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Começa a carregar por defeito

  useEffect(() => {
    // O onAuthStateChange é chamado uma vez no carregamento inicial com a sessão atual,
    // e depois novamente sempre que o estado de autenticação muda (login/logout).
    // Isto combina a verificação inicial e o "ouvinte" numa só função.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        
        // Se houver um utilizador, busca o seu perfil.
        // Se a sessão for nula (logout), define o perfil como nulo.
        if (currentUser) {
          const { data: profileData, error } = await supabase
            .from('perfis')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (error) {
            console.error("Erro ao buscar o perfil do utilizador:", error);
            setProfile(null); // Garante que o perfil fica nulo em caso de erro
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }

        // A primeira vez que isto corre, o carregamento inicial está completo.
        setIsLoading(false);
      }
    );

    // Função de limpeza para se desinscrever do "ouvinte"
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []); // O array de dependências vazio [] garante que isto só corre uma vez

  const value = { session, user, profile, isLoading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook personalizado para usar o contexto mais facilmente
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider')
  }
  return context
}