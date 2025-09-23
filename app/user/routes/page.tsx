"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Star, Clock, Users, Heart, MapPin, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default function AllRoutes() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const routes = [
    {
      id: 1,
      name: "Caminhada pelo Centro Histórico",
      publisher: "Tours da Cidade",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.8,
      reviews: 156,
      price: 25,
      duration: "2h",
      difficulty: "Fácil",
      participants: "23/30",
      isBookmarked: false,
      category: "História",
      location: "Centro da Cidade",
    },
    {
      id: 2,
      name: "Trilha da Praia do Pôr do Sol",
      publisher: "Aventura Cia.",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.9,
      reviews: 89,
      price: 35,
      duration: "3h",
      difficulty: "Moderado",
      participants: "15/20",
      isBookmarked: true,
      category: "Natureza",
      location: "Costa Leste",
    },
    {
      id: 3,
      name: "Tour Gastronômico Local",
      publisher: "Sabores da Cidade",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.7,
      reviews: 203,
      price: 45,
      duration: "2.5h",
      difficulty: "Fácil",
      participants: "12/15",
      isBookmarked: false,
      category: "Gastronomia",
      location: "Bairro Gastronômico",
    },
    {
      id: 4,
      name: "Aventura na Montanha",
      publisher: "Trilhas Extremas",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.6,
      reviews: 78,
      price: 55,
      duration: "4h",
      difficulty: "Difícil",
      participants: "8/12",
      isBookmarked: false,
      category: "Aventura",
      location: "Serra da Mantiqueira",
    },
    {
      id: 5,
      name: "Passeio de Bike Urbano",
      publisher: "Bike Tours",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.5,
      reviews: 124,
      price: 30,
      duration: "2h",
      difficulty: "Fácil",
      participants: "18/25",
      isBookmarked: true,
      category: "Urbano",
      location: "Ciclovias da Cidade",
    },
    {
      id: 6,
      name: "Tour Fotográfico Noturno",
      publisher: "Foto Aventuras",
      image: "/placeholder.svg?height=150&width=200",
      rating: 4.8,
      reviews: 67,
      price: 40,
      duration: "3h",
      difficulty: "Moderado",
      participants: "10/15",
      isBookmarked: false,
      category: "Fotografia",
      location: "Pontos Turísticos",
    },
  ]

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
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Todas as Rotas</h1>
            <div className="flex-1" />
            <Link href="/user/map">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar rotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="price-low">Menor Preço</SelectItem>
                <SelectItem value="price-high">Maior Preço</SelectItem>
                <SelectItem value="duration">Duração</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="historia">História</SelectItem>
                    <SelectItem value="natureza">Natureza</SelectItem>
                    <SelectItem value="gastronomia">Gastronomia</SelectItem>
                    <SelectItem value="aventura">Aventura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Limpar Filtros
                </Button>
                <Button size="sm" className="flex-1">
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">{routes.length} rotas encontradas</p>
        </div>

        {/* Routes Grid */}
        <div className="space-y-4 pb-20">
          {routes.map((route) => (
            <Card key={route.id} className="overflow-hidden">
              <div className="flex">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={route.image || "/placeholder.svg"}
                    alt={route.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className={`w-3 h-3 ${route.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                <CardContent className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">{route.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">por {route.publisher}</p>
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{route.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600">R$ {route.price}</p>
                      <p className="text-xs text-gray-500">por pessoa</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{route.rating}</span>
                    <span className="text-xs text-gray-500">({route.reviews})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{route.participants}</span>
                      </div>
                    </div>
                    <Badge className={`text-xs ${getDifficultyColor(route.difficulty)}`}>{route.difficulty}</Badge>
                  </div>

                  <div className="flex space-x-2 mt-2">
                    <Link href={`/route-details/${route.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-7 text-xs">
                        Detalhes
                      </Button>
                    </Link>
                    <Link href={`/user/booking/${route.id}`} className="flex-1">
                      <Button className="w-full h-7 text-xs bg-green-600 hover:bg-green-700">Reservar</Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
