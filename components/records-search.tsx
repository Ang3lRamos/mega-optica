"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface RecordsSearchProps {
  defaultValue?: string
}

export function RecordsSearch({ defaultValue = "" }: RecordsSearchProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(defaultValue)

  const handleSearch = (value: string) => {
    setSearchValue(value)
    startTransition(() => {
      const params = new URLSearchParams()
      if (value) {
        params.set("q", value)
      }
      router.push(`/dashboard/historias?${params.toString()}`)
    })
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar por nombre o identificación del paciente..."
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
        disabled={isPending}
      />
    </div>
  )
}
