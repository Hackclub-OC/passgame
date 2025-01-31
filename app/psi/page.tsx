"use client"

import PasswordStrengthIndicator from "@/components/password-strength-indicator"

export default function PSIPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-black">
      <PasswordStrengthIndicator />
    </div>
  )
}

