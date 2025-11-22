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
  Loader2,
  MessageSquare,
  Brain
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { queryChat, type ContextItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import MarkdownRenderer from "@/components/markdown-renderer"

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

export default function ChatInterfaceEnhanced() {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "👋 Salam!  I will provide detailed answers to your questions. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<string[]>(["Current Chat"])
  const [showSources, setShowSources] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userInput = input.trim()
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
      const response = await queryChat(userInput, 5)
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
        content: `⚠️ I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure the backend server is running.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      toast({
        title: "Connection Error",
        description: "Failed to reach the AI backend. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content)
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, copied: true } : msg))
    )
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, copied: false } : msg))
      )
    }, 2000)
    toast({
      title: "✓ Copied!",
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
          : msg
      )
    )
  }

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "👋 Hello! I'm Dawah AI assistant. Ready to help with your questions!",
        timestamp: new Date(),
      },
    ])
  }

  const newChat = () => {
    const timestamp = new Date().toLocaleTimeString()
    setConversations((prev) => [`Chat ${timestamp}`, ...prev])
    clearChat()
  }

  const suggestedQuestions = [
    "What is the evidence for God?",
    "Explain the burden of proof",
    "Is Jesus God in Islam?",
    "What are the prophecies of Muhammad(pbuh)?"
  ]

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm p-4 gap-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="flex items-center gap-2 px-2 py-1">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-sm">Conversations</h2>
        </div>

        <Button
          onClick={newChat}
          variant="outline"
          className="w-full justify-start gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-1.5">
          {conversations.map((conv, idx) => (
            <button
              key={idx}
              className={cn(
                "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 truncate text-sm",
                idx === 0
                  ? "bg-primary/10 text-primary font-medium shadow-sm"
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 inline mr-2" />
              {conv}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={clearChat}
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </Button>
      </aside>

      {/* Enhanced Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 p-4 lg:p-8 space-y-6 max-w-5xl mx-auto w-full pb-32">
          {messages.length === 1 && (
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Feeling confused about Islam?</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ask me your questions. I'm here to provide you reliable answers.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mt-8">
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="p-4 text-left rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                  >
                    <p className="text-sm text-foreground group-hover:text-primary transition-colors">
                      {question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-500",
                message.role === "user" ? "justify-end" : "justify-start",
                index === 0 && messages.length > 1 && "hidden"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-3xl rounded-2xl px-5 py-4 shadow-sm",
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                    : "bg-card border border-border/50 text-foreground"
                )}
              >
                {message.role === "assistant" ? (
                  <div className="text-sm leading-relaxed markdown-content">
                    <MarkdownRenderer content={message.content} />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                )}

                {message.role === "assistant" && (
                  <>
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <button
                          onClick={() => setShowSources(showSources === message.id ? null : message.id)}
                          className="flex items-center gap-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {showSources === message.id ? "Hide" : "View"} {message.sources.length} sources
                        </button>

                        {showSources === message.id && (
                          <div className="mt-3 space-y-2">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-3 bg-muted/30 rounded-lg border-l-2 border-primary/50 hover:bg-muted/50 transition-colors"
                              >
                                <div className="font-medium text-foreground mb-1.5 flex items-start gap-2">
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex-shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="flex-1">{source.instruction}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground ml-7">
                                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-primary/50 rounded-full transition-all duration-500"
                                      style={{ width: `${source.similarity * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-medium">
                                    {(source.similarity * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-1.5 mt-4 pt-3 border-t border-border/50">
                      <button
                        onClick={() => toggleMessageReaction(message.id, "like")}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted/50 transition-all duration-200",
                          message.liked ? "text-primary bg-primary/10" : "text-muted-foreground"
                        )}
                        title="Like this response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleMessageReaction(message.id, "dislike")}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted/50 transition-all duration-200",
                          message.disliked ? "text-destructive bg-destructive/10" : "text-muted-foreground"
                        )}
                        title="Dislike this response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => copyMessage(message.content, message.id)}
                        className={cn(
                          "p-2 rounded-lg hover:bg-muted/50 transition-all duration-200 ml-auto",
                          message.copied ? "text-primary" : "text-muted-foreground"
                        )}
                        title="Copy message"
                      >
                        {message.copied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-accent-foreground font-bold text-sm">You</span>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
              <div className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex gap-2 items-center shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
                <span className="text-sm text-muted-foreground ml-2">Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 border-t border-border/50 bg-card/95 backdrop-blur-md p-4 lg:p-6 shadow-lg z-40">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full rounded-xl bg-background border-border/50 pr-12 py-6 text-sm focus-visible:ring-primary/50 shadow-sm"
                  disabled={isLoading}
                />
                {input && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {input.length}
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-xl px-6 py-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Send</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 space-y-2">
              <Alert className="border-yellow-500/50 bg-yellow-500/5">
                <AlertCircle className="text-yellow-600" />
                <AlertDescription className="text-yellow-700 dark:text-yellow-500">
                  First message may take longer as the backend wakes up from sleep (free tier hosting).
                </AlertDescription>
              </Alert>
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3 h-3" />
                AI can make mistakes. Verify important information with sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
