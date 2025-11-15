"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import ChatInterfaceEnhanced from "@/components/chat-interface-enhanced"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  return (
    <ThemeProvider defaultTheme={isDark ? "dark" : "light"}>
      <div className={isDark ? "dark" : ""}>
        <div className="bg-background">
          <Navbar isDark={isDark} setIsDark={setIsDark} />
          <main>
            <ChatInterfaceEnhanced />
          </main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  )
}
