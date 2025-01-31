"use client"

import type React from "react"
import { useState, useEffect } from "react"

export const MoonPhase: React.FC = () => {
  const [moonPhase, setMoonPhase] = useState("")

  useEffect(() => {
    const fetchMoonPhase = async () => {
      try {
        const response = await fetch("https://api.farmsense.net/v1/moonphases/?d=1684368000")
        const data = await response.json()
        const phase = data[0].Phase
        const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
        setMoonPhase(phases[Math.floor(phase / 45)])
      } catch (error) {
        console.error("Error fetching moon phase:", error)
        // Fallback to a random moon phase if API call fails
        const phases = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
        setMoonPhase(phases[Math.floor(Math.random() * phases.length)])
      }
    }

    fetchMoonPhase()
  }, [])

  return (
    <div className="text-center">
      <p>Current moon phase:</p>
      <span className="text-4xl">{moonPhase}</span>
    </div>
  )
}

