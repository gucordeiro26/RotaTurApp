"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  MapPin,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface RouteData {
  id: number
  nome: string
  descricao: string
  descricao_curta: string
  categoria: string
  duracao: string
  dificuldade: string
  maz_participantes: number
  preco: number
  publicador: {
    nome_completo: string
    url_avatar: string
  } | null
  status: string
  criado_em: string
  origem_coords: any
  destino_coords: any
  reservas_aggregate: {
    aggregate: {
      count: number
    }
  }
}

interface RouteStats {
  total: number
  active: number
  pending: number
  suspended: number
}

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [stats, setStats] = useState<RouteStats>({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data: routesData, error } = await supabase
          .from('rotas')
          .select(`
            *,
            publicador:publicador_id (
              nome_completo,
              url_avatar
            ),
            reservas (
              id
            )
          `)
          .order('criado_em', { ascending: false })

        if (error) throw error

        const formattedRoutes: RouteData[] = routesData.map(route => ({
          ...route,
          publicador: route.publicador || null,
          reservas_aggregate: {
            aggregate: {
              count: route.reservas?.length || 0
            }
          }
        }))
        
        setRoutes(formattedRoutes)

        // Calcular estatísticas
        const statsData = {
          total: routesData.length,
          active: routesData.filter(r => r.status === 'Ativo').length,
          pending: routesData.filter(r => r.status === 'Rascunho').length,
          suspended: routesData.filter(r => r.status === 'Suspenso').length
        }
        setStats(statsData)
      } catch (error) {
        console.error('Erro ao buscar rotas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Rascunho":
        return "bg-yellow-100 text-yellow-800"
      case "Suspenso":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case "Fácil":
        return "bg-green-100 text-green-800"
      case "Moderado":
        return "bg-yellow-100 text-yellow-800"
      case "Difícil":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Gerenciamento de Rotas</h1>
          </div>
          <Link href="/admin/routes/create">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Rota
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar rotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-blue-600">{stats.total}</p>
              <p className="text-xs text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-green-600">{stats.active}</p>
              <p className="text-xs text-gray-600">Ativo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-600">Pendente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-red-600">{stats.suspended}</p>
              <p className="text-xs text-gray-600">Suspenso</p>
            </CardContent>
          </Card>
        </div>

        {/* Route List */}
        <div className="space-y-3">
          {routes.filter(route => 
            route.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ).map((route) => (
            <Card key={route.id}>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <img
                    src={route.publicador?.url_avatar || "/placeholder-user.jpg"}
                    alt={route.nome}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm truncate">{route.nome}</h3>
                        <p className="text-xs text-gray-600">por {route.publicador?.nome_completo || 'Usuário Desconhecido'}</p>

                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`text-xs ${getStatusBadgeColor(route.status)}`}>{route.status}</Badge>
                          {route.dificuldade && (
                            <Badge className={`text-xs ${getDifficultyColor(route.dificuldade)}`}>
                              {route.dificuldade}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {route.reservas_aggregate.aggregate.count}/{route.maz_participantes || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{route.duracao || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>R$ {route.preco || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>Ver Mapa</span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Rota
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="w-4 h-4 mr-2" />
                            Gerenciar Reservas
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir Rota
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
