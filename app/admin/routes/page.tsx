"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RouteGuard } from "@/components/RouteGuard"
import {
  ArrowLeft,
  Search,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  Loader2,
  BarChart3,
  Route,
  Users
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RouteData {
  id: number
  nome: string
  duracao: string
  dificuldade: string
  publicador: { nome_completo: string; url_avatar: string } | null
  status: string
  criado_em: string
}

export default function RouteManagement() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("")
  // --- NOVO ESTADO DE FILTRO ---
  const [statusFilter, setStatusFilter] = useState("all")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Links Mobile
  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  const fetchRoutes = async () => {
    try {
      const { data } = await supabase
        .from('rotas')
        .select('*, publicador:publicador_id(nome_completo, url_avatar)')
        .order('criado_em', { ascending: false })

      if (data) {
        setRoutes(data.map((r: any) => ({ ...r, publicador: r.publicador || { nome_completo: 'Desconhecido' } })))
      }
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRoutes() }, [])

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setProcessingId(id)
    await supabase.from('rotas').update({ status: newStatus }).eq('id', id)
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    setProcessingId(null)
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Ativo') return 'bg-green-100 text-green-800 hover:bg-green-200'
    if (status === 'Suspenso') return 'bg-red-100 text-red-800 hover:bg-red-200'
    return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  }

  // --- LÓGICA DE FILTRAGEM ATUALIZADA ---
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || route.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="p-8 text-center">A carregar rotas...</div>

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center space-x-3 max-w-7xl mx-auto w-full">
            <Link href="/admin/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <h1 className="text-lg font-bold text-gray-900">Gerir Rotas</h1>
          </div>
        </div>

        <div className="p-4 space-y-4 pb-24 max-w-7xl mx-auto w-full">
          {/* Área de Filtros Responsiva */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro de Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Rascunho">Rascunho</SelectItem>
                <SelectItem value="Suspenso">Suspenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredRoutes.map(route => (
              <Card key={route.id} className="border-none shadow-sm">
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getStatusBadgeColor(route.status)}>{route.status}</Badge>
                      <span className="text-sm font-bold truncate">{route.nome}</span>
                    </div>
                    <p className="text-xs text-gray-500">por {route.publicador?.nome_completo}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" disabled={processingId === route.id}>{processingId === route.id ? <Loader2 className="animate-spin w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}</Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/route-details/${route.id}`}><DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver Rota</DropdownMenuItem></Link>
                      <DropdownMenuSeparator />
                      {route.status !== 'Ativo' && <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, 'Ativo')}><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Aprovar</DropdownMenuItem>}
                      {route.status !== 'Suspenso' && <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, 'Suspenso')}><XCircle className="w-4 h-4 mr-2 text-red-600" /> Suspender</DropdownMenuItem>}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent></Card>
            ))}
            {filteredRoutes.length === 0 && <p className="text-center text-gray-500 mt-8">Nenhuma rota encontrada.</p>}
          </div>
        </div>

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