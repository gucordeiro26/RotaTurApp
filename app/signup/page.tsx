"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
      setTimeout(() => {
        router.push('/')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Header content if needed */}
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center">
              <div className="mb-4 text-green-600 font-medium">
                Conta criada com sucesso!
              </div>
              <div className="text-gray-600 mb-4">
                Redirecionando para a página de login...
              </div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input 
                  id="fullName" 
                  value={nomeCompleto} 
                  onChange={(e) => setNomeCompleto(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userType">Eu sou</Label>
                <Select value={tipoPerfil} onValueChange={setTipoPerfil}>
                  <SelectTrigger id="userType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usuario">Um Viajante (Usuário)</SelectItem>
                    <SelectItem value="publicador">Um Guia (Publicador)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
              )}

              <Button 
                onClick={handleSignUp} 
                className="w-full" 
                disabled={isLoading}
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