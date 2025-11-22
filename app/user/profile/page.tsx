"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, User, Upload, Save, CheckCircle } from "lucide-react"

export default function UserProfilePage() {
  const { user, profile } = useUser()
  const [nome, setNome] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (profile) {
      setNome(profile.nome_completo || "")
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!user) return
    setIsLoading(true)
    setSuccessMessage("")

    const { error } = await supabase
      .from('perfis')
      .update({ nome_completo: nome })
      .eq('id', user.id)

    if (error) {
      alert("Erro ao atualizar perfil.")
    } else {
      setSuccessMessage("Perfil atualizado com sucesso!")
      // Forçar reload da página para atualizar o contexto (opcional, mas seguro)
      window.location.reload()
    }
    setIsLoading(false)
  }

  const handleBecomePublisher = async () => {
    if (!user) return
    const confirm = window.confirm("Ao tornar-se Publicador, você terá acesso ao painel para criar e gerir as suas próprias rotas turísticas. Deseja continuar?")
    
    if (confirm) {
      setIsLoading(true)
      const { error } = await supabase
        .from('perfis')
        .update({ tipo_perfil: 'publicador' })
        .eq('id', user.id)

      if (error) {
        alert("Erro ao atualizar permissões.")
      } else {
        alert("Parabéns! Agora você é um Publicador. A página será recarregada para liberar o seu acesso.")
        window.location.reload()
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>

        {/* Cartão de Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize os seus dados de identificação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.url_avatar || undefined} />
                <AvatarFallback className="text-2xl">{profile?.nome_completo?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {/* Futuramente: Botão de Upload de Avatar aqui */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" value={user?.email || ""} disabled className="bg-gray-100" />
              <p className="text-xs text-gray-500">O e-mail não pode ser alterado.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input 
                id="nome" 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
              />
            </div>

            {successMessage && (
              <div className="flex items-center text-green-600 text-sm bg-green-50 p-3 rounded-md">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
            </Button>
          </CardFooter>
        </Card>

        {/* Cartão de Tipo de Conta (Apenas para quem AINDA NÃO é publicador/admin) */}
        {profile?.tipo_perfil === 'usuario' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2 text-blue-700">
                <Shield className="w-6 h-6" />
                <CardTitle className="text-xl">Quero Publicar Rotas</CardTitle>
              </div>
              <CardDescription className="text-blue-600">
                Torne-se um Publicador para criar, editar e compartilhar as suas próprias experiências turísticas na plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1 mb-4">
                <li>Acesso ao Painel de Controle</li>
                <li>Ferramentas de criação de rotas com mapa interativo</li>
                <li>Gestão de visibilidade das suas rotas</li>
              </ul>
              <Button onClick={handleBecomePublisher} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                Ativar Modo Publicador
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Feedback Visual do Perfil Atual */}
        <div className="flex justify-center mt-8">
            <Badge variant="outline" className="px-4 py-2 text-sm uppercase tracking-wider text-gray-500">
                Perfil Atual: <span className="font-bold ml-2 text-gray-900">{profile?.tipo_perfil}</span>
            </Badge>
        </div>
      </div>
    </div>
  )
}