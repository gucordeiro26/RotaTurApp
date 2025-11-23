"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Search, Filter, Shield, User, Crown, UserCog } from "lucide-react"
import { RouteGuard } from "@/components/RouteGuard"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserData {
  id: string
  nome_completo: string
  email?: string
  tipo_perfil: string
  url_avatar: string | null
  criado_em: string
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

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
    // Atualização Otimista
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, tipo_perfil: newRole } : u))

    const { error } = await supabase
        .from('perfis')
        .update({ tipo_perfil: newRole })
        .eq('id', userId)

    if (error) {
        console.error("Erro ao mudar perfil:", error)
        alert("Erro ao atualizar permissão.")
        fetchUsers() // Reverte em caso de erro
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Crown className="w-4 h-4 text-purple-600" />
      case "publicador": return <Shield className="w-4 h-4 text-blue-600" />
      default: return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
        (user.nome_completo || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando usuários...</div>

  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="flex flex-col h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40 flex-shrink-0">
        <div className="px-3 py-2 flex items-center justify-between w-full">
          <h1 className="text-base font-semibold truncate">Gerir Usuários</h1>
          <Link href="/admin/dashboard" className="flex-shrink-0 ml-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 pb-20 w-full">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>

        {/* Users List */}
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-0 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-center justify-between gap-2">
                  {/* User Info */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user.url_avatar || undefined} />
                      <AvatarFallback className="text-xs">{user.nome_completo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="text-xs font-medium truncate">{user.nome_completo || "Sem Nome"}</h3>
                        {getRoleIcon(user.tipo_perfil)}
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Role Selector */}
                  <Select 
                    value={user.tipo_perfil} 
                    onValueChange={(val) => handleUpdateRole(user.id, val)}
                  >
                    <SelectTrigger className="w-20 h-7 text-xs flex-shrink-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario" className="text-xs">Usuário</SelectItem>
                      <SelectItem value="publicador" className="text-xs">Publicador</SelectItem>
                      <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <p className="text-xs text-gray-500">Nenhum usuário encontrado.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </RouteGuard>
  )
}