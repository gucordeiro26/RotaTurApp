"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Edit,
  Star,
  MapPin,
  Calendar,
  Heart,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Camera,
  Award,
  Compass,
  Bookmark,
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Tipo para as estatísticas do usuário
type UserStats = {
  totalPlanos: number
  rotasFavoritas: number
  // Poderíamos adicionar mais, como rotas completadas
}

export default function UserProfile() {
  const router = useRouter()
  const { user, profile, isLoading: isUserLoading } = useUser()
  const [stats, setStats] = useState<UserStats>({ totalPlanos: 0, rotasFavoritas: 0 })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return
      setIsLoadingStats(true)

      // Busca o total de planos (reservas)
      const { count: planosCount, error: planosError } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id)

      // Busca o total de rotas favoritas
      const { count: favoritosCount, error: favoritosError } = await supabase
        .from('favoritos')
        .select('*', { count: 'exact', head: true })
        .eq('usuario_id', user.id)
      
      if (planosError || favoritosError) {
        console.error("Erro ao buscar estatísticas:", planosError || favoritosError)
      } else {
        setStats({
          totalPlanos: planosCount || 0,
          rotasFavoritas: favoritosCount || 0,
        })
      }
      setIsLoadingStats(false)
    }

    fetchUserStats()
  }, [user])
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/') // Redireciona para o login após o logout
  }

  if (isUserLoading) {
    return <div className="p-4"><Skeleton className="w-full h-screen"/></div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-semibold">Meu Perfil</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.url_avatar || "/placeholder.svg?height=80&width=80"} />
                <AvatarFallback className="text-lg">{profile?.nome_completo?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{profile?.nome_completo}</h2>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              {isLoadingStats ? <Skeleton className="h-8 w-1/2 mx-auto"/> : <p className="text-2xl font-bold">{stats.totalPlanos}</p>}
              <p className="text-sm text-gray-600">Total de Planos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto text-red-600 mb-2" />
              {isLoadingStats ? <Skeleton className="h-8 w-1/2 mx-auto"/> : <p className="text-2xl font-bold">{stats.rotasFavoritas}</p>}
              <p className="text-sm text-gray-600">Rotas Favoritas</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Settings */}
        <Card>
            <CardHeader><CardTitle className="text-lg">Opções</CardTitle></CardHeader>
            <CardContent>
                <Link href="/user/favorites">
                    <div className="flex items-center space-x-3 py-3 border-b">
                        <Heart className="w-5 h-5 text-gray-600" />
                        <p className="font-medium text-sm">Rotas Favoritas</p>
                    </div>
                </Link>
                {/* Outras opções de configuração podem vir aqui */}
                <div className="border-t mt-4 pt-4">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="w-5 h-5 mr-3" />
                        Sair da Conta
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
            <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-gray-600"><Compass className="w-5 h-5" /><span className="text-xs mt-1">Explorar</span></Link>
            <Link href="/user/routes" className="flex flex-col items-center py-2 text-gray-600"><MapPin className="w-5 h-5" /><span className="text-xs mt-1">Rotas</span></Link>
            <Link href="/user/plans" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Meus Planos</span></Link>
            <Link href="/user/profile" className="flex flex-col items-center py-2 text-green-600"><Bookmark className="w-5 h-5" /><span className="text-xs mt-1">Perfil</span></Link>
        </div>
      </div>
    </div>
  )
}