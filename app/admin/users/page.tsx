"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Shield, User, Crown, BarChart3, Route, Users, LogOut, UserCircle } from "lucide-react"
import { RouteGuard } from "@/components/RouteGuard"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser } from "@/app/contexts/UserContext"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

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
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  const mobileLinks = [
    { href: "/admin/dashboard", label: "Painel", icon: BarChart3 },
    { href: "/admin/routes", label: "Rotas", icon: Route },
    { href: "/admin/users", label: "Usuários", icon: Users },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
      default: return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.nome_completo || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.tipo_perfil === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  if (loading) return <div className="p-8 text-center text-muted-foreground animate-pulse">A carregar usuários...</div>

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

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome..."
                className="pl-10 border-none bg-gray-50 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[160px] border-none bg-gray-50">
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

          {/* Lista de Usuários */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 flex-1 min-w-0 w-full">
                      <Avatar className="h-10 w-10 border border-gray-100">
                        <AvatarImage src={user.url_avatar || undefined} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-bold">{user.nome_completo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-sm truncate text-gray-900">{user.nome_completo || "Sem Nome"}</h3>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-normal flex items-center gap-1 border-gray-200">
                            {getRoleIcon(user.tipo_perfil)}
                            <span className="capitalize">{user.tipo_perfil}</span>
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Registrado em {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    {/* Seletor de Perfil */}
                    <div className="w-full sm:w-auto mt-2 sm:mt-0">
                      <Select
                        value={user.tipo_perfil}
                        onValueChange={(val) => handleUpdateRole(user.id, val)}
                        disabled={user.id === currentUser?.id}
                      >
                        <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs bg-gray-50 border-gray-200">
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
            {filteredUsers.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <User className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">Nenhum usuário encontrado.</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu Inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
          <div className="flex justify-around items-center h-16 w-full px-2">
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
            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 text-red-500 hover:text-red-600"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-[10px] font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}