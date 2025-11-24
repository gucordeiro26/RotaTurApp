"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Shield, User, Crown, BarChart3, Route, Users } from "lucide-react"
import { RouteGuard } from "@/components/RouteGuard"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/app/contexts/UserContext"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface UserData {
  id: string
  nome_completo: string
  email?: string
  tipo_perfil: string
  url_avatar: string | null
  criado_em: string
}

export default function UserManagement() {
  const { user: currentUser } = useUser()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState("")
  // --- NOVO ESTADO DE FILTRO ---
  const [roleFilter, setRoleFilter] = useState("all")
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  // Links Mobile
  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .order('criado_em', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, tipo_perfil: newRole } : u))

    const { error } = await supabase
      .from('perfis')
      .update({ tipo_perfil: newRole })
      .eq('id', userId)

    if (error) {
      console.error("Erro ao mudar perfil:", error)
      alert("Erro ao atualizar permissão.")
      fetchUsers()
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-purple-600" />
      case "publicador": return <Shield className="w-4 h-4 text-blue-600" />
      default: return <User className="w-4 h-4 text-gray-600" />
    }
  }

  // --- LÓGICA DE FILTRAGEM ATUALIZADA ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.nome_completo || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.tipo_perfil === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  if (loading) return <div className="p-8 text-center">A carregar usuários...</div>

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50/50">

        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-4 flex items-center space-x-3 max-w-7xl mx-auto w-full">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Gerir Usuários</h1>
          </div>
        </div>

        <div className="p-4 space-y-4 pb-24 max-w-7xl mx-auto w-full">

          {/* Área de Filtros Responsiva */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white"
              />
            </div>
            {/* Filtro de Função */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Funções</SelectItem>
                <SelectItem value="usuario">Usuário</SelectItem>
                <SelectItem value="publicador">Publicador</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0 w-full">
                      <Avatar>
                        <AvatarImage src={user.url_avatar || undefined} />
                        <AvatarFallback>{user.nome_completo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-sm truncate">{user.nome_completo || "Sem Nome"}</h3>
                          {getRoleIcon(user.tipo_perfil)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Desde {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto">
                      <Select
                        value={user.tipo_perfil}
                        onValueChange={(val) => handleUpdateRole(user.id, val)}
                        disabled={user.id === currentUser?.id}
                      >
                        <SelectTrigger className="w-full sm:w-[130px] h-9 text-xs bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usuario">Usuário</SelectItem>
                          <SelectItem value="publicador">Publicador</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredUsers.length === 0 && <p className="text-center text-gray-500 mt-4">Nenhum usuário encontrado.</p>}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
          <div className="flex justify-around items-center h-16">
            {mobileLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full space-y-1",
                    isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <link.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                  <span className="text-[10px] font-medium">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}