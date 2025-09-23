"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Pause,
  Play,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function PublisherRoutes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("active")

  const activeRoutes = [
    {
      id: 1,
      name: "Caminhada pelo Centro Histórico",
      image: "/placeholder.svg?height=120&width=160",
      status: "Ativo",
      price: 25,
      duration: "2h",
      difficulty: "Fácil",
      totalBookings: 156,
      thisMonth: 23,
      revenue: 3900,
      rating: 4.8,
      reviews: 89,
      nextTour: "2024-01-25 14:00",
      capacity: "23/30",
      category: "História",
      createdAt: "2023-12-01",
    },
    {
      id: 2,
      name: "Trilha da Praia do Pôr do Sol",
      image: "/placeholder.svg?height=120&width=160",
      status: "Ativo",
      price: 35,
      duration: "3h",
      difficulty: "Moderado",
      totalBookings: 89,
      thisMonth: 15,
      revenue: 3115,
      rating: 4.9,
      reviews: 67,
      nextTour: "2024-01-26 16:00",
      capacity: "15/20",
      category: "Natureza",
      createdAt: "2023-11-15",
    },
    {
      id: 3,
      name: "Tour Gastronômico Local",
      image: "/placeholder.svg?height=120&width=160",
      status: "Pausado",
      price: 45,
      duration: "2.5h",
      difficulty: "Fácil",
      totalBookings: 203,
      thisMonth: 0,
      revenue: 9135,
      rating: 4.7,
      reviews: 156,
      nextTour: "Pausado",
      capacity: "0/15",
      category: "Gastronomia",
      createdAt: "2023-10-20",
    },
  ]

  const draftRoutes = [
    {
      id: 4,
      name: "Aventura na Montanha",
      image: "/placeholder.svg?height=120&width=160",
      status: "Rascunho",
      price: 55,
      duration: "4h",
      difficulty: "Difícil",
      totalBookings: 0,
      thisMonth: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      nextTour: "Não publicado",
      capacity: "0/12",
      category: "Aventura",
      createdAt: "2024-01-15",
      completionPercentage: 75,
    },
    {
      id: 5,
      name: "Tour Fotográfico Noturno",
      image: "/placeholder.svg?height=120&width=160",
      status: "Rascunho",
      price: 40,
      duration: "3h",
      difficulty: "Moderado",
      totalBookings: 0,
      thisMonth: 0,
      revenue: 0,
      rating: 0,
      reviews: 0,
      nextTour: "Não publicado",
      capacity: "0/15",
      category: "Fotografia",
      createdAt: "2024-01-20",
      completionPercentage: 45,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      case "Pausado":
        return "bg-yellow-100 text-yellow-800"
      case "Rascunho":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty) => {
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

  const RouteCard = ({ route, isDraft = false }) => (
    <Card className="overflow-hidden">
      <div className="flex">
        <div className="relative w-32 h-24 flex-shrink-0">
          <img src={route.image || "/placeholder.svg"} alt={route.name} className="w-full h-full object-cover" />
          {isDraft && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">{route.completionPercentage}%</span>
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 pr-2">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1">{route.name}</h3>
              <div className="flex items-center space-x-2 mb-1">
                <Badge className={`text-xs ${getStatusColor(route.status)}`}>{route.status}</Badge>
                <Badge className={`text-xs ${getDifficultyColor(route.difficulty)}`}>{route.difficulty}</Badge>
              </div>
              <p className="text-xs text-gray-500">Criado em {new Date(route.createdAt).toLocaleDateString("pt-BR")}</p>
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
                  Editar
                </DropdownMenuItem>
                {route.status === "Ativo" && (
                  <DropdownMenuItem>
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </DropdownMenuItem>
                )}
                {route.status === "Pausado" && (
                  <DropdownMenuItem>
                    <Play className="w-4 h-4 mr-2" />
                    Reativar
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Análises
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!isDraft ? (
            <>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{route.rating}</span>
                  <span>({route.reviews})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>R$ {route.price}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-500">Total de reservas:</span>
                  <span className="font-medium ml-1">{route.totalBookings}</span>
                </div>
                <div>
                  <span className="text-gray-500">Este mês:</span>
                  <span className="font-medium ml-1">{route.thisMonth}</span>
                </div>
                <div>
                  <span className="text-gray-500">Receita total:</span>
                  <span className="font-medium ml-1 text-green-600">R$ {route.revenue}</span>
                </div>
                <div>
                  <span className="text-gray-500">Próximo tour:</span>
                  <span className="font-medium ml-1">{route.nextTour}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs">
                  <Users className="w-3 h-3" />
                  <span>{route.capacity}</span>
                </div>
                <div className="flex space-x-1">
                  <Link href={`/publisher/routes/${route.id}/bookings`}>
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      Reservas
                    </Button>
                  </Link>
                  <Link href={`/publisher/routes/${route.id}/edit`}>
                    <Button size="sm" className="h-6 text-xs">
                      Editar
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progresso</span>
                  <span className="font-medium">{route.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${route.completionPercentage}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3" />
                  <span>R$ {route.price}</span>
                </div>
              </div>

              <div className="flex space-x-1">
                <Link href={`/publisher/routes/${route.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-6 text-xs">
                    Continuar Edição
                  </Button>
                </Link>
                <Button size="sm" className="flex-1 h-6 text-xs">
                  Publicar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/publisher/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Minhas Rotas</h1>
            </div>
            <Link href="/publisher/routes/create">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Rota
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar minhas rotas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-blue-600">{activeRoutes.length + draftRoutes.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-green-600">
                  {activeRoutes.filter((r) => r.status === "Ativo").length}
                </p>
                <p className="text-xs text-gray-600">Ativas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-yellow-600">
                  {activeRoutes.filter((r) => r.status === "Pausado").length}
                </p>
                <p className="text-xs text-gray-600">Pausadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-gray-600">{draftRoutes.length}</p>
                <p className="text-xs text-gray-600">Rascunhos</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Publicadas ({activeRoutes.length})</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos ({draftRoutes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="space-y-4">
              {activeRoutes.map((route) => (
                <RouteCard key={route.id} route={route} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
            {draftRoutes.length > 0 ? (
              <div className="space-y-4">
                {draftRoutes.map((route) => (
                  <RouteCard key={route.id} route={route} isDraft={true} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Edit className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhum rascunho</h3>
                  <p className="text-sm text-gray-600 mb-4">Comece criando uma nova rota turística!</p>
                  <Link href="/publisher/routes/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Nova Rota
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-gray-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-green-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Minhas Rotas</span>
          </Link>
          <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Reservas</span>
          </Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Mensagens</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
