"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Edit,
  Star,
  MapPin,
  Calendar,
  Heart,
  Bell,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  Camera,
  Award,
  Compass,
  Bookmark,
} from "lucide-react"
import Link from "next/link"

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const userStats = {
    totalBookings: 12,
    completedRoutes: 8,
    favoriteRoutes: 5,
    averageRating: 4.8,
    memberSince: "Janeiro 2024",
  }

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      title: "Reserva confirmada",
      description: "Caminhada pelo Centro Histórico",
      date: "2024-01-20",
      icon: Calendar,
    },
    {
      id: 2,
      type: "review",
      title: "Avaliação enviada",
      description: "Trilha da Praia do Pôr do Sol - 5 estrelas",
      date: "2024-01-18",
      icon: Star,
    },
    {
      id: 3,
      type: "favorite",
      title: "Rota favoritada",
      description: "Tour Gastronômico Local",
      date: "2024-01-15",
      icon: Heart,
    },
  ]

  const achievements = [
    { name: "Primeiro Passeio", description: "Completou sua primeira rota", earned: true },
    { name: "Explorador", description: "Completou 5 rotas diferentes", earned: true },
    { name: "Aventureiro", description: "Completou 10 rotas", earned: false },
    { name: "Crítico", description: "Deixou 10 avaliações", earned: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Meu Perfil</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Profile Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback className="text-lg">MS</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0">
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input defaultValue="Maria Silva" />
                    <Input defaultValue="maria.silva@email.com" />
                    <Input defaultValue="(11) 99999-9999" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">Maria Silva</h2>
                    <p className="text-gray-600">maria.silva@email.com</p>
                    <p className="text-gray-600">(11) 99999-9999</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{userStats.averageRating}</span>
                      <span className="text-sm text-gray-500">• Membro desde {userStats.memberSince}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {isEditing && (
              <div className="flex space-x-2 mt-4">
                <Button size="sm" className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{userStats.totalBookings}</p>
              <p className="text-sm text-gray-600">Total de Reservas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold">{userStats.completedRoutes}</p>
              <p className="text-sm text-gray-600">Rotas Concluídas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold">{userStats.favoriteRoutes}</p>
              <p className="text-sm text-gray-600">Rotas Favoritas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{userStats.averageRating}</p>
              <p className="text-sm text-gray-600">Avaliação Média</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Conquistas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.earned ? "bg-yellow-100" : "bg-gray-100"
                  }`}
                >
                  <Award className={`w-5 h-5 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium text-sm ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </div>
                {achievement.earned && <Badge className="bg-yellow-100 text-yellow-800">Conquistado</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configurações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Notificações</p>
                  <p className="text-xs text-gray-600">Receber atualizações sobre reservas</p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <Link href="/user/payment-methods">
              <div className="flex items-center space-x-3 py-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Métodos de Pagamento</p>
                  <p className="text-xs text-gray-600">Gerenciar cartões e formas de pagamento</p>
                </div>
              </div>
            </Link>

            <Link href="/user/privacy">
              <div className="flex items-center space-x-3 py-2">
                <Shield className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Privacidade e Segurança</p>
                  <p className="text-xs text-gray-600">Configurações de privacidade</p>
                </div>
              </div>
            </Link>

            <Link href="/user/help">
              <div className="flex items-center space-x-3 py-2">
                <HelpCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-sm">Ajuda e Suporte</p>
                  <p className="text-xs text-gray-600">Central de ajuda e contato</p>
                </div>
              </div>
            </Link>

            <div className="border-t pt-4">
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-5 h-5 mr-3" />
                Sair da Conta
              </Button>
            </div>
          </CardContent>
        </Card>
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
          <Link href="/user/profile" className="flex flex-col items-center py-2 text-green-600">
            <Bookmark className="w-5 h-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
