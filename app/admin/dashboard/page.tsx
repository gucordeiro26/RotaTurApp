"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, Shield, Plus, Edit, Trash2, MessageSquare, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    { title: "Total de Rotas", value: "24", icon: Route, color: "bg-blue-500" },
    { title: "Usuários Ativos", value: "156", icon: Users, color: "bg-green-500" },
    { title: "Aprovações Pendentes", value: "8", icon: Shield, color: "bg-orange-500" },
    { title: "Mensagens", value: "12", icon: MessageSquare, color: "bg-purple-500" },
  ]

  const recentRoutes = [
    { id: 1, name: "Caminhada pelo Centro Histórico", publisher: "Tours da Cidade", status: "Ativo", participants: 23 },
    { id: 2, name: "Aventura na Trilha da Montanha", publisher: "Aventura Cia.", status: "Pendente", participants: 15 },
    { id: 3, name: "Rota Cênica Costeira", publisher: "Vista do Oceano", status: "Ativo", participants: 31 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Painel Administrativo</h1>
          </div>
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
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
            <Link href="/admin/routes/create">
              <Button className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Criar Rota</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Users className="w-5 h-5" />
                <span className="text-sm">Gerenciar Usuários</span>
              </Button>
            </Link>
            <Link href="/admin/routes">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Route className="w-5 h-5" />
                <span className="text-sm">Todas as Rotas</span>
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm">Análises</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rotas Recentes</CardTitle>
            <CardDescription>Últimas rotas turísticas da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{route.name}</h4>
                  <p className="text-xs text-gray-600">por {route.publisher}</p>
                  <p className="text-xs text-gray-500">{route.participants} participantes</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={route.status === "Ativo" ? "default" : "secondary"}>{route.status}</Badge>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/admin/dashboard" className="flex flex-col items-center py-2 text-blue-600">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/admin/routes" className="flex flex-col items-center py-2 text-gray-600">
            <Route className="w-5 h-5" />
            <span className="text-xs mt-1">Rotas</span>
          </Link>
          <Link href="/admin/users" className="flex flex-col items-center py-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-xs mt-1">Usuários</span>
          </Link>
          <Link href="/admin/messages" className="flex flex-col items-center py-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Mensagens</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
