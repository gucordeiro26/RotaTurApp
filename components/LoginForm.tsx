"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (authError || !authData.user) {
      setError("E-mail ou senha inválidos. Tente novamente.")
      setIsLoading(false)
      return
    }

    const { data: profileData, error: profileError } = await supabase
      .from('perfis')
      .select('tipo_perfil')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profileData) {
      setError("Não foi possível encontrar o perfil do usuário.")
      setIsLoading(false)
      return
    }

    const userRole = profileData.tipo_perfil
    if (userRole === "admin") {
      router.push("/admin/dashboard")
    } else if (userRole === "publicador") {
      router.push("/publisher/dashboard")
    } else {
      router.push("/user/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">RotaTur</CardTitle>
          <CardDescription>Plataforma de Gestão de Rotas Turísticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
