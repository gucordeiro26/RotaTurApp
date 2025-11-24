"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, MapPin, Camera, Plus, X, Map } from "lucide-react"
import Link from "next/link"

export default function CreateRoute() {
  const [waypoints, setWaypoints] = useState(["Ponto de Partida"])
  const [images, setImages] = useState([])
  const [isPaid, setIsPaid] = useState(false)

  const addWaypoint = () => {
    setWaypoints([...waypoints, `Ponto de Parada ${waypoints.length}`])
  }

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Criar Nova Rota</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Nome da Rota</Label>
              <Input id="routeName" placeholder="Digite o nome da rota" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva sua rota..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (horas)</Label>
                <Input id="duration" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Fácil</SelectItem>
                    <SelectItem value="moderate">Moderado</SelectItem>
                    <SelectItem value="hard">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Planning */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Map className="w-5 h-5" />
              <span>Planejamento da Rota</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {waypoints.map((waypoint, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <Input
                    value={waypoint}
                    onChange={(e) => {
                      const newWaypoints = [...waypoints]
                      newWaypoints[index] = e.target.value
                      setWaypoints(newWaypoints)
                    }}
                    className="flex-1"
                  />
                  {index > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => removeWaypoint(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addWaypoint} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Ponto de Parada
            </Button>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Mapa interativo será exibido aqui</p>
              <p className="text-xs text-gray-500">Toque para adicionar pontos no mapa</p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preços e Capacidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="paid-route">Rota Paga</Label>
              <Switch id="paid-route" checked={isPaid} onCheckedChange={setIsPaid} />
            </div>
            {isPaid && (
              <div className="space-y-2">
                <Label htmlFor="price">Preço por pessoa (R$)</Label>
                <Input id="price" type="number" placeholder="25.00" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
              <Input id="maxParticipants" type="number" placeholder="20" />
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fotos e Mídia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">Adicione fotos da sua rota</p>
              <Button variant="outline" size="sm">
                Escolher Fotos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            Salvar como Rascunho
          </Button>
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Publicar Rota</Button>
        </div>
      </div>
    </div>
  )
}
