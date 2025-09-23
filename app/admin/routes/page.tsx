"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const routes = [
    {
      id: 1,
      name: "Caminhada pelo Centro Histórico",
      publisher: "Tours da Cidade",
      status: "Active",
      participants: 23,
      maxParticipants: 30,
      duration: "2 horas",
      price: "$25",
      difficulty: "Fácil",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 2,
      name: "Aventura na Trilha da Montanha",
      publisher: "Aventura Cia.",
      status: "Pending",
      participants: 15,
      maxParticipants: 20,
      duration: "4 horas",
      price: "$45",
      difficulty: "Difícil",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 3,
      name: "Rota Cênica Costeira",
      publisher: "Vista do Oceano",
      status: "Active",
      participants: 31,
      maxParticipants: 35,
      duration: "3 horas",
      price: "$35",
      difficulty: "Moderado",
      image: "/placeholder.svg?height=100&width=150",
    },
    {
      id: 4,
      name: "Tour Gastronômico Urbano",
      publisher: "Aventuras Gastronômicas",
      status: "Suspended",
      participants: 8,
      maxParticipants: 15,
      duration: "2.5 horas",
      price: "$55",
      difficulty: "Fácil",
      image: "/placeholder.svg?height=100&width=150",
    },
  ]

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
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
              <p className="text-lg font-bold text-blue-600">24</p>
              <p className="text-xs text-gray-600">Total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-green-600">18</p>
              <p className="text-xs text-gray-600">Ativo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-yellow-600">4</p>
              <p className="text-xs text-gray-600">Pendente</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-red-600">2</p>
              <p className="text-xs text-gray-600">Suspenso</p>
            </CardContent>
          </Card>
        </div>

        {/* Route List */}
        <div className="space-y-3">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <img
                    src={route.image || "/placeholder.svg"}
                    alt={route.name}
                    className="w-20 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm truncate">{route.name}</h3>
                        <p className="text-xs text-gray-600">por {route.publisher}</p>

                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={`text-xs ${getStatusBadgeColor(route.status)}`}>{route.status}</Badge>
                          <Badge className={`text-xs ${getDifficultyColor(route.difficulty)}`}>
                            {route.difficulty}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>
                              {route.participants}/{route.maxParticipants}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{route.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{route.price}</span>
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
