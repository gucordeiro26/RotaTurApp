"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Save, CheckCircle, Briefcase, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function UserProfilePage() {
  const { user, profile } = useUser()
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const hasPublisherAccess = profile?.tipo_perfil === 'publicador' || profile?.tipo_perfil === 'admin';

  useEffect(() => {
    if (profile) {
      setNome(profile.nome_completo || "")
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!user) return
    setIsLoading(true)
    setSuccessMessage("")

    try {
      const { data, error } = await supabase
        .from('perfis')
        .update({ nome_completo: nome })
        .eq('id', user.id)
        .select()

      if (error) throw error

      if (!data || data.length === 0) {
        alert("A atualização não foi aplicada. Verifique as permissões do banco de dados.")
      } else {
        setSuccessMessage("Perfil atualizado com sucesso!")
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error: any) {
      console.error("Erro:", error)
      alert(`Erro ao atualizar: ${error.message || "Erro desconhecido"}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBecomePublisher = async () => {
    if (!user) return
    const confirm = window.confirm("Ao tornar-se Publicador, você terá acesso ao painel para criar e gerir as suas próprias rotas turísticas. Deseja continuar?")

    if (confirm) {
      setIsLoading(true)
      try {
        const { error } = await supabase
          .from('perfis')
          .update({ tipo_perfil: 'publicador' })
          .eq('id', user.id)

        if (error) throw error

        alert("Parabéns! Agora você é um Publicador. A página será recarregada.")
        window.location.reload()
      } catch (error: any) {
        alert(`Erro ao atualizar permissões: ${error.message}`)
        setIsLoading(false)
      }
    }
  }

  const switchProfile = (target: 'user' | 'publisher') => {
    if (target === 'publisher') {
      if (window.confirm("Ir para o Painel do Publicador?")) {
        router.push('/publisher/dashboard');
      }
    } else {
      if (window.confirm("Ir para o Modo Turista?")) {
        router.push('/user/dashboard');
      }
    }
  }

  // --- NOVA FUNÇÃO: LOGOUT ---
  const handleLogout = async () => {
    const confirm = window.confirm("Tem a certeza que deseja sair da sua conta?");
    if (confirm) {
      await supabase.auth.signOut();
      router.push('/');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-32">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* --- SELETOR DE PERFIL --- */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Selecionar Perfil</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Card TURISTA */}
            <div
              onClick={() => switchProfile('user')}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                "hover:border-green-500 hover:bg-green-50 bg-white border-gray-200 shadow-sm hover:shadow-md"
              )}
            >
              <div className="p-3 bg-green-100 rounded-full shadow-inner">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Turista</h3>
                <p className="text-xs text-gray-500">Explorar e navegar</p>
              </div>
            </div>

            {/* Card PUBLICADOR */}
            <div
              onClick={() => hasPublisherAccess ? switchProfile('publisher') : handleBecomePublisher()}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4",
                hasPublisherAccess
                  ? "bg-white border-gray-200 hover:border-blue-500 hover:bg-blue-50 shadow-sm hover:shadow-md"
                  : "border-dashed border-gray-300 bg-gray-50 opacity-80 hover:opacity-100"
              )}
            >
              <div className={cn("p-3 rounded-full shadow-inner", hasPublisherAccess ? "bg-blue-100" : "bg-gray-200")}>
                {hasPublisherAccess ? <Briefcase className="w-6 h-6 text-blue-600" /> : <Shield className="w-6 h-6 text-gray-500" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Publicador</h3>
                <p className="text-xs text-gray-500">{hasPublisherAccess ? "Gerir minhas rotas" : "Toque para ativar"}</p>
              </div>
              {hasPublisherAccess && (
                <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 pointer-events-none">
                  Gestão
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* --- FORMULÁRIO DE DADOS --- */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Meus Dados</CardTitle>
            <CardDescription>Gerencie as suas informações pessoais.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border-2 border-gray-100 shadow-sm">
                <AvatarImage src={profile?.url_avatar || undefined} />
                <AvatarFallback className="text-xl bg-gray-100 text-gray-600">
                  {profile?.nome_completo?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">Foto de Perfil</p>
                <p className="text-xs text-gray-500">Gerido pelo sistema</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" value={user?.email || ""} disabled className="bg-gray-50 text-gray-500" />
              </div>
            </div>

            {successMessage && (
              <div className="flex items-center text-green-700 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6 bg-gray-50/30">
            <Button onClick={handleUpdateProfile} disabled={isLoading} className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white">
              {isLoading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
            </Button>
          </CardFooter>
        </Card>

        {/* --- BOTÃO DE SAIR --- */}
        <div className="pt-4">
          <Button
            variant="destructive"
            className="w-full h-12 text-base font-medium shadow-sm hover:bg-red-600"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-2" /> Sair da Conta
          </Button>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">
            RotaTur App v1.0
          </p>
        </div>
      </div>
    </div>
  )
}