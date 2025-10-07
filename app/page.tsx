"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from './contexts/UserContext'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  const { user, profile, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && profile) {
      const userRole = profile.tipo_perfil
      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else if (userRole === "publicador") {
        router.push("/publisher/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    }
  }, [user, profile, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    )
  }

  // Se não houver usuário, mostra o formulário de login
  if (!user) {
    return <LoginForm />
  }

  // Estado intermediário enquanto o redirecionamento acontece
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <p className="text-lg">Redirecionando...</p>
    </div>
  )
}