"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Search, Phone, Video, MoreVertical, Paperclip } from "lucide-react"
import Link from "next/link"

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: 1,
      user: "Alice Silva",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Que horas começa o passeio amanhã?",
      timestamp: "2 min atrás",
      unread: 2,
      route: "Caminhada pelo Centro Histórico",
    },
    {
      id: 2,
      user: "Roberto Santos",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Obrigado pelo passeio incrível!",
      timestamp: "1 hora atrás",
      unread: 0,
      route: "Trilha da Praia do Pôr do Sol",
    },
    {
      id: 3,
      user: "Carolina Oliveira",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "A rota é adequada para crianças?",
      timestamp: "3 horas atrás",
      unread: 1,
      route: "Caminhada pelo Centro Histórico",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Alice Silva",
      content: "Oi! Tenho uma reserva para a Caminhada pelo Centro Histórico de amanhã. Que horas começa?",
      timestamp: "10:30 AM",
      isOwn: false,
    },
    {
      id: 2,
      sender: "Você",
      content: "Olá Alice! O passeio começa às 14:00. Por favor, nos encontre na entrada principal da Prefeitura.",
      timestamp: "10:32 AM",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Alice Silva",
      content: "Perfeito! Devo trazer algo específico?",
      timestamp: "10:35 AM",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Você",
      content:
        "Apenas sapatos confortáveis para caminhada e uma garrafa de água. Forneceremos mapas e informações históricas.",
      timestamp: "10:37 AM",
      isOwn: true,
    },
    {
      id: 5,
      sender: "Alice Silva",
      content: "Que horas começa o passeio amanhã?",
      timestamp: "2 min atrás",
      isOwn: false,
    },
  ]

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  if (!selectedChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-3 flex items-center space-x-3">
            <Link href="/publisher/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Mensagens</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Buscar conversas..." className="pl-10" />
          </div>

          {/* Conversations List */}
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedChat(conversation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {conversation.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">{conversation.user}</h3>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                      <Badge variant="outline" className="text-xs mb-1">
                        {conversation.route}
                      </Badge>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedChat(null)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={selectedChat.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {selectedChat.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-medium text-sm">{selectedChat.user}</h2>
              <p className="text-xs text-gray-600">{selectedChat.route}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isOwn ? "bg-blue-600 text-white" : "bg-white border"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Input
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
