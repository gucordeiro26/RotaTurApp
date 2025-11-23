"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, Plus, Edit, Trash2, BarChart3, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface RouteType {
  id: number
  nome: string
  publisher: {
    nome_completo: string
  }
  status: string
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    { title: "Total de Rotas", value: "0", icon: Route, color: "bg-blue-500" },
    { title: "Usuários Ativos", value: "0", icon: Users, color: "bg-green-500" },
    { title: "Aprovações Pendentes", value: "0", icon: Shield, color: "bg-orange-500" },
  ])
  const [recentRoutes, setRecentRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Buscar estatísticas (sem reservas)
        const { count: rotasCount } = await supabase.from("rotas").select("*", { count: "exact", head: true })
        const { count: usersCount } = await supabase.from("perfis").select("*", { count: "exact", head: true })
        const { count: pendingRoutesCount } = await supabase
          .from("rotas")
          .select("*", { count: "exact", head: true })
          .eq("status", "Rascunho")

        setStats([
          { title: "Total de Rotas", value: String(rotasCount ?? 0), icon: Route, color: "bg-blue-500" },
          { title: "Usuários Ativos", value: String(usersCount ?? 0), icon: Users, color: "bg-green-500" },
          {
            title: "Aprovações Pendentes",
            value: String(pendingRoutesCount ?? 0),
            icon: Shield,
            color: "bg-orange-500",
          },
        ])

        // Buscar rotas recentes
        const { data: recentRoutesData, error } = await supabase
          .from("rotas")
          .select(`
            id,
            nome,
            status,
            publicador:publicador_id (
              nome_completo
            )
          `)
          .order("criado_em", { ascending: false })
          .limit(3)

        if (error) throw error

        const formattedRoutes = recentRoutesData.map((route: any): RouteType => ({
          id: route.id,
          nome: route.nome,
          publisher: route.publicador || { nome_completo: 'Desconhecido' },
          status: route.status,
        }))

        setRecentRoutes(formattedRoutes)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="flex flex-col h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 flex-shrink-0">
        <div className="px-3 py-2 flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-base font-semibold truncate">Painel Admin</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-3 pb-20 w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-2">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold truncate">{stat.value}</p>
                    <p className="text-xs text-gray-600 truncate">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <Link href="/admin/routes/create" className="w-full">
                <Button className="w-full h-12 flex flex-col items-center justify-center space-y-0.5 text-xs">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs leading-tight">Criar Rota</span>
                </Button>
              </Link>
              <Link href="/admin/users" className="w-full">
                <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center space-y-0.5 text-xs">
                  <Users className="w-4 h-4" />
                  <span className="text-xs leading-tight">Utilizadores</span>
                </Button>
              </Link>
              <Link href="/admin/routes" className="w-full">
                <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center space-y-0.5 text-xs">
                  <Route className="w-4 h-4" />
                  <span className="text-xs leading-tight">Todas Rotas</span>
                </Button>
              </Link>
              <Link href="/admin/analytics" className="w-full">
                <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center space-y-0.5 text-xs">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-xs leading-tight">Análises</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Routes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">Rotas Recentes</CardTitle>
            <CardDescription className="text-xs">Últimas rotas turísticas</CardDescription>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {recentRoutes.length > 0 ? (
              recentRoutes.map((route) => (
                <div key={route.id} className="flex flex-col p-2 bg-gray-50 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-medium truncate flex-1">{route.nome}</h4>
                    <Badge className="text-xs py-0 px-1.5" variant={route.status === "Ativo" ? "default" : "secondary"}>{route.status}</Badge>
                  </div>
                  <p className="text-gray-600 truncate text-xs">por {route.publisher.nome_completo}</p>
                  <div className="flex space-x-1 pt-1">
                    <Link href={`/admin/routes/edit/${route.id}`}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-600">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-600" onClick={() => console.log("Delete route", route.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500 text-center py-2">Nenhuma rota recente.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t w-full md:hidden">
        <div className="grid grid-cols-4 py-2 w-full">
          <Link href="/admin/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/admin/routes" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
            <Route className="w-5 h-5" />
            <span className="text-xs mt-1">Rotas</span>
          </Link>
          <Link href="/admin/users" className="flex flex-col items-center py-2 text-gray-600 hover:text-green-600">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Usuários</span>
          </Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }} 
            className="flex flex-col items-center py-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs mt-1">Sair</span>
          </button>
        </div>
      </div>
    </div>
    </RouteGuard>
  )
}