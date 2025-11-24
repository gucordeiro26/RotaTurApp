"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, ArrowUpRight, Settings, BarChart3, LogOut } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface RouteType {
  id: number
  nome: string
  status: string
  publisher: {
    nome_completo: string
  } | null
}

export default function AdminDashboard() {
  const pathname = usePathname();
  const [stats, setStats] = useState([
    { title: "Total de Rotas", value: "0", icon: Route, color: "bg-blue-500", href: "/admin/routes" },
    { title: "Usuários Ativos", value: "0", icon: Users, color: "bg-green-500", href: "/admin/users" },
    { title: "Aprovações Pendentes", value: "0", icon: Shield, color: "bg-orange-500", href: "/admin/routes" },
  ])
  const [recentRoutes, setRecentRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)

  // Links para o Menu Inferior (Mobile)
  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

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

        setStats([
          { title: "Total de Rotas", value: String(rotasCount ?? 0), icon: Route, color: "bg-blue-500", href: "/admin/routes" },
          { title: "Usuários Ativos", value: String(usersCount ?? 0), icon: Users, color: "bg-green-500", href: "/admin/users" },
          { title: "Aprovações Pendentes", value: String(pendingRoutesCount ?? 0), icon: Shield, color: "bg-orange-500", href: "/admin/routes" },
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
            publisher: route.publisher || { nome_completo: 'Desconhecido' },
            status: route.status,
          }))
          setRecentRoutes(formattedRoutes)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
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
      <div className="min-h-screen sm:min-w-screen bg-gray-50/50">

        {/* Header Centralizado */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
            </div>
            {/* Botão Sair visível apenas no mobile se necessário, ou settings */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => supabase.auth.signOut()}>
              <LogOut className="w-5 h-5 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Conteúdo Principal Centralizado */}
        <div className="p-4 space-y-6 pb-24 max-w-7xl mx-auto w-full sm:min-w-100">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
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

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Rotas Recentes</CardTitle>
                  <CardDescription>Últimas atualizações na plataforma</CardDescription>
                </div>
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
                <p className="text-sm text-gray-500 text-center py-4">Nenhuma rota recente encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Menu Inferior (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
          <div className="flex justify-around items-center h-16">
            {mobileLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1",
                    isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <link.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </RouteGuard>
  )
}