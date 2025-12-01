"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RouteGuard } from "@/components/RouteGuard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, ArrowUpRight, LogOut, ImageOff, BarChart3 } from "lucide-react"
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
    { title: "Total de Rotas", value: "0", icon: Route, color: "text-blue-600", bg: "bg-blue-100/60", href: "/admin/routes" },
    { title: "Usuários Ativos", value: "0", icon: Users, color: "text-green-600", bg: "bg-green-100/60", href: "/admin/users" },
    { title: "Aprovações", value: "0", icon: Shield, color: "text-orange-600", bg: "bg-orange-100/60", href: "/admin/routes" },
  ])

  const [recentRoutes, setRecentRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)

  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  const handleLogout = async () => {
    const confirm = window.confirm("Tem certeza que deseja sair?");
    if (confirm) {
      await supabase.auth.signOut();
      router.push('/');
    }
  }

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
          { title: "Total de Rotas", value: String(rotasCount ?? 0), icon: Route, color: "text-blue-600", bg: "bg-blue-100/60", href: "/admin/routes" },
          { title: "Usuários Ativos", value: String(usersCount ?? 0), icon: Users, color: "text-green-600", bg: "bg-green-100/60", href: "/admin/users" },
          { title: "Aprovações", value: String(pendingRoutesCount ?? 0), icon: Shield, color: "text-orange-600", bg: "bg-orange-100/60", href: "/admin/routes" },
        ])

        const { data: recentRoutesData } = await supabase
          .from("rotas")
          .select(`
            id,
            nome,
            status,
            imagem_url,
            publisher:publicador_id ( nome_completo )
          `)
          .order("criado_em", { ascending: false })
          .limit(5)

        if (recentRoutesData) {
          const formattedRoutes = recentRoutesData.map((route: any): RouteType => ({
            id: route.id,
            nome: route.nome,
            publisher: route.publisher || { nome_completo: "Desconhecido" },
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
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 w-full">

        {/* HEADER */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-20">
          <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Painel Admin</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-6 pb-24 max-w-7xl mx-auto">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Link href={stat.href} key={index}>
                <Card className="rounded-xl shadow-sm hover:shadow-lg border-none transition-all bg-white hover:-translate-y-[2px]">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                      <stat.icon className={`w-7 h-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* RECENT ROUTES */}
          <Card className="rounded-xl border-none shadow-sm">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Rotas Recentes</CardTitle>
                  <CardDescription className="text-gray-500">Últimas atualizações</CardDescription>
                </div>
                <Link href="/admin/routes">
                  <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {recentRoutes.length > 0 ? (
                <div className="divide-y">
                  {recentRoutes.map((route) => (
                    <div
                      key={route.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-14 w-14 bg-gray-100 rounded-lg overflow-hidden">
                          {route.imagem_url ? (
                            <img src={route.imagem_url} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-300">
                              <ImageOff className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">{route.nome}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                            <Users className="w-3 h-3" /> por {route.publisher?.nome_completo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <Badge
                          variant={route.status === "Ativo" ? "default" : "secondary"}
                          className="capitalize px-2 py-1 text-[10px]"
                        >
                          {route.status}
                        </Badge>

                        <Link href={`/route-details/${route.id}`}>
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">Nenhuma rota encontrada.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* MOBILE BOTTOM NAV */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
          <div className="flex justify-around items-center h-16">
            {mobileLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center text-xs font-medium",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                >
                  <link.icon className="w-6 h-6" />
                  {link.label}
                </Link>
              )
            })}

            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-xs font-medium text-red-500"
            >
              <LogOut className="w-6 h-6" />
              Sair
            </button>
          </div>
        </div>

      </div>
    </RouteGuard>
  )
}