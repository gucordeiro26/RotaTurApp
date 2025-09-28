// app/user/layout.tsx
"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/contexts/UserContext'
import { Skeleton } from '@/components/ui/skeleton'

// Este é o nosso "Porteiro"
export default function UserAuthLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Se não estiver carregando e não houver usuário, redireciona para o login
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  // Enquanto a verificação está acontecendo, mostramos uma tela de carregamento simples
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="space-y-4 w-1/2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  // Se houver um usuário, mostramos o conteúdo da página
  if (user) {
    return <>{children}</>
  }

  // Caso contrário, não mostramos nada (ele já estará sendo redirecionado)
  return null
}