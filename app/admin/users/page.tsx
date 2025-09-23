"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Filter, MoreVertical, Shield, User, Crown, Ban, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      role: "Administrator",
      status: "Active",
      joinDate: "2024-01-15",
      routes: 5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Publisher",
      status: "Active",
      joinDate: "2024-02-20",
      routes: 12,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike@example.com",
      role: "User",
      status: "Pending",
      joinDate: "2024-03-10",
      routes: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma@example.com",
      role: "Publisher",
      status: "Suspended",
      joinDate: "2024-01-30",
      routes: 8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const getRoleIcon = (role) => {
    switch (role) {
      case "Administrator":
        return <Crown className="w-4 h-4" />
      case "Publisher":
        return <Shield className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-800"
      case "Publisher":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Gerenciamento de Usuários</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuários..."
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
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600">Total de Usuários</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">142</p>
              <p className="text-sm text-gray-600">Ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">8</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </CardContent>
          </Card>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm truncate">{user.name}</h3>
                      {getRoleIcon(user.role)}
                    </div>
                    <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                        {user.role === "Administrator"
                          ? "Administrador"
                          : user.role === "Publisher"
                            ? "Publicador"
                            : "Usuário"}
                      </Badge>
                      <Badge className={`text-xs ${getStatusBadgeColor(user.status)}`}>
                        {user.status === "Active"
                          ? "Ativos"
                          : user.status === "Pending"
                            ? "Pendentes"
                            : user.status === "Suspended"
                              ? "Suspenso"
                              : user.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {user.routes} rotas • Entrou em {user.joinDate}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Usuário
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Ban className="w-4 h-4 mr-2" />
                        Suspender Usuário
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir Usuário
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add User Button */}
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Adicionar Novo Usuário</Button>
      </div>
    </div>
  )
}
