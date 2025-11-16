"use client"

import { Moon, Sun, Menu, X, Brain, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export default function Navbar({ isDark, setIsDark }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                chatDAWAH
              </span>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Sparkles className="w-2.5 h-2.5" />
                <span></span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="https://www.youtube.com/@themuslimlantern" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors relative group">
              The Muslim Lantern
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="https://github.com/mohammaduwaish" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Developer
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary transition-colors relative group">
              API Docs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </a>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-primary" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-muted/50 transition-all duration-200"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* YouTube Button */}
            <Button 
              className="hidden sm:inline-flex rounded-xl shadow-sm" 
              size="sm"
              onClick={() => window.open('https://www.youtube.com/@themuslimlantern', '_blank')}
            >
              Watch Debates
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
            <a href="https://www.youtube.com/@themuslimlantern" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm rounded-xl hover:bg-muted/50 transition-colors">
              The Muslim Lantern
            </a>
            <a href="https://github.com/mohammaduwaish" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm rounded-xl hover:bg-muted/50 transition-colors">
              Developer
            </a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="block px-4 py-2.5 text-sm rounded-xl hover:bg-muted/50 transition-colors">
              API Docs
            </a>
            <Button 
              className="w-full mt-2 rounded-xl" 
              size="sm"
              onClick={() => window.open('https://www.youtube.com/@themuslimlantern', '_blank')}
            >
              Watch Debates
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
