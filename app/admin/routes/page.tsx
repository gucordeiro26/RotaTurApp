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
  Loader2
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
  created_at: string
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
        .order('created_at', { ascending: false })

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
    return <div className="flex justify-center items-center h-screen">A carregar rotas...</div>
  }

  return (
    <RouteGuard allowedRoles={["admin"]}>
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <h1 className="text-xl font-semibold">Gerenciamento de Rotas</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Filtros */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
        </div>

        {/* Lista de Rotas */}
        <div className="space-y-3">
          {routes.filter(r => r.nome.toLowerCase().includes(searchTerm.toLowerCase())).map((route) => (
            <Card key={route.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Badge className={getStatusBadgeColor(route.status)}>
                            {route.status}
                        </Badge>
                        {route.dificuldade && <Badge variant="outline" className="text-xs">{route.dificuldade}</Badge>}
                    </div>
                    
                    <h3 className="font-medium text-lg truncate">{route.nome}</h3>
                    <p className="text-sm text-gray-600 mb-2">por {route.publicador?.nome_completo || 'Desconhecido'}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {route.duracao || 'N/A'}</span>
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-1"/> Ver Detalhes</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={processingId === route.id}>
                        {processingId === route.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/route-details/${route.id}`}>
                        <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> Ver Rota
                        </DropdownMenuItem>
                      </Link>
                      
                      <DropdownMenuSeparator />
                      
                      {route.status !== "Ativo" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, "Ativo")}>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Aprovar / Ativar
                          </DropdownMenuItem>
                      )}
                      
                      {route.status !== "Suspenso" && (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(route.id, "Suspenso")}>
                            <XCircle className="w-4 h-4 mr-2 text-red-600" /> Suspender
                          </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
          {routes.length === 0 && <p className="text-center text-gray-500 mt-8">Nenhuma rota encontrada.</p>}
        </div>
      </div>
    </div>
    </RouteGuard>
  )
}