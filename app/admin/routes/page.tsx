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
  Filter,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  Loader2,
  BarChart3,
  Route,
  Users,
  UserCircle,
  ImageOff,
  Clock,
  LogOut
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  imagem_url: string | null // Adicionado
}

export default function RouteManagement() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
    if (status === 'Ativo') return 'bg-green-100 text-green-800 border-green-200'
    if (status === 'Suspenso') return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || route.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">A carregar rotas...</div>

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50/50">
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center space-x-3 max-w-7xl mx-auto w-full">
            <Link href="/admin/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button></Link>
            <h1 className="text-lg font-bold text-gray-900">Gerir Rotas</h1>
          </div>
        </div>

        <div className="p-4 space-y-6 pb-24 max-w-7xl mx-auto w-full">

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar rota por nome..."
                className="pl-10 border-none bg-gray-50 focus-visible:ring-0"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px] border-none bg-gray-50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Ativo">Ativos</SelectItem>
                <SelectItem value="Rascunho">Rascunhos</SelectItem>
                <SelectItem value="Suspenso">Suspensos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Cards Bonita */}
          <div className="grid gap-4">
            {filteredRoutes.map(route => (
              <Card key={route.id} className="border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                <div className="flex flex-col sm:flex-row">

                  {/* Imagem da Rota */}
                  <div className="w-full sm:w-48 h-32 sm:h-auto bg-gray-100 relative shrink-0">
                    {route.imagem_url ? (
                      <img src={route.imagem_url} alt={route.nome} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageOff className="w-8 h-8" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 sm:hidden">
                      <Badge variant="outline" className={cn("backdrop-blur-md bg-white/80", getStatusBadgeColor(route.status))}>{route.status}</Badge>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-blue-600 transition-colors">{route.nome}</h3>
                          <Badge variant="outline" className={cn("hidden sm:inline-flex", getStatusBadgeColor(route.status))}>{route.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Publicado por <span className="font-medium text-gray-700">{route.publicador?.nome_completo}</span></p>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <Badge variant="secondary" className="text-[10px] font-normal">{route.dificuldade}</Badge>
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {route.duracao || 'N/A'}</span>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2" disabled={processingId === route.id}>
                            {processingId === route.id ? <Loader2 className="animate-spin w-4 h-4" /> : <MoreVertical className="w-4 h-4 text-gray-500" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/route-details/${route.id}`}><DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Ver Detalhes</DropdownMenuItem></Link>
                          <DropdownMenuSeparator />
                          {route.status !== 'Ativo' && <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, 'Ativo')}><CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Aprovar</DropdownMenuItem>}
                          {route.status !== 'Suspenso' && <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, 'Suspenso')}><XCircle className="w-4 h-4 mr-2 text-red-600" /> Suspender</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                      <span>Criado em {new Date(route.criado_em).toLocaleDateString('pt-BR')}</span>
                      <Link href={`/route-details/${route.id}`} className="sm:hidden text-blue-600 font-medium">Ver Rota</Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {filteredRoutes.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <MapPin className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhuma rota encontrada.</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
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
            <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-red-500 hover:text-red-600">
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}