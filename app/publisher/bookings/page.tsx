"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  DollarSign,
  Download,
  MoreVertical,
  TrendingUp,
  Eye,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function PublisherBookings() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [routeFilter, setRouteFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("upcoming")

  const upcomingBookings = [
    {
      id: 1,
      bookingCode: "TC001234",
      customer: {
        name: "Alice Silva",
        email: "alice@email.com",
        phone: "(11) 99999-1111",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Caminhada pelo Centro Histórico",
      date: "2024-01-25",
      time: "14:00",
      participants: 2,
      totalPrice: 50,
      status: "Confirmado",
      paymentStatus: "Pago",
      bookedAt: "2024-01-20",
      specialRequests: "Grupo com criança de 8 anos",
    },
    {
      id: 2,
      bookingCode: "TC001235",
      customer: {
        name: "Roberto Santos",
        email: "roberto@email.com",
        phone: "(11) 99999-2222",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Trilha da Praia do Pôr do Sol",
      date: "2024-01-26",
      time: "16:00",
      participants: 1,
      totalPrice: 35,
      status: "Pendente",
      paymentStatus: "Pendente",
      bookedAt: "2024-01-22",
      specialRequests: "",
    },
    {
      id: 3,
      bookingCode: "TC001236",
      customer: {
        name: "Carolina Oliveira",
        email: "carolina@email.com",
        phone: "(11) 99999-3333",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Caminhada pelo Centro Histórico",
      date: "2024-01-27",
      time: "14:00",
      participants: 4,
      totalPrice: 100,
      status: "Confirmado",
      paymentStatus: "Pago",
      bookedAt: "2024-01-21",
      specialRequests: "Preferem guia em inglês",
    },
  ]

  const pastBookings = [
    {
      id: 4,
      bookingCode: "TC001230",
      customer: {
        name: "João Pereira",
        email: "joao@email.com",
        phone: "(11) 99999-4444",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Tour Gastronômico Local",
      date: "2024-01-15",
      time: "18:00",
      participants: 2,
      totalPrice: 90,
      status: "Concluído",
      paymentStatus: "Pago",
      bookedAt: "2024-01-10",
      customerRating: 5,
      customerReview: "Experiência incrível! Recomendo muito.",
      specialRequests: "Restrição alimentar: vegetariano",
    },
    {
      id: 5,
      bookingCode: "TC001231",
      customer: {
        name: "Maria Costa",
        email: "maria@email.com",
        phone: "(11) 99999-5555",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Trilha da Praia do Pôr do Sol",
      date: "2024-01-12",
      time: "16:00",
      participants: 3,
      totalPrice: 105,
      status: "Concluído",
      paymentStatus: "Pago",
      bookedAt: "2024-01-08",
      customerRating: 4,
      customerReview: "Muito bom, mas poderia ter mais paradas para fotos.",
      specialRequests: "",
    },
  ]

  const cancelledBookings = [
    {
      id: 6,
      bookingCode: "TC001232",
      customer: {
        name: "Pedro Lima",
        email: "pedro@email.com",
        phone: "(11) 99999-6666",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      route: "Aventura na Montanha",
      date: "2024-01-20",
      time: "08:00",
      participants: 1,
      totalPrice: 55,
      status: "Cancelado",
      paymentStatus: "Reembolsado",
      bookedAt: "2024-01-15",
      cancelReason: "Cliente cancelou por motivos pessoais",
      cancelledAt: "2024-01-18",
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

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Pago":
        return "bg-green-100 text-green-800"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800"
      case "Reembolsado":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const BookingCard = ({ booking, showActions = true }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar>
            <AvatarImage src={booking.customer.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              {booking.customer.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm">{booking.customer.name}</h3>
                <p className="text-xs text-gray-600">{booking.route}</p>
              </div>
              <div className="flex space-x-1">
                <Badge className={`text-xs ${getStatusColor(booking.status)}`}>{booking.status}</Badge>
                <Badge className={`text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(booking.date).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{booking.participants} pessoa(s)</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span className="font-medium text-green-600">R$ {booking.totalPrice}</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-2">
              <p>Código: {booking.bookingCode}</p>
              <p>Reservado em: {new Date(booking.bookedAt).toLocaleDateString("pt-BR")}</p>
            </div>

            {booking.specialRequests && (
              <div className="bg-blue-50 p-2 rounded text-xs mb-2">
                <p className="font-medium text-blue-800">Solicitações especiais:</p>
                <p className="text-blue-700">{booking.specialRequests}</p>
              </div>
            )}

            {booking.customerReview && (
              <div className="bg-yellow-50 p-2 rounded text-xs mb-2">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(booking.customerRating)].map((_, i) => (
                    <CheckCircle key={i} className="w-3 h-3 text-yellow-500" />
                  ))}
                  <span className="font-medium text-yellow-800">{booking.customerRating}/5</span>
                </div>
                <p className="text-yellow-700">"{booking.customerReview}"</p>
              </div>
            )}

            {booking.cancelReason && (
              <div className="bg-red-50 p-2 rounded text-xs mb-2">
                <p className="font-medium text-red-800">Motivo do cancelamento:</p>
                <p className="text-red-700">{booking.cancelReason}</p>
                <p className="text-red-600">
                  Cancelado em: {new Date(booking.cancelledAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            )}

            {showActions && (
              <div className="flex space-x-2 mt-3">
                {booking.status === "Pendente" && (
                  <>
                    <Button size="sm" className="flex-1 h-7 text-xs bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Confirmar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs text-red-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      Recusar
                    </Button>
                  </>
                )}

                {booking.status === "Confirmado" && (
                  <>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Mensagem
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-xs">
                      <Phone className="w-3 h-3 mr-1" />
                      Ligar
                    </Button>
                  </>
                )}

                {booking.status === "Concluído" && (
                  <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Baixar Comprovante
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Enviar Mensagem
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Dados
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/publisher/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Reservas</h1>
          </div>

          {/* Search and Filters */}
          <div className="flex space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por cliente ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-blue-600">
                  {upcomingBookings.length + pastBookings.length + cancelledBookings.length}
                </p>
                <p className="text-xs text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-green-600">
                  {upcomingBookings.filter((b) => b.status === "Confirmado").length}
                </p>
                <p className="text-xs text-gray-600">Confirmadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-yellow-600">
                  {upcomingBookings.filter((b) => b.status === "Pendente").length}
                </p>
                <p className="text-xs text-gray-600">Pendentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-purple-600">
                  R${" "}
                  {[...upcomingBookings, ...pastBookings]
                    .filter((b) => b.paymentStatus === "Pago")
                    .reduce((sum, b) => sum + b.totalPrice, 0)}
                </p>
                <p className="text-xs text-gray-600">Receita</p>
              </CardContent>
            </Card>
          </div>
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
                  <p className="text-sm text-gray-600">Suas próximas reservas aparecerão aqui.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {pastBookings.length > 0 ? (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhuma reserva passada</h3>
                  <p className="text-sm text-gray-600">Suas reservas concluídas aparecerão aqui.</p>
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
                  <XCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
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
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-gray-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Minhas Rotas</span>
          </Link>
          <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-green-600">
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
