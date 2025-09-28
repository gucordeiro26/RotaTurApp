"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminAuthLayout({ children }: { children: ReactNode }) {
  const { user, profile, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Redireciona se não estiver logado OU se o perfil não for 'admin'
      if (!user || profile?.tipo_perfil !== 'admin') {
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

  // Se o usuário for um admin, mostra o conteúdo
  if (user && profile.tipo_perfil === 'admin') {
    return <>{children}</>
  }

  return null
}