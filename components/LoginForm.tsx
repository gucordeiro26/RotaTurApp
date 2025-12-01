"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // aciona a transição após o primeiro render
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const handleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (authError || !authData.user) {
      setError("E-mail ou senha inválidos.")
      setIsLoading(false)
      return
    }

    try {
      const { data: profileData } = await supabase
        .from("perfis")
        .select("tipo_perfil")
        .eq("id", authData.user.id)
        .single()

      const userRole = profileData?.tipo_perfil

      if (userRole === "admin") {
        router.push("/admin/dashboard")
      } else if (userRole === "publicador") {
        router.push("/publisher/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    } catch {
      setError("Ocorreu um erro ao verificar seu perfil.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-6">

      <div
        // animação simples sem dependências: inicia levemente translado/opa e transita para posição normal
        className={`w-full max-w-md transform transition-all duration-400 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <Card className="rounded-2xl shadow-xl border-none backdrop-blur-sm bg-white/80">

          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
              RotaTur
            </CardTitle>
            <CardDescription className="text-gray-600">
              Acesse a plataforma de gestão turística
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium flex items-center gap-1">
                <Mail className="w-4 h-4 text-blue-600" /> E-mail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium flex items-center gap-1">
                <Lock className="w-4 h-4 text-blue-600" /> Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <p className="text-sm font-medium text-red-500 text-center">
                {error}
              </p>
            )}

            {/* Botão Entrar */}
            <Button
              onClick={handleLogin}
              className="w-full h-11 rounded-xl text-base font-medium bg-blue-600 hover:bg-blue-700 transition-all"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-gray-600 pt-1">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-blue-600 font-medium hover:underline">
                Cadastre-se
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
