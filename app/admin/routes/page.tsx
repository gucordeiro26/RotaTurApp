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
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  Loader2,
  Plus
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface RouteData {
  id: number
  nome: string
  duracao: string
  dificuldade: string
  publicador: {
    nome_completo: string
    url_avatar: string
  } | null
  status: string
  criado_em: string
}

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('rotas')
        .select(`
          *,
          publicador:publicador_id ( nome_completo, url_avatar )
        `)
        .order('criado_em', { ascending: false })

      if (error) throw error
      
      // Mapeamento seguro dos dados
      const formattedRoutes = (data || []).map((r: any) => ({
        ...r,
        publicador: r.publicador || null
      }))

      setRoutes(formattedRoutes)
    } catch (error) {
      console.error('Erro ao buscar rotas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para alterar o status da rota (Aprovar/Suspender)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setProcessingId(id)
    try {
        const { error } = await supabase
            .from('rotas')
            .update({ status: newStatus })
            .eq('id', id)

        if (error) throw error

        // Atualiza a lista localmente para feedback imediato
        setRoutes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
    } catch (error) {
        console.error("Erro ao atualizar status:", error)
        alert("Erro ao atualizar status da rota.")
    } finally {
        setProcessingId(null)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Rascunho": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "Suspenso": return "bg-red-100 text-red-800 hover:bg-red-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando rotas...</div>
  }

  const filteredRoutes = routes.filter(r => r.nome.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="flex flex-col h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 flex-shrink-0">
        <div className="px-3 py-2 flex items-center justify-between w-full">
          <h1 className="text-base font-semibold truncate">Gerir Rotas</h1>
          <div className="flex gap-2 flex-shrink-0">
            <Link href="/admin/routes/create">
              <Button size="sm" className="h-8 px-2 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">Nova</span>
              </Button>
            </Link>
            <Link href="/admin/dashboard" className="flex-shrink-0">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-20 w-full">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>

        {/* Routes List */}
        <div className="space-y-2">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="border-0 shadow-sm">
              <CardContent className="p-2">
                <div className="flex flex-col space-y-1">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{route.nome}</h3>
                      <p className="text-xs text-gray-600 truncate">{route.publicador?.nome_completo || 'Desconhecido'}</p>
                    </div>
                    <Badge className="flex-shrink-0 text-xs py-0 px-1.5" variant={route.status === "Ativo" ? "default" : "secondary"}>
                      {route.status}
                    </Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="flex gap-2 text-xs text-gray-500">
                    {route.duracao && <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{route.duracao}</span>}
                    {route.dificuldade && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{route.dificuldade}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 pt-1">
                    <Link href={`/route-details/${route.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-6 text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                    </Link>
                    
                    {route.status !== "Ativo" && (
                      <Button 
                        size="sm" 
                        disabled={processingId === route.id}
                        onClick={() => handleUpdateStatus(route.id, "Ativo")} 
                        className="h-6 text-xs flex-shrink-0"
                      >
                        {processingId === route.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                      </Button>
                    )}
                    
                    {route.status !== "Suspenso" && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        disabled={processingId === route.id}
                        onClick={() => handleUpdateStatus(route.id, "Suspenso")} 
                        className="h-6 text-xs flex-shrink-0"
                      >
                        {processingId === route.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredRoutes.length === 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Nenhuma rota encontrada.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </RouteGuard>
  )
}