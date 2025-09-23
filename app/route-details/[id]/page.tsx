"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Calendar,
  Share,
  Heart,
  MessageSquare,
  Navigation,
} from "lucide-react"
import Link from "next/link"

export default function RouteDetails() {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const route = {
    id: 1,
    name: "Tour a Pé pelo Centro Histórico",
    description:
      "Explore a rica história do nosso centro com guias especializados. Visite marcos históricos, aprenda sobre a cultura local e descubra joias escondidas que a maioria dos turistas nunca vê.",
    publisher: {
      name: "Tours da Cidade",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      totalRoutes: 12,
    },
    images: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    price: 25,
    duration: "2 hours",
    difficulty: "Fácil",
    maxParticipants: 30,
    currentParticipants: 23,
    rating: 4.7,
    totalReviews: 156,
    nextAvailable: "2024-01-20",
    waypoints: [
      "Prefeitura - Ponto de Partida",
      "Praça do Mercado Histórico",
      "Catedral Antiga",
      "Museu do Patrimônio",
      "Parque Ribeirinho - Ponto Final",
    ],
    included: [
      "Guia turístico profissional",
      "Mapas e materiais históricos",
      "Experiência em grupo pequeno",
      "Oportunidades de fotos",
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah Silva",
        avatar: "/placeholder.svg?height=32&width=32",
        rating: 5,
        comment: "Passeio incrível! Nosso guia era muito conhecedor e a rota estava bem planejada.",
        date: "2024-01-10",
      },
      {
        id: 2,
        user: "Miguel Santos",
        avatar: "/placeholder.svg?height=32&width=32",
        rating: 4,
        comment: "Ótima experiência, aprendi muito sobre a história da cidade.",
        date: "2024-01-08",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/admin/routes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
              <Heart className={`w-4 h-4 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {/* Image Gallery */}
        <div className="relative">
          <img src={route.images[0] || "/placeholder.svg"} alt={route.name} className="w-full h-48 object-cover" />
          <div className="absolute bottom-4 right-4">
            <Badge className="bg-black/70 text-white">1 / {route.images.length}</Badge>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Basic Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{route.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{route.rating}</span>
                <span>({route.totalReviews} avaliações)</span>
              </div>
              <Badge variant="outline">{route.difficulty}</Badge>
            </div>
            <p className="text-gray-700">{route.description}</p>
          </div>

          {/* Publisher Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={route.publisher.avatar || "/placeholder.svg"} />
                  <AvatarFallback>CT</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{route.publisher.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{route.publisher.rating}</span>
                    <span>•</span>
                    <span>{route.publisher.totalRoutes} routes</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contato
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold">${route.price}</p>
                <p className="text-sm text-gray-600">por pessoa</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{route.duration}</p>
                <p className="text-sm text-gray-600">duração</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold">
                  {route.currentParticipants}/{route.maxParticipants}
                </p>
                <p className="text-sm text-gray-600">participantes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                <p className="text-lg font-bold">{route.nextAvailable}</p>
                <p className="text-sm text-gray-600">próximo disponível</p>
              </CardContent>
            </Card>
          </div>

          {/* Route Map */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Navigation className="w-5 h-5" />
                <span>Mapa da Rota</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-6 text-center mb-4">
                <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Mapa interativo da rota</p>
                <p className="text-xs text-gray-500">Toque para ver o mapa completo</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Pontos de Parada:</h4>
                {route.waypoints.map((waypoint, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                    <span>{waypoint}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">O que está Incluído</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {route.included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Avaliações ({route.totalReviews})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {route.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={review.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {review.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{review.user}</h4>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Ver Todas as Avaliações
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            Mensagem para Publicador
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Reservar Agora - ${route.price}</Button>
        </div>
      </div>
    </div>
  )
}
