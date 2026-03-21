"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Save, ArrowLeft } from "lucide-react"
import { Patient } from "@/lib/types"
import Link from "next/link"

interface PatientFormProps {
  patient?: Patient
  isEdit?: boolean
}

export function PatientForm({ patient, isEdit = false }: PatientFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    identification_type: patient?.identification_type || "CC",
    identification_number: patient?.identification_number || "",
    full_name: patient?.full_name || "",
    gender: patient?.gender || "M",
    birth_date: patient?.birth_date || "",
    phone: patient?.phone || "",
    email: patient?.email || "",
    address: patient?.address || "",
    company: patient?.company || "",
    occupation: patient?.occupation || "",
  })

  const calculateAge = (birthDate: string): number => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError("No hay sesión activa")
        return
      }

      const age = calculateAge(formData.birth_date)

      if (isEdit && patient) {
        const { error: updateError } = await supabase
          .from("patients")
          .update({
            ...formData,
            age,
            updated_at: new Date().toISOString(),
          })
          .eq("id", patient.id)

        if (updateError) throw updateError
      } else {
        const payload = {
          ...formData,
          age,
          created_by: user.id,
        }
        console.log("Payload:", payload)

        const { error: insertError } = await supabase
          .from("patients")
          .insert(payload)

        if (insertError) {
          console.error("Error completo:", insertError)
          if (insertError.code === "23505") {
            setError("Ya existe un paciente con ese número de identificación")
            return
          }
          throw insertError
        }
      }

      router.push("/dashboard/pacientes")
      router.refresh()
    } catch (err) {
      console.error("Error completo:", err)
      setError("Error al guardar el paciente. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Datos de Identificación</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="identification_type">Tipo de Documento</Label>
              <Select
                value={formData.identification_type}
                onValueChange={(value) => updateField("identification_type", value)}
              >
                <SelectTrigger id="identification_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                  <SelectItem value="PA">Pasaporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identification_number">Número de Documento</Label>
              <Input
                id="identification_number"
                value={formData.identification_number}
                onChange={(e) => updateField("identification_number", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="full_name">Nombres y Apellidos</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => updateField("full_name", e.target.value.toUpperCase())}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos Personales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => updateField("gender", value)}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => updateField("birth_date", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Datos Laborales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => updateField("company", e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Ocupación / Cargo</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => updateField("occupation", e.target.value.toUpperCase())}
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/pacientes">
              <ArrowLeft className="mr-2 size-4" />
              Cancelar
            </Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                {isEdit ? "Actualizar Paciente" : "Guardar Paciente"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}