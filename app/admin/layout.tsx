"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, type Profile } from '@/app/contexts/UserContext'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Sidebar,
    SidebarProvider,
} from "@/components/ui/sidebar"

function FullScreenLoader() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="text-center">
                <p className="text-lg font-semibold">A carregar...</p>
                <p className="text-sm text-muted-foreground">A verificar as suas credenciais.</p>
            </div>
        </div>
    );
}

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
    return <FullScreenLoader />
  }

  // Se o usuário for um admin, mostra o conteúdo com sidebar
  if (user && profile.tipo_perfil === 'admin') {
    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <Sidebar userProfile={profile as Profile} />
                <main className="flex-1 overflow-y-auto bg-muted/40">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
  }

  return null
}