"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

type RouteGuardProps = {
  children: React.ReactNode
  allowedRoles: string[]
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          router.replace('/')
          return
        }

        const { data: profileData, error: profileError } = await supabase
          .from('perfis')
          .select('tipo_perfil')
          .eq('id', session.user.id)
          .single()

        if (profileError || !profileData) {
          router.replace('/')
          return
        }

        // Verifica se o tipo de perfil do usuário está na lista de perfis permitidos
        if (!allowedRoles.includes(profileData.tipo_perfil)) {
          // Se não estiver, redireciona para a página apropriada baseado no tipo de perfil
          if (profileData.tipo_perfil === 'admin') {
            router.replace('/admin/dashboard')
          } else if (profileData.tipo_perfil === 'publicador') {
            router.replace('/publisher/dashboard')
          } else {
            router.replace('/user/dashboard')
          }
          return
        }

        setIsLoading(false)
      } catch (error) {
        router.replace('/')
      }
    }

    checkAuth()
  }, [router, allowedRoles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando suas credenciais...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}