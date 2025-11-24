"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setError(null)

    // --- VALIDAÇÃO ANTES DE ENVIAR ---
    if (!email || !password) {
      setError("Por favor, preencha o e-mail e a senha.")
      return
    }

    setIsLoading(true)

    try {
      // 1. Tenta fazer o login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (authError || !authData.user) {
        setError("E-mail ou senha inválidos.")
        setIsLoading(false)
        return
      }

      // 2. Busca o perfil para saber para onde redirecionar
      const { data: profileData, error: profileError } = await supabase
        .from('perfis')
        .select('tipo_perfil')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profileData) {
        setError("Erro ao carregar perfil. Contacte o suporte.")
        setIsLoading(false)
        return
      }

      // 3. Redireciona com base no perfil
      const userRole = profileData.tipo_perfil
      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else if (userRole === "publicador") {
        router.push("/publisher/dashboard")
      } else {
        router.push("/user/routes") // Turista vai direto para as rotas
      }

      // Não definimos isLoading(false) aqui porque a página vai mudar
    } catch (err) {
      console.error(err)
      setError("Ocorreu um erro inesperado.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-2">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">RotaTur</CardTitle>
          <CardDescription>A melhor viagem na palma da mão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()} // Permite dar Enter para entrar
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-base font-medium transition-all hover:shadow-md"
            disabled={isLoading} // Agora só desabilita se estiver carregando
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Entrando...
              </>
            ) : (
              "Entrar na Plataforma"
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Ainda não tem conta?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}