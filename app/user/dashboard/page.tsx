"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Filter, Star, Clock, Users, Heart, Calendar, Compass, Bookmark, Award } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/app/contexts/UserContext" // Importe o hook
import { Skeleton } from "@/components/ui/skeleton" // Importe o Skeleton para o loading

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const { profile, isLoading } = useUser() // Use o hook para pegar o perfil

  const featuredRoutes = [
    {
      id: 1,
      name: "Caminhada pelo Centro Histórico",
      publisher: "Tours da Cidade",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.8,
      reviews: 156,
      price: 25,
      duration: "2h",
      difficulty: "Fácil",
      participants: "23/30",
      isBookmarked: false,
      category: "História",
    },
    {
      id: 2,
      name: "Trilha da Praia do Pôr do Sol",
      publisher: "Aventura Cia.",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.9,
      reviews: 89,
      price: 35,
      duration: "3h",
      difficulty: "Moderado",
      participants: "15/20",
      isBookmarked: true,
      category: "Natureza",
    },
    {
      id: 3,
      name: "Tour Gastronômico Local",
      publisher: "Sabores da Cidade",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.7,
      reviews: 203,
      price: 45,
      duration: "2.5h",
      difficulty: "Fácil",
      participants: "12/15",
      isBookmarked: false,
      category: "Gastronomia",
    },
  ]

  const categories = [
    { name: "História", icon: Award, color: "bg-purple-500" },
    { name: "Natureza", icon: MapPin, color: "bg-green-500" },
    { name: "Gastronomia", icon: Star, color: "bg-orange-500" },
    { name: "Aventura", icon: Compass, color: "bg-blue-500" },
  ]

  const myBookings = [
    {
      id: 1,
      route: "Caminhada pelo Centro Histórico",
      date: "2024-01-25",
      time: "14:00",
      status: "Confirmado",
      participants: 2,
    },
    {
      id: 2,
      route: "Tour Gastronômico Local",
      date: "2024-01-28",
      time: "18:00",
      status: "Pendente",
      participants: 1,
    },
  ]

  // Se estiver carregando, mostre um esqueleto de UI
  if (isLoading) {
    return (
        <div className="p-4">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-6 w-64" />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Olá, {profile?.nome_completo || 'Viajante'}!</h1>
                <p className="text-sm text-gray-600">Descubra novas aventuras</p>
              </div>
            </div>
            <Link href="/user/profile">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar rotas turísticas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Categorias</h2>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {categories.map((category, index) => (
              <Link key={index} href={`/user/categories/${category.name.toLowerCase()}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Map Search Button */}
          <Link href="/user/map">
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-blue-500 to-green-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Buscar no Mapa</h3>
                    <p className="text-xs opacity-90">Explore rotas visualmente</p>
                  </div>
                  <Compass className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Featured Routes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Rotas em Destaque</h2>
            <Link href="/user/routes">
              <Button variant="ghost" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {featuredRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden">
                <div className="relative">
                  <img src={route.image || "/placeholder.svg"} alt={route.name} className="w-full h-40 object-cover" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-gray-800">{route.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="absolute top-3 right-3 bg-white/90 hover:bg-white">
                    <Heart className={`w-4 h-4 ${route.isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{route.name}</h3>
                      <p className="text-xs text-gray-600">por {route.publisher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">R$ {route.price}</p>
                      <p className="text-xs text-gray-500">por pessoa</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{route.rating}</span>
                    <span className="text-xs text-gray-500">({route.reviews} avaliações)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{route.participants}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {route.difficulty}
                    </Badge>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/route-details/${route.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/user/booking/${route.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                        Reservar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Minhas Reservas</h2>
            <Link href="/user/bookings">
              <Button variant="ghost" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {myBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{booking.route}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {booking.date} às {booking.time}
                        </span>
                        <span>•</span>
                        <span>{booking.participants} pessoa(s)</span>
                      </div>
                    </div>
                    <Badge variant={booking.status === "Confirmado" ? "default" : "secondary"}>{booking.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <Compass className="w-5 h-5" />
            <span className="text-xs mt-1">Explorar</span>
          </Link>
          <Link href="/user/routes" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Rotas</span>
          </Link>
          <Link href="/user/map" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Mapa</span>
          </Link>
          <Link href="/user/profile" className="flex flex-col items-center py-2 text-gray-600">
            <Bookmark className="w-5 h-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
