"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface RouteType {
  id: number
  nome: string
  status: string
  publisher: {
    nome_completo: string
  } | null
}

export default function AdminDashboard() {
  // --- MUDANÇA 1: Adicionado 'href' ao estado inicial ---
  const [stats, setStats] = useState([
    { title: "Total de Rotas", value: "0", icon: Route, color: "bg-blue-500", href: "/admin/routes" },
    { title: "Usuários", value: "0", icon: Users, color: "bg-green-500", href: "/admin/users" },
    { title: "Aprovações", value: "0", icon: Shield, color: "bg-orange-500", href: "/admin/routes" },
  ])
  const [recentRoutes, setRecentRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const { count: rotasCount } = await supabase.from("rotas").select("*", { count: "exact", head: true })
        const { count: usersCount } = await supabase.from("perfis").select("*", { count: "exact", head: true })
        const { count: pendingRoutesCount } = await supabase
          .from("rotas")
          .select("*", { count: "exact", head: true })
          .eq("status", "Rascunho")

        // --- MUDANÇA 2: Adicionado 'href' na atualização dos dados ---
        setStats([
          { title: "Total de Rotas", value: String(rotasCount ?? 0), icon: Route, color: "bg-blue-500", href: "/admin/routes" },
          { title: "Usuários", value: String(usersCount ?? 0), icon: Users, color: "bg-green-500", href: "/admin/users" },
          // Aprovações também leva para a tela de rotas, onde se faz a aprovação
          { title: "Aprovações", value: String(pendingRoutesCount ?? 0), icon: Shield, color: "bg-orange-500", href: "/admin/routes" },
        ])

        const { data: recentRoutesData } = await supabase
          .from("rotas")
          .select(`
            id,
            nome,
            status,
            publisher:publicador_id ( nome_completo )
          `)
          .order("criado_em", { ascending: false })
          .limit(5)

        if (recentRoutesData) {
          const formattedRoutes = recentRoutesData.map((route: any): RouteType => ({
            id: route.id,
            nome: route.nome,
            status: route.status,
            publisher: route.publisher,
          }))
          setRecentRoutes(formattedRoutes)
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div className="p-4 sm:p-8 space-y-4"><Skeleton className="h-12 w-48 mb-4" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50/50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-6 w-full max-w-7xl mx-auto">

          {/* Stats Grid - Agora são Links clicáveis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              // --- MUDANÇA 3: Envolvendo o Card com Link ---
              <Link href={stat.href} key={index} className="block">
                <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-gray-50/50 group">
                  <CardContent className="p-5 flex items-center space-x-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Routes */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Rotas Recentes</CardTitle>
                  <CardDescription>Últimas atualizações na plataforma</CardDescription>
                </div>
                {/* Botão "Ver Todas" mantido apenas para desktop como atalho extra */}
                <Link href="/admin/routes">
                  <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 p-0 sm:p-6">
              {recentRoutes.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentRoutes.map((route) => (
                    <div key={route.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{route.nome}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                          <Users className="w-3 h-3" /> por {route.publisher?.nome_completo || "Desconhecido"}
                        </p>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                        <Badge variant={route.status === "Ativo" ? "default" : "secondary"} className="capitalize px-3 py-1">
                          {route.status}
                        </Badge>
                        <Link href={`/admin/routes`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Nenhuma rota recente encontrada.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </RouteGuard>
  )
}