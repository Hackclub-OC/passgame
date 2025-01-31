"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sun, Moon, Laptop } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useTheme } from "next-themes"

const passwordRequirements = [
  { regex: (password: string) => password.length >= 6, text: "At least 6 characters" },
  { regex: (password: string) => /[0-9]/.test(password), text: "At least 1 number" },
  { regex: (password: string) => /[a-z]/.test(password), text: "At least 1 lowercase letter" },
  { regex: (password: string) => /[A-Z]/.test(password), text: "At least 1 uppercase letter" },
  { regex: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password), text: "At least 1 special character" },
]

export default function GamePage() {
  const [password, setPassword] = useState("")
  const [unmetRequirements, setUnmetRequirements] = useState(passwordRequirements)
  const { theme = "system", setTheme } = useTheme()

  const checkPassword = (pass: string) => {
    setPassword(pass)
    const newUnmetRequirements = passwordRequirements.filter((req) => !req.regex(pass))
    setUnmetRequirements(newUnmetRequirements)
  }

  const allRequirementsMet = unmetRequirements.length === 0

  const switchThemeIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Laptop className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-black">
      <Card className="w-full max-w-2xl mx-auto my-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <Link href="/" className="text-neutral-900 dark:text-white">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">Create Hard Password</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                {switchThemeIcon()}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid gap-4">
                <h4 className="font-medium leading-none">Choose theme</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTheme("light")}>
                    <Sun className="mr-1 h-4 w-4" />
                    Light
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTheme("dark")}>
                    <Moon className="mr-1 h-4 w-4" />
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTheme("system")}>
                    <Laptop className="mr-1 h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="text"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => checkPassword(e.target.value)}
                className="pr-10 bg-black text-white dark:bg-white dark:text-black"
              />
              <Button
                className="absolute right-0 top-0 bottom-0"
                disabled={!allRequirementsMet}
                onClick={() => alert("Congratulations! You've created a strong password.")}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">Current Requirements:</p>
            <AnimatePresence>
              {unmetRequirements.map((req, index) => (
                <motion.div
                  key={req.text}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {index + 1}. {req.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

