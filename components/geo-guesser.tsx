"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

export const GeoGuesser: React.FC<{ onCountryChange: (country: string) => void }> = ({ onCountryChange }) => {
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchCountryImage = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all")
        const countries = await response.json()
        const randomCountry = countries[Math.floor(Math.random() * countries.length)]
        setImageUrl(randomCountry.flags.png)
        onCountryChange(randomCountry.name.common)
      } catch (error) {
        console.error("Error fetching country data:", error)
        setImageUrl("https://picsum.photos/400/300")
        onCountryChange("France")
      }
    }

    fetchCountryImage()
  }, [onCountryChange])

  return (
    <div className="text-center">
      <p>Guess the country:</p>
      {imageUrl && (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Country flag"
          width={400}
          height={200}
          className="my-4 rounded-lg"
        />
      )}
    </div>
  )
}

