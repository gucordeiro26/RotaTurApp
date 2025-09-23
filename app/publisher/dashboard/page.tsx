"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, MessageSquare, Plus, Eye, Edit, Calendar, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function PublisherDashboard() {
  const stats = [
    { title: "Minhas Rotas", value: "12", icon: Route, color: "bg-blue-500" },
    { title: "Total de Reservas", value: "89", icon: Users, color: "bg-green-500" },
    { title: "Receita", value: "$2,340", icon: DollarSign, color: "bg-purple-500" },
    { title: "Mensagens", value: "5", icon: MessageSquare, color: "bg-orange-500" },
  ]

  const myRoutes = [
    {
      id: 1,
      name: "Caminhada pelo Centro Histórico",
      status: "Ativo",
      bookings: 23,
      revenue: "$575",
      nextTour: "2024-01-20",
    },
    {
      id: 2,
      name: "Trilha da Praia do Pôr do Sol",
      status: "Ativo",
      bookings: 31,
      revenue: "$930",
      nextTour: "2024-01-18",
    },
    {
      id: 3,
      name: "Caminhada com Vista da Montanha",
      status: "Rascunho",
      bookings: 0,
      revenue: "$0",
      nextTour: "Não agendado",
    },
  ]

  const recentBookings = [
    { id: 1, user: "Alice Silva", route: "Caminhada pelo Centro Histórico", date: "2024-01-15", status: "Confirmado" },
    { id: 2, user: "Roberto Santos", route: "Trilha da Praia do Pôr do Sol", date: "2024-01-16", status: "Pendente" },
    {
      id: 3,
      user: "Carolina Oliveira",
      route: "Caminhada pelo Centro Histórico",
      date: "2024-01-17",
      status: "Confirmado",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Painel do Publicador</h1>
          </div>
          <Link href="/publisher/messages">
            <Button variant="ghost" size="sm" className="relative">
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/publisher/routes/create">
              <Button className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Criar Rota</span>
              </Button>
            </Link>
            <Link href="/publisher/messages">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Mensagens</span>
              </Button>
            </Link>
            <Link href="/publisher/bookings">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Reservas</span>
              </Button>
            </Link>
            <Link href="/publisher/analytics">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Análises</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* My Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Rotas</CardTitle>
            <CardDescription>Gerencie suas rotas publicadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{route.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={route.status === "Ativo" ? "default" : "secondary"}>{route.status}</Badge>
                    <span className="text-xs text-gray-600">{route.bookings} reservas</span>
                  </div>
                  <p className="text-xs text-gray-500">Receita: {route.revenue}</p>
                  <p className="text-xs text-gray-500">Próximo: {route.nextTour}</p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reservas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{booking.user}</h4>
                  <p className="text-xs text-gray-600">{booking.route}</p>
                  <p className="text-xs text-gray-500">{booking.date}</p>
                </div>
                <Badge variant={booking.status === "Confirmado" ? "default" : "secondary"}>{booking.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600">
            <Route className="w-5 h-5" />
            <span className="text-xs mt-1">Minhas Rotas</span>
          </Link>
          <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Reservas</span>
          </Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Mensagens</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
