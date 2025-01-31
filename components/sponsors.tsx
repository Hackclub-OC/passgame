import Image from "next/image"

export const Sponsors = () => {
  return (
    <div className="flex justify-around items-center gap-4 mt-4 mb-2">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/vercel-icon-dark-RB7K62AZpKWiD5glepL4NobPVM9Gel.png"
        alt="Vercel"
        width={60}
        height={60}
        className="dark:invert"
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/github-mark-Z4KhxAqDeRznwTyO8Lbe4vKjvFZlzl.svg"
        alt="GitHub"
        width={60}
        height={60}
      />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-square-Rrztd6MPC5LJWOSy3fXsJL8bkIL9qK.png"
        alt="Hack Club"
        width={60}
        height={60}
      />
    </div>
  )
}

