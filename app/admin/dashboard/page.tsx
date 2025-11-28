"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, ArrowUpRight, Settings, BarChart3, LogOut, UserCircle, ImageOff } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useRouter, usePathname } from "next/navigation"

interface RouteType {
  id: number
  nome: string
  status: string
  publisher: {
    nome_completo: string
  } | null
  imagem_url: string | null
}

export default function AdminDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const [stats, setStats] = useState([
    { title: "Total de Rotas", value: "0", icon: Route, color: "text-blue-600", bg: "bg-blue-100", href: "/admin/routes" },
    { title: "Usuários Ativos", value: "0", icon: Users, color: "text-green-600", bg: "bg-green-100", href: "/admin/users" },
    { title: "Aprovações", value: "0", icon: Shield, color: "text-orange-600", bg: "bg-orange-100", href: "/admin/routes" },
  ])

  const [recentRoutes, setRecentRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)

  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
          { title: "Total de Rotas", value: String(rotasCount ?? 0), icon: Route, color: "text-blue-600", bg: "bg-blue-100", href: "/admin/routes" },
          { title: "Usuários Ativos", value: String(usersCount ?? 0), icon: Users, color: "text-green-600", bg: "bg-green-100", href: "/admin/users" },
          { title: "Aprovações", value: String(pendingRoutesCount ?? 0), icon: Shield, color: "text-orange-600", bg: "bg-orange-100", href: "/admin/routes" },
        ])

        const { data: recentRoutesData } = await supabase
          .from("rotas")
          .select(`
            id,
            nome,
            status,
            imagem_url,
            publisher:publicador_id (
              nome_completo
            )
          `)
          .order("criado_em", { ascending: false })
          .limit(5)

        if (recentRoutesData) {
          const formattedRoutes = recentRoutesData.map((route: any): RouteType => ({
            id: route.id,
            nome: route.nome,
            publisher: route.publisher || { nome_completo: 'Desconhecido' },
            status: route.status,
            imagem_url: route.imagem_url
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
    return <div className="p-4 space-y-4"><Skeleton className="h-12 w-full mb-4" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50/50 w-full">

        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10 w-full">
          <div className="px-4 py-4 flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
            </div>
            <Button variant="ghost" size="sm" className="hidden md:flex text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 space-y-6 pb-24 w-full max-w-7xl mx-auto">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {stats.map((stat, index) => (
              <Link href={stat.href} key={index} className="block w-full">
                <Card className="cursor-pointer border-none shadow-sm hover:shadow-md transition-all hover:bg-white/80 group bg-white">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm font-medium text-gray-500 truncate">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Routes */}
          <Card className="border-none shadow-sm w-full overflow-hidden bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Rotas Recentes</CardTitle>
                  <CardDescription>Últimas atualizações</CardDescription>
                </div>
                <Link href="/admin/routes">
                  <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-0 p-0 w-full">
              {recentRoutes.length > 0 ? (
                <div className="divide-y divide-gray-100 w-full">
                  {recentRoutes.map((route) => (
                    <div key={route.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-3 w-full">
                      <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                        <div className="h-12 w-12 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          {route.imagem_url ? (
                            <img src={route.imagem_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageOff className="w-4 h-4" /></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{route.nome}</h4>
                          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                            <Users className="w-3 h-3 shrink-0" /> por {route.publisher?.nome_completo || "Desconhecido"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-3 mt-1 sm:mt-0 pl-15 sm:pl-0">
                        <Badge variant={route.status === "Ativo" ? "default" : "secondary"} className="capitalize px-2 py-0.5 text-[10px] shrink-0">
                          {route.status}
                        </Badge>
                        {/* --- MUDANÇA AQUI: Link direto para os detalhes da rota --- */}
                        <Link href={`/route-details/${route.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 shrink-0">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">Nenhuma rota recente encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Menu Inferior (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 w-full">
          <div className="flex justify-around items-center h-16 w-full px-2">
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
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-red-500 hover:text-red-600"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] font-medium">Sair</span>
            </button>
          </div>
        </div>

      </div>
    </RouteGuard>
  )
}