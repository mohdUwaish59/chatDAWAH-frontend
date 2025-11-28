"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  BookOpen, 
  Sparkles,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { queryChat, type ContextItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  liked?: boolean
  disliked?: boolean
  sources?: ContextItem[]
  copied?: boolean
}

export default function ChatInterface() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your RAG-powered AI assistant. I can answer questions based on my knowledge base. Ask me anything!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<string[]>(["Current Chat"])
  const [showSources, setShowSources] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userInput = input.trim()

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call backend API - top_k will be fetched from backend config automatically
      const response = await queryChat(userInput)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        sources: response.context,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error querying chatbot:", error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure the backend server is running.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
      
      toast({
        title: "Error",
        description: "Failed to get response from the chatbot. Please check if the backend is running.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, copied: true } : msg
      )
    )
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, copied: false } : msg
        )
      )
    }, 2000)
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    })
  }

  const toggleMessageReaction = (id: string, type: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              liked: type === "like" ? !msg.liked : false,
              disliked: type === "dislike" ? !msg.disliked : false,
            }
          : msg,
      ),
    )
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. How can I help you today? Feel free to ask me anything—from coding questions to creative writing, research, analysis, and much more.",
        timestamp: new Date(),
      },
    ])
  }

  const newChat = () => {
    const timestamp = new Date().toLocaleTimeString()
    setConversations((prev) => [`Chat ${timestamp}`, ...prev])
    clearChat()
  }

  return (
    <div className="flex h-[calc(100vh-4rem-4rem)] bg-background">
      {/* Sidebar - Conversations */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card p-4 gap-4">
        <Button onClick={newChat} variant="outline" className="w-full justify-start gap-2 text-primary bg-transparent">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {conversations.map((conv, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors truncate ${
                idx === 0 ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {conv}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10"
          onClick={clearChat}
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 animate-in fade-in-50 duration-300 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-sm">AI</span>
                </div>
              )}

              <div
                className={`max-w-2xl rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

                {message.role === "assistant" && (
                  <>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <button
                          onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          {showSources === message.id ? "Hide" : "Show"} {message.sources.length} sources
                        </button>
                        
                        {showSources === message.id && (
                          <div className="mt-2 space-y-2">
                            {message.sources.map((source, idx) => (
                              <div key={idx} className="text-xs p-2 bg-muted/50 rounded border-l-2 border-primary">
                                <div className="font-medium text-foreground mb-1">
                                  {idx + 1}. {source.instruction}
                                </div>
                                <div className="text-muted-foreground text-[10px]">
                                  Similarity: {(source.similarity * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50 justify-between items-center">
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggleMessageReaction(message.id, "like")}
                          className={`p-1 rounded hover:bg-muted transition-colors ${
                            message.liked ? "text-primary" : "text-muted-foreground"
                          }`}
                          title="Like this response"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleMessageReaction(message.id, "dislike")}
                          className={`p-1 rounded hover:bg-muted transition-colors ${
                            message.disliked ? "text-destructive" : "text-muted-foreground"
                          }`}
                          title="Dislike this response"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => copyMessage(message.content)}
                        className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground"
                        title="Copy message"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-accent-foreground font-bold text-sm">You</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">AI</span>
              </div>
              <div className="bg-card border border-border rounded-lg px-4 py-3 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-background p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 rounded-lg bg-card border-border"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-lg gap-2">
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              ChatAI can make mistakes. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
