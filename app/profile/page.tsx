"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield, Save, CheckCircle } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useUser()
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [successType, setSuccessType] = useState<'name' | 'publisher' | ''>('')

  useEffect(() => {
    if (profile) {
      setNome(profile.nome_completo || "")
    }
  }, [profile])

  const handleUpdateProfile = async () => {
    if (!user) return
    setIsLoading(true)
    setSuccessMessage("")
    setSuccessType('')

    try {
      const { error } = await supabase
        .from('perfis')
        .update({ nome_completo: nome })
        .eq('id', user.id)

      if (error) {
        alert("Erro ao atualizar perfil: " + error.message)
        setIsLoading(false)
        return
      }

      setSuccessMessage("✓ Perfil atualizado com sucesso!")
      setSuccessType('name')
      
      // Atualizar o contexto
      await refreshProfile()
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setSuccessMessage("")
        setSuccessType('')
        setIsLoading(false)
      }, 3000)
    } catch (err) {
      console.error("Erro:", err)
      alert("Erro ao atualizar perfil.")
      setIsLoading(false)
    }
  }

  const handleBecomePublisher = async () => {
    if (!user) return
    const confirm = window.confirm("Ao tornar-se Publicador, você ganhará acesso ao painel para criar e gerir as suas próprias rotas turísticas, mantendo todas as funcionalidades de Turista. Deseja continuar?")
    
    if (confirm) {
      setIsLoading(true)
      try {
        const { error } = await supabase
          .from('perfis')
          .update({ tipo_perfil: 'publicador' })
          .eq('id', user.id)

        if (error) {
          alert("Erro ao atualizar permissões: " + error.message)
          setIsLoading(false)
          return
        }

        setSuccessMessage("✓ Parabéns! Agora você é um Publicador. Redirecionando...")
        setSuccessType('publisher')
        
        // Atualizar o contexto e aguardar
        await refreshProfile()
        
        // Redirecionar para o publisher dashboard após um pequeno delay
        setTimeout(() => {
          router.push('/publisher/dashboard')
        }, 1500)
      } catch (err) {
        console.error("Erro:", err)
        alert("Erro ao atualizar permissões.")
        setIsLoading(false)
      }
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-20">
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
              <div className={`flex items-center text-sm p-3 rounded-md ${
                successType === 'publisher' 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-green-600 bg-green-50'
              }`}>
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button onClick={handleUpdateProfile} disabled={isLoading}>
              {isLoading ? "Salvando..." : <><Save className="w-4 h-4 mr-2" /> Salvar Alterações</>}
            </Button>
          </CardFooter>
        </Card>

        {/* Cartão de Tipo de Conta - Opções de Perfil */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2 text-blue-700">
              <Shield className="w-6 h-6" />
              <div>
                <CardTitle className="text-xl">Tipo de Perfil</CardTitle>
                <CardDescription className="text-blue-600 text-xs mt-1">
                  Escolha como deseja utilizar a plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Opção 1: Usuário Turista */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition">
              <div>
                <p className="font-medium text-sm">👤 Usuário Turista</p>
                <p className="text-xs text-gray-600 mt-1">Explorar rotas, adicionar favoritos e abrir no mapa</p>
              </div>
              {profile?.tipo_perfil === 'usuario' ? (
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Voltar ao perfil de Usuário?")) {
                      setIsLoading(true);
                      supabase
                        .from('perfis')
                        .update({ tipo_perfil: 'usuario' })
                        .eq('id', user?.id)
                        .then(() => {
                          refreshProfile();
                          setTimeout(() => {
                            router.push('/user/dashboard');
                          }, 500);
                        });
                    }
                  }}
                  disabled={isLoading}
                >
                  Mudar
                </Button>
              )}
            </div>

            {/* Opção 2: Publicador */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition">
              <div>
                <p className="font-medium text-sm">📢 Publicador</p>
                <p className="text-xs text-gray-600 mt-1">Criar e gerir rotas + tudo de Usuário Turista</p>
              </div>
              {profile?.tipo_perfil === 'publicador' ? (
                <Badge className="bg-green-100 text-green-800">Ativo</Badge>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBecomePublisher}
                  disabled={isLoading}
                >
                  Ativar
                </Button>
              )}
            </div>

            {/* Opção 3: Admin - Info apenas (não permite mudança) */}
            {profile?.tipo_perfil === 'admin' && (
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-300">
                <div>
                  <p className="font-medium text-sm">👨‍💼 Administrador</p>
                  <p className="text-xs text-gray-600 mt-1">Acesso completo: gerir utilizadores, rotas e tudo mais</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Ativo</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Visual do Perfil Atual */}
        <div className="flex justify-center mt-8">
          <div className="text-center px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600">Seu Perfil Atual:</p>
            <p className="text-2xl font-bold text-blue-600 capitalize mt-1">{profile?.tipo_perfil}</p>
            <p className="text-xs text-gray-500 mt-2">
              {profile?.tipo_perfil === 'usuario' && 'Explorar rotas, favoritar e abrir no mapa'}
              {profile?.tipo_perfil === 'publicador' && 'Criar rotas + todas as funcionalidades de usuário'}
              {profile?.tipo_perfil === 'admin' && 'Gerenciar tudo: usuários, rotas e sistema'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
