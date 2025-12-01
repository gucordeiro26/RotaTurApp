"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Lock, MapPin } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [nomeCompleto, setNomeCompleto] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [tipoPerfil, setTipoPerfil] = useState("usuario")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nome_completo: nomeCompleto,
          tipo_perfil: tipoPerfil,
        },
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      setSuccess(true)
      setIsLoading(false)
      setTimeout(() => router.push('/'), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-6">

      <div
        className={`w-full max-w-md transform transition-all duration-400 ease-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <Card className="rounded-2xl shadow-xl border-none backdrop-blur-sm bg-white/80">

          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
              Criar Conta
            </CardTitle>

            <CardDescription className="text-gray-600">
              Junte-se ao RotaTur e explore o turismo regional
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">

            {success ? (
              <div className="text-center py-6">
                <p className="text-green-600 font-medium mb-2">
                  Conta criada com sucesso!
                </p>
                <p className="text-gray-600 mb-4">
                  Redirecionando para o login...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : (
              <>
                {/* Nome completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-medium flex items-center gap-1">
                    <User className="w-4 h-4 text-blue-600" /> Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Digite seu Nome"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium flex items-center gap-1">
                    <Mail className="w-4 h-4 text-blue-600" /> E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tipo de Perfil */}
                <div className="space-y-2">
                  <Label htmlFor="userType" className="font-medium">Eu sou</Label>
                  <Select value={tipoPerfil} onValueChange={setTipoPerfil}>
                    <SelectTrigger id="userType" className="h-11 rounded-xl shadow-sm px-4">
                      <SelectValue placeholder="Gostaria de Começar como..." />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="usuario">Um Viajante (Usuário)</SelectItem>
                      <SelectItem value="publicador">Um Guia (Publicador)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-medium flex items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-600" /> Senha
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite uma Boa Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="font-medium flex items-center gap-1">
                    <Lock className="w-4 h-4 text-blue-600" /> Confirmar Senha
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Digite a Senha Novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 rounded-xl px-4 shadow-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Erro */}
                {error && (
                  <p className="text-sm font-medium text-red-500 text-center">
                    {error}
                  </p>
                )}

                {/* Botão */}
                <Button
                  onClick={handleSignUp}
                  className="w-full h-11 rounded-xl text-base font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Cadastrar"}
                </Button>

                <div className="text-center text-sm text-gray-600 pt-1">
                  Já possui uma conta?{" "}
                  <Link href="/" className="text-blue-600 font-medium hover:underline">
                    Fazer login
                  </Link>
                </div>
              </>
            )}

          </CardContent>
        </Card>
      </div>

    </div>
  )
}