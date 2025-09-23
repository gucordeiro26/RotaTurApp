"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, Star, CreditCard, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [participants, setParticipants] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")

  const route = {
    id: 1,
    name: "Caminhada pelo Centro Histórico",
    publisher: "Tours da Cidade",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviews: 156,
    price: 25,
    duration: "2h",
    difficulty: "Fácil",
    maxParticipants: 30,
    location: "Centro da Cidade",
    description: "Explore a rica história do nosso centro com guias especializados.",
  }

  const availableDates = ["2024-01-25", "2024-01-26", "2024-01-27", "2024-01-28", "2024-01-29"]

  const availableTimes = ["09:00", "14:00", "16:00"]

  const totalPrice = route.price * participants
  const serviceFee = Math.round(totalPrice * 0.1)
  const finalPrice = totalPrice + serviceFee

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/user/routes">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Fazer Reserva</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-20">
        {/* Route Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <img
                src={route.image || "/placeholder.svg"}
                alt={route.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{route.name}</h3>
                <p className="text-xs text-gray-600 mb-1">por {route.publisher}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{route.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{route.duration}</span>
                  </div>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {route.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{route.location}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">R$ {route.price}</p>
                <p className="text-xs text-gray-500">por pessoa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes da Reserva</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Data da Atividade</Label>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma data" />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Participants */}
            <div className="space-y-2">
              <Label>Número de Participantes</Label>
              <Select
                value={participants.toString()}
                onValueChange={(value) => setParticipants(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "pessoa" : "pessoas"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Requests */}
            <div className="space-y-2">
              <Label>Solicitações Especiais (Opcional)</Label>
              <Textarea
                placeholder="Alguma necessidade especial, restrição alimentar, etc..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label>Sobrenome</Label>
                <Input placeholder="Seu sobrenome" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input type="email" placeholder="seu@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(11) 99999-9999" />
            </div>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>
                R$ {route.price} x {participants} pessoa(s)
              </span>
              <span>R$ {totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de serviço</span>
              <span>R$ {serviceFee}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-green-600">R$ {finalPrice}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Método de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cartão de Crédito</Label>
              <Input placeholder="Número do cartão" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input placeholder="MM/AA" />
              </div>
              <div className="space-y-2">
                <Label>CVV</Label>
                <Input placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Nome no Cartão</Label>
              <Input placeholder="Nome como aparece no cartão" />
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pagamento Seguro</p>
                <p className="text-xs text-blue-600">Seus dados estão protegidos com criptografia SSL</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Button */}
        <Button
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-semibold"
          disabled={!selectedDate || !selectedTime}
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Confirmar Reserva - R$ {finalPrice}
        </Button>

        {/* Cancellation Policy */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium text-sm mb-2">Política de Cancelamento</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Cancelamento gratuito até 24h antes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Reembolso total em caso de cancelamento pelo organizador</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Reagendamento gratuito sujeito à disponibilidade</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
