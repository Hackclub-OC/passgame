"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { rules, type Rule } from "@/lib/rules"
import Link from "next/link"

export default function Home() {
  const [password, setPassword] = useState<string>("")
  const [activeRules, setActiveRules] = useState<Rule[]>([])
  const [completedRules, setCompletedRules] = useState<Rule[]>([])
  const [captchaText, setCaptchaText] = useState("")
  const [countryName, setCountryName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleCaptchaGenerated = useCallback((text: string) => {
    setCaptchaText(text)
  }, [])

  const handleCountryChange = useCallback((country: string) => {
    setCountryName(country)
  }, [])

  useEffect(() => {
    const newActiveRules: Rule[] = []
    const newCompletedRules: Rule[] = []

    rules.forEach((rule, index) => {
      let isValid = false
      if (rule.id === 9) {
        isValid = rule.validator(password, captchaText)
      } else if (rule.id === 13) {
        isValid = countryName && password.toLowerCase().includes(countryName.toLowerCase())
      } else {
        isValid = rule.validator(password)
      }

      if (index < 3 || (index > 0 && newCompletedRules.includes(rules[index - 1]))) {
        if (isValid) {
          newCompletedRules.push(rule)
        } else {
          newActiveRules.push(rule)
        }
      }
    })

    setActiveRules(newActiveRules)
    setCompletedRules(newCompletedRules)
  }, [password, captchaText, countryName])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value || "")
  }

  const renderHighlightedPassword = () => {
    if (!password) return null
    return activeRules.concat(completedRules).reduce((result, rule) => {
      if (rule.highlight) {
        return rule.highlight(result, true)
      }
      return result
    }, password)
  }

  return (
    <main className="min-h-screen bg-[#E6F3FF] flex flex-col items-center pt-20 px-4">
      <h1 className="text-4xl md:text-5xl font-serif mb-16">
        <span className="mr-2">*</span>
        The Password Game
      </h1>

      <div className="w-full max-w-2xl">
        <div className="mb-2 text-xl">Please choose a password</div>

        <div className="relative mb-6">
          <div className="w-full p-4 text-xl rounded-lg border-2 border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-colors duration-200 font-sans bg-white overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none">{renderHighlightedPassword()}</div>
              <input
                ref={inputRef}
                type="text"
                value={password}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none"
                autoComplete="off"
                spellCheck="false"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-black/50">
            {password.length} characters
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {[...activeRules, ...completedRules.reverse()].map((rule) => {
              const isValid = rule.id === 9 ? rule.validator(password, captchaText) : rule.validator(password)

              return (
                <motion.div
                  key={rule.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`overflow-hidden ${isValid ? "bg-green-100" : "bg-red-100"}`}
                >
                  <div className="p-4 rounded-lg flex items-start gap-3">
                    {isValid ? (
                      <Check className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                    )}
                    <div className={`flex-1 ${isValid ? "text-green-900" : "text-red-900"}`}>
                      <div className="font-medium mb-0.5">Rule {rule.id}</div>
                      <div>{rule.text}</div>
                      {rule.id === 9 && rule.component && (
                        <rule.component onCaptchaGenerated={handleCaptchaGenerated} />
                      )}
                      {rule.id === 13 && <rule.component onCountryChange={handleCountryChange} />}
                      {rule.id !== 9 && rule.id !== 13 && rule.component && <rule.component />}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-600">
        DM{" "}
        <Link href="https://hackclub.slack.com/team/U07SVH22EBF" className="underline">
          @Me
        </Link>{" "}
        for hints and answers.
      </div>
    </main>
  )
}

