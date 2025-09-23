"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  MessageSquare,
  Star,
  Download,
  RefreshCw,
  X,
  Compass,
  Bookmark,
} from "lucide-react"
import Link from "next/link"

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingBookings = [
    {
      id: 1,
      route: "Caminhada pelo Centro Histórico",
      publisher: "Tours da Cidade",
      image: "/placeholder.svg?height=100&width=150",
      date: "2024-01-25",
      time: "14:00",
      participants: 2,
      price: 50,
      status: "Confirmado",
      bookingCode: "TC001234",
      location: "Centro da Cidade",
    },
    {
      id: 2,
      route: "Tour Gastronômico Local",
      publisher: "Sabores da Cidade",
      image: "/placeholder.svg?height=100&width=150",
      date: "2024-01-28",
      time: "18:00",
      participants: 1,
      price: 45,
      status: "Pendente",
      bookingCode: "SC001235",
      location: "Bairro Gastronômico",
    },
  ]

  const pastBookings = [
    {
      id: 3,
      route: "Trilha da Praia do Pôr do Sol",
      publisher: "Aventura Cia.",
      image: "/placeholder.svg?height=100&width=150",
      date: "2024-01-15",
      time: "16:00",
      participants: 2,
      price: 70,
      status: "Concluído",
      bookingCode: "AC001233",
      location: "Costa Leste",
      rating: 5,
      hasReview: true,
    },
    {
      id: 4,
      route: "Passeio de Bike Urbano",
      publisher: "Bike Tours",
      image: "/placeholder.svg?height=100&width=150",
      date: "2024-01-10",
      time: "09:00",
      participants: 1,
      price: 30,
      status: "Concluído",
      bookingCode: "BT001232",
      location: "Ciclovias da Cidade",
      rating: 0,
      hasReview: false,
    },
  ]

  const cancelledBookings = [
    {
      id: 5,
      route: "Aventura na Montanha",
      publisher: "Trilhas Extremas",
      image: "/placeholder.svg?height=100&width=150",
      date: "2024-01-20",
      time: "08:00",
      participants: 1,
      price: 55,
      status: "Cancelado",
      bookingCode: "TE001231",
      location: "Serra da Mantiqueira",
      cancelReason: "Cancelado pelo organizador devido ao clima",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Concluído":
        return "bg-blue-100 text-blue-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const BookingCard = ({ booking, showActions = true }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <img
            src={booking.image || "/placeholder.svg"}
            alt={booking.route}
            className="w-20 h-16 object-cover rounded-lg"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm mb-1">{booking.route}</h3>
                <p className="text-xs text-gray-600">por {booking.publisher}</p>
              </div>
              <Badge className={`text-xs ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
            </div>

            <div className="space-y-1 text-xs text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(booking.date).toLocaleDateString("pt-BR")}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{booking.participants} pessoa(s)</span>
                <span className="ml-2 font-medium">R$ {booking.price}</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-2">Código: {booking.bookingCode}</p>

            {booking.cancelReason && <p className="text-xs text-red-600 mb-2">{booking.cancelReason}</p>}

            {booking.status === "Concluído" && !booking.hasReview && (
              <div className="flex items-center space-x-1 mb-2">
                <Star className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">Avalie esta experiência</span>
              </div>
            )}

            {booking.hasReview && (
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(booking.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1">Avaliado</span>
              </div>
            )}

            {showActions && (
              <div className="flex space-x-2 mt-3">
                {booking.status === "Confirmado" && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-3 h-3 mr-1" />
                      Voucher
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Contato
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                )}

                {booking.status === "Pendente" && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reagendar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <X className="w-3 h-3 mr-1" />
                      Cancelar
                    </Button>
                  </>
                )}

                {booking.status === "Concluído" && !booking.hasReview && (
                  <Button size="sm" className="flex-1 bg-yellow-500 hover:bg-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    Avaliar
                  </Button>
                )}

                {booking.status === "Concluído" && booking.hasReview && (
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Recibo
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/user/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Minhas Reservas</h1>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Próximas ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Passadas ({pastBookings.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas ({cancelledBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhuma reserva próxima</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore nossas rotas incríveis e faça sua primeira reserva!
                  </p>
                  <Link href="/user/routes">
                    <Button>Explorar Rotas</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Star className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhuma experiência passada</h3>
                  <p className="text-sm text-gray-600">Suas experiências concluídas aparecerão aqui.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-4">
            {cancelledBookings.length > 0 ? (
              <div className="space-y-4">
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <X className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhuma reserva cancelada</h3>
                  <p className="text-sm text-gray-600">Suas reservas canceladas aparecerão aqui.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-gray-600">
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
