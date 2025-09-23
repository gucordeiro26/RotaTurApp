"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  ArrowLeft,
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Users,
  Navigation,
  Layers,
  Target,
  Heart,
  Eye,
  Calendar,
} from "lucide-react"
import Link from "next/link"

export default function MapSearch() {
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [mapView, setMapView] = useState("standard") // standard, satellite, terrain

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
      category: "História",
      location: "Centro da Cidade",
      coordinates: { lat: -23.5505, lng: -46.6333 },
      description: "Explore a rica história do centro da cidade com guias especializados.",
      nextAvailable: "2024-01-25",
      isBookmarked: false,
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
      category: "Natureza",
      location: "Costa Leste",
      coordinates: { lat: -23.52, lng: -46.6 },
      description: "Caminhada pela costa com vista espetacular do pôr do sol.",
      nextAvailable: "2024-01-26",
      isBookmarked: true,
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
      category: "Gastronomia",
      location: "Bairro Gastronômico",
      coordinates: { lat: -23.56, lng: -46.65 },
      description: "Descubra os sabores locais em uma jornada gastronômica única.",
      nextAvailable: "2024-01-27",
      isBookmarked: false,
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
      category: "Aventura",
      location: "Serra da Mantiqueira",
      coordinates: { lat: -23.48, lng: -46.58 },
      description: "Desafie-se em trilhas de montanha com vistas deslumbrantes.",
      nextAvailable: "2024-01-28",
      isBookmarked: false,
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
      category: "Urbano",
      location: "Ciclovias da Cidade",
      coordinates: { lat: -23.54, lng: -46.62 },
      description: "Explore a cidade de bicicleta pelas principais ciclovias.",
      nextAvailable: "2024-01-29",
      isBookmarked: true,
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
      category: "Fotografia",
      location: "Pontos Turísticos",
      coordinates: { lat: -23.53, lng: -46.64 },
      description: "Capture a beleza noturna da cidade com dicas profissionais.",
      nextAvailable: "2024-01-30",
      isBookmarked: false,
    },
  ]

  const getCategoryColor = (category) => {
    switch (category) {
      case "História":
        return "bg-purple-500"
      case "Natureza":
        return "bg-green-500"
      case "Gastronomia":
        return "bg-orange-500"
      case "Aventura":
        return "bg-blue-500"
      case "Urbano":
        return "bg-gray-500"
      case "Fotografia":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
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

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || route.category.toLowerCase() === filterCategory
    const matchesDifficulty = filterDifficulty === "all" || route.difficulty.toLowerCase() === filterDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const MapMarker = ({ route, isSelected, onClick }) => (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
        isSelected ? "scale-125 z-20" : "z-10 hover:scale-110"
      }`}
      style={{
        left: `${((route.coordinates.lng + 46.7) / 0.2) * 100}%`,
        top: `${((route.coordinates.lat + 23.6) / -0.2) * 100}%`,
      }}
      onClick={() => onClick(route)}
    >
      <div
        className={`w-8 h-8 ${getCategoryColor(route.category)} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}
      >
        <MapPin className="w-4 h-4 text-white" />
      </div>
      {isSelected && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-48 border">
          <h4 className="font-semibold text-sm mb-1">{route.name}</h4>
          <div className="flex items-center space-x-1 mb-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs">{route.rating}</span>
            <span className="text-xs text-gray-500">({route.reviews})</span>
          </div>
          <p className="text-xs text-gray-600 mb-2">{route.location}</p>
          <div className="flex space-x-1">
            <Button size="sm" className="flex-1 h-6 text-xs">
              Ver Detalhes
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="bg-white shadow-sm border-b relative z-30">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-3">
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Mapa de Rotas</h1>
            <div className="flex-1" />
            <Button variant="ghost" size="sm">
              <Target className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMapView(mapView === "standard" ? "satellite" : "standard")}
            >
              <Layers className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por local ou nome da rota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12"
            />
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[400px]">
                <SheetHeader>
                  <SheetTitle>Filtros de Busca</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        <SelectItem value="história">História</SelectItem>
                        <SelectItem value="natureza">Natureza</SelectItem>
                        <SelectItem value="gastronomia">Gastronomia</SelectItem>
                        <SelectItem value="aventura">Aventura</SelectItem>
                        <SelectItem value="urbano">Urbano</SelectItem>
                        <SelectItem value="fotografia">Fotografia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Dificuldade</label>
                    <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Dificuldades</SelectItem>
                        <SelectItem value="fácil">Fácil</SelectItem>
                        <SelectItem value="moderado">Moderado</SelectItem>
                        <SelectItem value="difícil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setFilterCategory("all")
                        setFilterDifficulty("all")
                        setSearchTerm("")
                      }}
                    >
                      Limpar Filtros
                    </Button>
                    <Button className="flex-1" onClick={() => setShowFilters(false)}>
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters */}
          {(filterCategory !== "all" || filterDifficulty !== "all" || searchTerm) && (
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs text-gray-600">Filtros ativos:</span>
              {filterCategory !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {filterCategory}
                </Badge>
              )}
              {filterDifficulty !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  {filterDifficulty}
                </Badge>
              )}
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  "{searchTerm}"
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-gray-600">{filteredRoutes.length} rota(s) encontrada(s)</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-200px)]">
        {/* Simulated Map Background */}
        <div
          className={`w-full h-full ${
            mapView === "satellite"
              ? "bg-gradient-to-br from-green-800 via-green-600 to-blue-800"
              : "bg-gradient-to-br from-green-100 via-blue-50 to-blue-100"
          } relative overflow-hidden`}
        >
          {/* Map Grid Lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full border-t border-gray-400" style={{ top: `${i * 10}%` }} />
            ))}
            {[...Array(10)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full border-l border-gray-400" style={{ left: `${i * 10}%` }} />
            ))}
          </div>

          {/* Route Markers */}
          {filteredRoutes.map((route) => (
            <MapMarker
              key={route.id}
              route={route}
              isSelected={selectedRoute?.id === route.id}
              onClick={setSelectedRoute}
            />
          ))}

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 max-w-48">
            <h4 className="font-semibold text-sm mb-2">Legenda</h4>
            <div className="space-y-1">
              {["História", "Natureza", "Gastronomia", "Aventura", "Urbano", "Fotografia"].map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${getCategoryColor(category)} rounded-full`} />
                  <span className="text-xs">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Location Button */}
          <Button
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white hover:bg-gray-50 text-gray-700 shadow-lg"
            variant="outline"
          >
            <Navigation className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Selected Route Details */}
      {selectedRoute && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20 max-h-80 overflow-y-auto">
          <div className="p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{selectedRoute.name}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRoute(null)}>
                ×
              </Button>
            </div>

            <div className="flex space-x-3 mb-4">
              <img
                src={selectedRoute.image || "/placeholder.svg"}
                alt={selectedRoute.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">por {selectedRoute.publisher}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedRoute.rating}</span>
                    <span className="text-xs text-gray-500">({selectedRoute.reviews} avaliações)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-2">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600">{selectedRoute.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">R$ {selectedRoute.price}</p>
                <p className="text-xs text-gray-500">por pessoa</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3">{selectedRoute.description}</p>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{selectedRoute.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{selectedRoute.participants}</span>
              </div>
              <Badge className={`text-xs ${getDifficultyColor(selectedRoute.difficulty)}`}>
                {selectedRoute.difficulty}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Próximo disponível: {new Date(selectedRoute.nextAvailable).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Heart className={`w-4 h-4 mr-2 ${selectedRoute.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                {selectedRoute.isBookmarked ? "Favoritado" : "Favoritar"}
              </Button>
              <Link href={`/route-details/${selectedRoute.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </Link>
              <Link href={`/user/booking/${selectedRoute.id}`} className="flex-1">
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Reservar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="grid grid-cols-4 py-2">
          <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Explorar</span>
          </Link>
          <Link href="/user/routes" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Rotas</span>
          </Link>
          <Link href="/user/map" className="flex flex-col items-center py-2 text-green-600">
            <Navigation className="w-5 h-5" />
            <span className="text-xs mt-1">Mapa</span>
          </Link>
          <Link href="/user/profile" className="flex flex-col items-center py-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
