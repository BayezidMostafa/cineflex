"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const BackButton = () => {
  const router = useRouter()

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full text-white">
      <ArrowLeft className="h-5 w-5" />
      <span className="sr-only">Go back</span>
    </Button>
  )
}

export default BackButton
