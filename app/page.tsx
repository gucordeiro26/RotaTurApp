"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [userType, setUserType] = useState("")

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
            <Input id="email" type="email" placeholder="Digite seu e-mail" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="Digite sua senha" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userType">Tipo de Usuário</Label>
            <Select value={userType} onValueChange={setUserType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="publisher">Publicador de Rotas Privadas</SelectItem>
                <SelectItem value="user">Usuário Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Link
            href={
              userType === "admin"
                ? "/admin/dashboard"
                : userType === "publisher"
                  ? "/publisher/dashboard"
                  : "/user/dashboard"
            }
          >
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={!userType}>
              Entrar
            </Button>
          </Link>
          <div className="text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Cadastre-se
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
