"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, Plus, Edit, Trash2, BarChart3, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

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
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Painel Administrativo</h1>
          </div>
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/admin/routes/create" className="w-full">
                <Button className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                  <Plus className="w-5 h-5" />
                  <span className="text-sm">Criar Rota</span>
                </Button>
              </Link>
              <Link href="/admin/users" className="w-full">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Gerenciar Usuários</span>
                </Button>
              </Link>
              <Link href="/admin/routes" className="w-full">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                  <Route className="w-5 h-5" />
                  <span className="text-sm">Todas as Rotas</span>
                </Button>
              </Link>
              <Link href="/admin/analytics" className="w-full">
                <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-sm">Análises</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rotas Recentes</CardTitle>
            <CardDescription>Últimas rotas turísticas da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRoutes.length > 0 ? (
              recentRoutes.map((route) => (
                <div key={route.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{route.nome}</h4>
                    <p className="text-xs text-gray-600">por {route.publisher.nome_completo}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Badge className="w-full sm:w-auto text-center" variant={route.status === "Ativo" ? "default" : "secondary"}>{route.status}</Badge>
                    <div className="flex space-x-1 w-full sm:w-auto justify-end">
                      <Link href={`/admin/routes/edit/${route.id}`}>
                        <Button variant="ghost" size="sm" className="hover:text-green-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="hover:text-red-600" onClick={() => console.log("Delete route", route.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma rota recente encontrada.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
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