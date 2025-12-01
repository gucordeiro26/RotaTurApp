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
import { Shield, User, Save, CheckCircle, Briefcase, LogOut, Camera, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function UserProfilePage() {
  const { user, profile } = useUser()
  const router = useRouter()

  const [nome, setNome] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null)
  const [modalMessage, setModalMessage] = useState("")

  const hasPublisherAccess = profile?.tipo_perfil === "publicador" || profile?.tipo_perfil === "admin"

  useEffect(() => {
    if (profile) {
      setNome(profile.nome_completo || "")
    }
  }, [profile])

  // ------------ Modal -------------
  const confirmAction = (message: string, action: () => void) => {
    setModalMessage(message)
    setPendingAction(() => action)
    setShowConfirmModal(true)
  }

  const executePendingAction = () => {
    if (pendingAction) pendingAction()
    setShowConfirmModal(false)
  }

  // ------------ Avatar Upload -------------
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) return

    setIsUploading(true)
    const file = event.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    try {
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('perfis')
        .update({ url_avatar: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      window.location.reload()
    } catch (error: any) {
      alert('Erro ao atualizar foto: ' + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  // ------------ Atualizar Perfil -------------
  const handleUpdateProfile = async () => {
    if (!user) return
    setIsLoading(true)
    setSuccessMessage("")

    try {
      const { error } = await supabase
        .from("perfis")
        .update({ nome_completo: nome })
        .eq("id", user.id)

      if (error) throw error

      setSuccessMessage("Perfil atualizado com sucesso!")
      setTimeout(() => window.location.reload(), 1500)
    } catch (error: any) {
      alert(`Erro ao atualizar: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // ------------ Trocar Perfil -------------
  const switchProfile = (target: "user" | "publisher") => {
    confirmAction(
      "Deseja realmente trocar de perfil?",
      () => {
        if (target === "publisher") router.push("/publisher/dashboard")
        else router.push("/user/dashboard")
      }
    )
  }

  const handleBecomePublisher = async () => {
    confirmAction("Ativar modo Publicador?", async () => {
      if (!user) return
      await supabase.from("perfis").update({ tipo_perfil: "publicador" }).eq("id", user.id)
      window.location.reload()
    })
  }

  // ------------ Logout -------------
  const handleLogout = () => {
    confirmAction("Deseja realmente sair da sua conta?", async () => {
      await supabase.auth.signOut()
      router.push("/")
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 pb-32">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* --- FORM DE DADOS --- */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Meus Dados</CardTitle>
            <CardDescription>Atualize suas informações e foto de perfil.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* AVATAR */}
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={profile?.url_avatar || undefined} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-gray-100 text-gray-600">
                    {profile?.nome_completo?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                </label>

                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900">Foto de Perfil</p>
                <p className="text-xs text-gray-500 mb-2">Clique na imagem para alterar.</p>
                <Label htmlFor="avatar-upload" className="cursor-pointer text-xs text-blue-600 hover:underline">
                  {isUploading ? "Enviando..." : "Carregar nova foto"}
                </Label>
              </div>
            </div>

            {/* CAMPOS */}
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-white" />
              </div>

              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input disabled value={user?.email || ""} className="bg-gray-100" />
              </div>
            </div>

            {successMessage && (
              <div className="flex items-center text-green-700 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-6 bg-gray-50">
            <Button
              onClick={handleUpdateProfile}
              disabled={isLoading}
              className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white"
            >
              <Save className="w-4 h-4 mr-2" /> {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>

        {/* ---- SELECIONAR PERFIL ---- */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Selecionar Perfil</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Turista */}
            <div
              onClick={() => switchProfile("user")}
              className="p-4 rounded-xl border-2 bg-white hover:border-green-500 hover:bg-green-50 shadow-sm cursor-pointer flex gap-4 items-center"
            >
              <User className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold">Turista</h3>
                <p className="text-xs text-gray-500">Explorar e navegar</p>
              </div>
            </div>

            {/* Publicador */}
            <div
              onClick={() =>
                hasPublisherAccess ? switchProfile("publisher") : handleBecomePublisher()
              }
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer flex gap-4 items-center shadow-sm",
                hasPublisherAccess
                  ? "bg-white hover:border-blue-500 hover:bg-blue-50"
                  : "border-dashed bg-gray-100 opacity-80 hover:opacity-100"
              )}
            >
              {hasPublisherAccess ? (
                <Briefcase className="w-6 h-6 text-blue-600" />
              ) : (
                <Shield className="w-6 h-6 text-gray-500" />
              )}

              <div>
                <h3 className="font-bold">Publicador</h3>
                <p className="text-xs text-gray-500">
                  {hasPublisherAccess ? "Gerir minhas rotas" : "Toque para ativar"}
                </p>
              </div>

              {hasPublisherAccess && (
                <Badge className="ml-auto bg-blue-100 text-blue-700">Gestão</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12 text-base"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" /> Sair
        </Button>

        <p className="text-center text-xs text-gray-400">RotaTur App v1.0</p>
      </div>

      {/* ---------------- MODAL ---------------- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg animate-fade-in">
            <h2 className="text-lg font-semibold mb-2">Confirmar ação</h2>
            <p className="text-sm text-gray-600 mb-6">{modalMessage}</p>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>

              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={executePendingAction}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
