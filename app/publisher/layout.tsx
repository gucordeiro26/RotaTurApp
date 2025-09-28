"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { Skeleton } from '@/components/ui/skeleton'

export default function PublisherAuthLayout({ children }: { children: ReactNode }) {
  const { user, profile, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redireciona se não estiver logado OU se o perfil não for 'publicador'
      if (!user || profile?.tipo_perfil !== 'publicador') {
        router.push('/')
      }
    }
  }, [user, profile, isLoading, router])

  // Tela de carregamento
  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verificando permissões...</p>
      </div>
    )
  }

  // Se o usuário for um publicador, mostra o conteúdo
  if (user && profile.tipo_perfil === 'publicador') {
    return <>{children}</>
  }

  return null
}