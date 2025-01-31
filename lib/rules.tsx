import React, { useState, useEffect, useCallback } from "react"
import { ChessPuzzle } from "@/components/chess-puzzle"
import { GeoGuesser } from "@/components/geo-guesser"
import { MoonPhase } from "@/components/moon-phase"
import periodicTableSymbolAndMass from "@/lib/periodicTableData"
import { Sponsors } from "@/components/sponsors"
import { RefreshCw } from "lucide-react"
import { answers } from "@/lib/answers"

export interface Rule {
  id: number
  text: string
  validator: (password: string, captcha?: string) => boolean
  highlight?: (password: string, isActive: boolean) => React.ReactNode
  component?: React.FC<any>
  active: boolean
  dependencies?: number[]
}

interface CaptchaProps {
  onCaptchaGenerated: (text: string) => void
}

const CaptchaComponent: React.FC<CaptchaProps> = ({ onCaptchaGenerated }) => {
  const [captchaText, setCaptchaText] = useState("")

  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptcha()
    setCaptchaText(newCaptcha)
    onCaptchaGenerated(newCaptcha)
  }, [onCaptchaGenerated])

  useEffect(() => {
    refreshCaptcha()
  }, [refreshCaptcha])

  return (
    <div className="flex items-center justify-between mt-2">
      <div
        className="text-2xl font-bold tracking-wider text-center p-4 bg-gray-100 
                   select-none cursor-not-allowed flex-grow"
        style={{
          fontFamily: "monospace",
          background: "repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 10px, #e0e0e0 10px, #e0e0e0 20px)",
        }}
      >
        {captchaText}
      </div>
      <button
        onClick={refreshCaptcha}
        className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <RefreshCw size={24} />
      </button>
    </div>
  )
}

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
  let text = ""
  for (let i = 0; i < 6; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return text
}

const highlightNumbers = (password: string, isActive: boolean) => {
  if (!isActive || typeof password !== "string") return password
  return password.split("").map((char, i) => (
    <span key={i} className={/\d/.test(char) ? "bg-blue-200 dark:bg-blue-800" : ""}>
      {char}
    </span>
  ))
}

const highlightMonth = (password: string, isActive: boolean) => {
  if (!isActive || typeof password !== "string") return password
  const months = /January|February|March|April|May|June|July|August|September|October|November|December/gi
  const parts = password.split(months)
  const matches = password.match(months) || []

  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {matches[i] && <span className="bg-green-200 dark:bg-green-800">{matches[i]}</span>}
    </React.Fragment>
  ))
}

const highlightRomanNumerals = (password: string, isActive: boolean) => {
  if (!isActive || typeof password !== "string") return password
  const romanRegex = /M|CM|D|CD|C|XC|L|XL|X|IX|V|IV|I/g
  const parts = password.split(romanRegex)
  const matches = password.match(romanRegex) || []

  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {matches[i] && <span className="bg-yellow-200 dark:bg-yellow-800">{matches[i]}</span>}
        </React.Fragment>
      ))}
    </span>
  )
}

const highlightPeriodicElements = (password: string, isActive: boolean) => {
  if (!isActive || typeof password !== "string") return password
  const elementRegex = new RegExp(Object.keys(periodicTableSymbolAndMass).join("|"), "g")
  const parts = password.split(elementRegex)
  const matches = password.match(elementRegex) || []

  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {matches[i] && <span className="bg-purple-200 dark:bg-purple-800">{matches[i]}</span>}
    </React.Fragment>
  ))
}

export const rules: Rule[] = [
  {
    id: 1,
    text: "Your password must be at least 5 characters.",
    validator: (password) => password.length >= 5,
    active: true,
  },
  {
    id: 2,
    text: "Your password must include a number.",
    validator: (password) => /\d/.test(password),
    highlight: (password) => highlightNumbers(password, true),
    active: true,
    dependencies: [1],
  },
  {
    id: 3,
    text: "Your password must include an uppercase letter.",
    validator: (password) => /[A-Z]/.test(password),
    active: false,
    dependencies: [1, 2],
  },
  {
    id: 4,
    text: "Your password must include a special character.",
    validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
    active: false,
    dependencies: [1, 2, 3],
  },
  {
    id: 5,
    text: "The digits in your password must add up to 25.",
    validator: (password) => {
      const sum = password.match(/\d/g)?.reduce((a, b) => a + Number.parseInt(b), 0) || 0
      return sum === 25
    },
    highlight: (password) => highlightNumbers(password, true),
    active: false,
    dependencies: [1, 2, 3, 4],
  },
  {
    id: 6,
    text: "Your password must include a month of the year.",
    validator: (password) => answers.months.some((month) => password.toLowerCase().includes(month.toLowerCase())),
    highlight: (password) => highlightMonth(password, true),
    active: false,
    dependencies: [1, 2, 3, 4, 5],
  },
  {
    id: 7,
    text: "Your password must include a roman numeral.",
    validator: (password) => answers.romanNumerals.some((numeral) => password.includes(numeral)),
    highlight: (password) => highlightRomanNumerals(password, true),
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 8,
    text: "Your password must include one of our sponsors:",
    validator: (password) => answers.sponsors.some((sponsor) => password.toLowerCase().includes(sponsor)),
    component: Sponsors,
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    id: 9,
    text: "Your password must include this CAPTCHA:",
    validator: (password, captcha) => (captcha ? password.includes(captcha) : false),
    component: CaptchaComponent,
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 10,
    text: "Your password must include today's Wordle answer.",
    validator: (password) => password.toLowerCase().includes(answers.wordleAnswer.toLowerCase()),
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    id: 11,
    text: "Your password must include a two letter symbol from the periodic table.",
    validator: (password) => new RegExp(Object.keys(periodicTableSymbolAndMass).join("|")).test(password),
    highlight: (password) => highlightPeriodicElements(password, true),
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 12,
    text: "Your password must include the current phase of the moon as an emoji.",
    validator: (password) => answers.moonPhases.some((phase) => password.includes(phase)),
    component: MoonPhase,
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    id: 13,
    text: "Your password must include the name of this country.",
    validator: (password) => {
      // This will be implemented in the page component
      return false
    },
    component: GeoGuesser,
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  {
    id: 14,
    text: "Your password must include a leap year.",
    validator: (password) => {
      const years = password.match(/\d{4}/g)
      return years ? years.some((year) => answers.leapYears.includes(Number(year))) : false
    },
    highlight: (password) => {
      const regex = /\d{4}/g
      const parts = password.split(regex)
      const matches = password.match(regex) || []

      return (
        <span>
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part}
              {matches[i] && (
                <span
                  className={answers.leapYears.includes(Number(matches[i])) ? "bg-yellow-200 dark:bg-yellow-800" : ""}
                >
                  {matches[i]}
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
      )
    },
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  },
  {
    id: 15,
    text: "Your password must include the best move in algebraic chess notation.",
    validator: (password) => {
      // This will be implemented in the ChessPuzzle component
      return false
    },
    component: ChessPuzzle,
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
  {
    id: 16,
    text: "The atomic mass sum of elements in your password must be at least 200.",
    validator: (password) => {
      const elements = password.match(new RegExp(Object.keys(periodicTableSymbolAndMass).join("|"), "g")) || []
      const sum = elements.reduce((acc, element) => acc + periodicTableSymbolAndMass[element], 0)
      return sum >= 200
    },
    highlight: (password) => highlightPeriodicElements(password, true),
    active: false,
    dependencies: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  },
]

