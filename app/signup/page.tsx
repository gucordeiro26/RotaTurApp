"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

export default function SignupPage() {
  const [nomeCompleto, setNomeCompleto] = useState("") // Novo estado
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("") // Novo estado
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async () => {
    // Validação de senha
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }
    
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Aqui enviamos os dados extras que o nosso gatilho vai usar
        data: {
          nome_completo: nomeCompleto,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      // Lembre-se que desativamos a verificação de e-mail para testes.
      // Em produção, a mensagem seria sobre verificar o e-mail.
      setSuccess("Conta criada com sucesso! Você já pode fazer o login.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Criar Conta</CardTitle>
          <CardDescription>Junte-se ao RotaTur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
              <p>{success}</p>
              <Link href="/" className="text-blue-600 hover:underline mt-4 block">
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <>
              {/* NOVO CAMPO: NOME COMPLETO */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                />
              </div>

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
                  placeholder="Crie uma senha forte (mín. 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {/* NOVO CAMPO: CONFIRMAR SENHA */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-sm font-medium text-red-500">{error}</p>}

              <Button
                onClick={handleSignUp}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading || !email || !password || !nomeCompleto}
              >
                {isLoading ? "Criando conta..." : "Cadastrar"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link href="/" className="text-blue-600 hover:underline">
                  Faça login
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}