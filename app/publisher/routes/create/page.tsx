"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, Camera, Plus, X, Map, Info, Upload, Eye, Save, Send } from "lucide-react"
import Link from "next/link"

export default function CreateRoute() {
  const [activeTab, setActiveTab] = useState("basic")
  const [waypoints, setWaypoints] = useState(["Ponto de Partida"])
  const [images, setImages] = useState([])
  const [isPaid, setIsPaid] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [instantBooking, setInstantBooking] = useState(true)
  const [autoConfirm, setAutoConfirm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "história", // Updated default value
    duration: "",
    difficulty: "",
    maxParticipants: "",
    minParticipants: "1",
    price: "",
    currency: "BRL",
    language: "pt",
    meetingPoint: "",
    endPoint: "",
    included: [],
    notIncluded: [],
    requirements: [],
    cancellationPolicy: "24h",
    ageRestriction: "",
    accessibility: false,
    weatherDependent: false,
  })

  const [includedItems, setIncludedItems] = useState(["Guia turístico profissional", "Mapas e materiais informativos"])
  const [notIncludedItems, setNotIncludedItems] = useState(["Transporte até o ponto de encontro", "Alimentação"])
  const [requirements, setRequirements] = useState(["Sapatos confortáveis para caminhada"])

  const addWaypoint = () => {
    setWaypoints([...waypoints, `Ponto de Parada ${waypoints.length}`])
  }

  const removeWaypoint = (index) => {
    if (waypoints.length > 1) {
      setWaypoints(waypoints.filter((_, i) => i !== index))
    }
  }

  const updateWaypoint = (index, value) => {
    const newWaypoints = [...waypoints]
    newWaypoints[index] = value
    setWaypoints(newWaypoints)
  }

  const addIncludedItem = () => {
    setIncludedItems([...includedItems, ""])
  }

  const removeIncludedItem = (index) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index))
  }

  const updateIncludedItem = (index, value) => {
    const newItems = [...includedItems]
    newItems[index] = value
    setIncludedItems(newItems)
  }

  const addNotIncludedItem = () => {
    setNotIncludedItems([...notIncludedItems, ""])
  }

  const removeNotIncludedItem = (index) => {
    setNotIncludedItems(notIncludedItems.filter((_, i) => i !== index))
  }

  const updateNotIncludedItem = (index, value) => {
    const newItems = [...notIncludedItems]
    newItems[index] = value
    setNotIncludedItems(newItems)
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const removeRequirement = (index) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const updateRequirement = (index, value) => {
    const newItems = [...requirements]
    newItems[index] = value
    setRequirements(newItems)
  }

  const categories = [
    "História",
    "Natureza",
    "Gastronomia",
    "Aventura",
    "Urbano",
    "Fotografia",
    "Cultural",
    "Religioso",
    "Esportivo",
    "Familiar",
  ]

  const difficulties = [
    { value: "easy", label: "Fácil", description: "Adequado para todas as idades" },
    { value: "moderate", label: "Moderado", description: "Requer condicionamento básico" },
    { value: "hard", label: "Difícil", description: "Requer boa condição física" },
    { value: "extreme", label: "Extremo", description: "Apenas para experientes" },
  ]

  const languages = [
    { value: "pt", label: "Português" },
    { value: "en", label: "Inglês" },
    { value: "es", label: "Espanhol" },
    { value: "fr", label: "Francês" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/publisher/routes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Criar Nova Rota</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="route">Rota</TabsTrigger>
            <TabsTrigger value="pricing">Preços</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routeName">Nome da Rota *</Label>
                  <Input
                    id="routeName"
                    placeholder="Ex: Caminhada pelo Centro Histórico"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Descrição Curta *</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Resumo em uma linha para atrair visitantes"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Máximo 100 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva sua rota em detalhes, o que os visitantes vão ver e experimentar..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma Principal</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração *</Label>
                    <Select
                      value={formData.duration}
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hora</SelectItem>
                        <SelectItem value="1.5h">1,5 horas</SelectItem>
                        <SelectItem value="2h">2 horas</SelectItem>
                        <SelectItem value="2.5h">2,5 horas</SelectItem>
                        <SelectItem value="3h">3 horas</SelectItem>
                        <SelectItem value="4h">4 horas</SelectItem>
                        <SelectItem value="6h">6 horas</SelectItem>
                        <SelectItem value="8h">Dia inteiro</SelectItem>
                        <SelectItem value="custom">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Nível de Dificuldade *</Label>
                    <Select
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((diff) => (
                          <SelectItem key={diff.value} value={diff.value}>
                            <div>
                              <div className="font-medium">{diff.label}</div>
                              <div className="text-xs text-gray-500">{diff.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fotos e Mídia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">Adicione fotos atrativas da sua rota</p>
                    <p className="text-xs text-gray-500 mb-4">Primeira foto será a capa. Máximo 10 fotos.</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Escolher Fotos
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Camera className="w-6 h-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Planning Tab */}
          <TabsContent value="route" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Map className="w-5 h-5" />
                  <span>Planejamento da Rota</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meetingPoint">Ponto de Encontro *</Label>
                    <Input
                      id="meetingPoint"
                      placeholder="Ex: Entrada principal da Prefeitura"
                      value={formData.meetingPoint}
                      onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endPoint">Ponto Final</Label>
                    <Input
                      id="endPoint"
                      placeholder="Ex: Parque Central (deixe vazio se for o mesmo ponto)"
                      value={formData.endPoint}
                      onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Pontos de Parada da Rota</Label>
                  {waypoints.map((waypoint, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <Input
                        value={waypoint}
                        onChange={(e) => updateWaypoint(index, e.target.value)}
                        className="flex-1"
                        placeholder={`Ponto ${index + 1}`}
                      />
                      {waypoints.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeWaypoint(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addWaypoint} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Ponto de Parada
                  </Button>
                </div>

                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Mapa interativo da rota</p>
                  <p className="text-xs text-gray-500 mb-3">Clique no mapa para adicionar pontos</p>
                  <Button variant="outline" size="sm">
                    <Map className="w-4 h-4 mr-2" />
                    Abrir Editor de Mapa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preços e Capacidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paid-route">Rota Paga</Label>
                    <p className="text-xs text-gray-500">Cobrará dos participantes</p>
                  </div>
                  <Switch id="paid-route" checked={isPaid} onCheckedChange={setIsPaid} />
                </div>

                {isPaid && (
                  <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Preço por Pessoa *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                          <Input
                            id="price"
                            type="number"
                            placeholder="25.00"
                            className="pl-8"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Moeda</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => setFormData({ ...formData, currency: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Real (R$)</SelectItem>
                            <SelectItem value="USD">Dólar ($)</SelectItem>
                            <SelectItem value="EUR">Euro (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Política de Cancelamento</Label>
                      <Select
                        value={formData.cancellationPolicy}
                        onValueChange={(value) => setFormData({ ...formData, cancellationPolicy: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">Cancelamento gratuito até 24h antes</SelectItem>
                          <SelectItem value="48h">Cancelamento gratuito até 48h antes</SelectItem>
                          <SelectItem value="72h">Cancelamento gratuito até 72h antes</SelectItem>
                          <SelectItem value="7d">Cancelamento gratuito até 7 dias antes</SelectItem>
                          <SelectItem value="no-refund">Sem reembolso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minParticipants">Mínimo de Participantes</Label>
                    <Input
                      id="minParticipants"
                      type="number"
                      placeholder="1"
                      value={formData.minParticipants}
                      onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Máximo de Participantes *</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      placeholder="20"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Reserva Instantânea</Label>
                      <p className="text-xs text-gray-500">Clientes podem reservar sem aprovação</p>
                    </div>
                    <Switch checked={instantBooking} onCheckedChange={setInstantBooking} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Confirmação Automática</Label>
                      <p className="text-xs text-gray-500">Confirma automaticamente após pagamento</p>
                    </div>
                    <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que está Incluído</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {includedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                    <Input
                      value={item}
                      onChange={(e) => updateIncludedItem(index, e.target.value)}
                      className="flex-1"
                      placeholder="Ex: Guia turístico profissional"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeIncludedItem(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addIncludedItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item Incluído
                </Button>
              </CardContent>
            </Card>

            {/* What's Not Included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">O que NÃO está Incluído</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notIncludedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                    <Input
                      value={item}
                      onChange={(e) => updateNotIncludedItem(index, e.target.value)}
                      className="flex-1"
                      placeholder="Ex: Transporte até o local"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeNotIncludedItem(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addNotIncludedItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item Não Incluído
                </Button>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requisitos e Recomendações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      className="flex-1"
                      placeholder="Ex: Sapatos confortáveis"
                    />
                    <Button variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addRequirement} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Requisito
                </Button>
              </CardContent>
            </Card>

            {/* Additional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ageRestriction">Restrição de Idade</Label>
                  <Select
                    value={formData.ageRestriction}
                    onValueChange={(value) => setFormData({ ...formData, ageRestriction: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sem restrição</SelectItem>
                      <SelectItem value="18+">Apenas adultos (18+)</SelectItem>
                      <SelectItem value="16+">16 anos ou mais</SelectItem>
                      <SelectItem value="12+">12 anos ou mais</SelectItem>
                      <SelectItem value="family">Adequado para famílias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Acessível para Pessoas com Deficiência</Label>
                      <p className="text-xs text-gray-500">Rota adaptada para cadeirantes</p>
                    </div>
                    <Switch
                      checked={formData.accessibility}
                      onCheckedChange={(value) => setFormData({ ...formData, accessibility: value })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Dependente do Clima</Label>
                      <p className="text-xs text-gray-500">Pode ser cancelada por condições climáticas</p>
                    </div>
                    <Switch
                      checked={formData.weatherDependent}
                      onCheckedChange={(value) => setFormData({ ...formData, weatherDependent: value })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Rota Privada</Label>
                      <p className="text-xs text-gray-500">Visível apenas para convidados</p>
                    </div>
                    <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" />
            Publicar Rota
          </Button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">Ao publicar, sua rota ficará visível para todos os usuários</p>
        </div>
      </div>
    </div>
  )
}
