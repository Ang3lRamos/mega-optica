"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Save, CheckCircle } from "lucide-react"

interface ProfileFormProps {
  profile: {
    id: string
    full_name: string
    role: string
    professional_registration: string | null
    sst: string | null
  }
  userEmail: string
}

const ROLE_LABELS: Record<string, string> = {
  administrador: "Administrador",
  optometra: "Optómetra",
  recepcionista: "Recepcionista",
}

export function ProfileForm({ profile, userEmail }: ProfileFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    professional_registration: profile.professional_registration || "",
    sst: profile.sst || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          professional_registration: formData.professional_registration || null,
          sst: formData.sst || null,
        })
        .eq("id", profile.id)

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error("Error:", err)
      setError("Error al guardar los cambios. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 max-w-2xl">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-500 text-green-700">
            <CheckCircle className="size-4" />
            <AlertDescription>Perfil actualizado correctamente.</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader><CardTitle>Información de la Cuenta</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input value={userEmail} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">El correo no se puede cambiar desde aquí.</p>
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Input value={ROLE_LABELS[profile.role] || profile.role} disabled className="bg-muted" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Datos Personales</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre Completo</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value.toUpperCase() }))}
                required
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Datos Profesionales</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="professional_registration">Registro Profesional / T.P.</Label>
              <Input
                id="professional_registration"
                value={formData.professional_registration}
                onChange={(e) => setFormData((prev) => ({ ...prev, professional_registration: e.target.value }))}
                placeholder="TP 12345"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sst">SST</Label>
              <Input
                id="sst"
                value={formData.sst}
                onChange={(e) => setFormData((prev) => ({ ...prev, sst: e.target.value }))}
                placeholder="Especialidad / SST"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <><Spinner className="mr-2" />Guardando...</>
            ) : (
              <><Save className="mr-2 size-4" />Guardar Cambios</>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}