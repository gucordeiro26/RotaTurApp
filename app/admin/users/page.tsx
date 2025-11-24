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
        .order('criado_em', { ascending: false }) // Verifique se é 'criado_em'

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

  if (loading) return <div className="flex justify-center items-center h-screen">A carregar usuários...</div>

  return (
    <RouteGuard allowedRoles={["admin"]}>
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-xl font-semibold">Gerenciamento de Usuários</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
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
        </div>

        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Avatar>
                      <AvatarImage src={user.url_avatar || undefined} />
                      <AvatarFallback>{user.nome_completo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-sm truncate">{user.nome_completo || "Sem Nome"}</h3>
                        {getRoleIcon(user.tipo_perfil)}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Membro desde {new Date(user.criado_em).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Seletor de Perfil */}
                  <Select 
                        value={user.tipo_perfil} 
                        onValueChange={(val) => handleUpdateRole(user.id, val)}
                    >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="usuario">Usuário</SelectItem>
                            <SelectItem value="publicador">Publicador</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredUsers.length === 0 && <p className="text-center text-gray-500 mt-4">Nenhum usuário encontrado.</p>}
        </div>
      </div>
    </div>
    </RouteGuard>
  )
}