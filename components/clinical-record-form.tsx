"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Save, ArrowLeft } from "lucide-react"
import { ExamType, EXAM_TYPE_LABELS, Patient, ClinicalRecord } from "@/lib/types"

interface PatientOption {
  id: string
  full_name: string
  identification_number: string
}

interface ClinicalRecordFormProps {
  patients: PatientOption[]
  selectedPatient?: Patient | null
  record?: ClinicalRecord
  isEdit?: boolean
}

const VISUAL_ACUITY_OPTIONS = [
  "20/20", "20/25", "20/30", "20/40", "20/50", "20/60", "20/70",
  "20/80", "20/100", "20/200", "20/400", "CD", "MM", "PL", "NPL"
]

export function ClinicalRecordForm({
  patients,
  selectedPatient,
  record,
  isEdit = false,
}: ClinicalRecordFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    patient_id: selectedPatient?.id || record?.patient_id || "",
    exam_date: record?.exam_date || new Date().toISOString().split("T")[0],
    exam_type: record?.exam_type || ("visiometria" as ExamType),

    // Antecedentes ocupacionales
    uses_protection: record?.uses_protection || false,
    protection_type: record?.protection_type || "",
    time_in_job: record?.time_in_job || "",

    // Examen de agudeza visual anterior
    previous_exam: record?.previous_exam || false,
    previous_exam_date: record?.previous_exam_date || "",
    has_prescribed_lenses: record?.has_prescribed_lenses || false,
    lens_usage: record?.lens_usage || "",
    ocular_surgery: record?.ocular_surgery || false,
    surgery_details: record?.surgery_details || "",
    surgery_date: record?.surgery_date || "",
    current_ocular_symptoms: record?.current_ocular_symptoms || false,
    symptoms_details: record?.symptoms_details || "",

    // Agudeza visual
    visual_acuity: record?.visual_acuity || {
      od_sin_correccion_lejana: "",
      od_con_correccion_lejana: "",
      oi_sin_correccion_lejana: "",
      oi_con_correccion_lejana: "",
      od_sin_correccion_cercana: "",
      od_con_correccion_cercana: "",
      oi_sin_correccion_cercana: "",
      oi_con_correccion_cercana: "",
    },

    // Examen externo
    external_exam: record?.external_exam || { od: "", oi: "" },

    // Cover test
    cover_test: record?.cover_test || { lejos: "", cerca: "" },

    // Oftalmoscopía
    oftalmoscopia: record?.oftalmoscopia || { od: "", oi: "" },

    // Visión cromática
    chromatic_vision: record?.chromatic_vision || ("normal" as "normal" | "anormal"),
    estereopsis: record?.estereopsis || "",

    // Queratometría
    queratometria: record?.queratometria || { od: "", oi: "" },

    // Retinoscopía
    retinoscopia: record?.retinoscopia || { od: "", oi: "" },

    // Diagnóstico y observaciones
    diagnosis: record?.diagnosis || "",
    observations: record?.observations || "",

    // Remisión
    eps_referral: record?.eps_referral || false,
  })

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

    if (!formData.patient_id) {
      setError("Debes seleccionar un paciente")
      return
    }

    const dataToSave = {
      patient_id: formData.patient_id,
      optometrist_id: user.id,
      exam_date: formData.exam_date,
      exam_type: formData.exam_type,

      // Antecedentes ocupacionales
      time_in_position: formData.time_in_job,
      uses_protection: formData.uses_protection,
      protection_type: formData.protection_type || null,

      // Agudeza visual anterior
      previous_exam: formData.previous_exam,
      previous_exam_date: formData.previous_exam_date || null,
      has_prescribed_lenses: formData.has_prescribed_lenses,
      lens_usage: formData.lens_usage || null,

      // Cirugía
      ocular_surgery: formData.ocular_surgery,
      surgery_details: formData.surgery_details || null,
      surgery_date: formData.surgery_date || null,

      // Síntomas
      current_symptoms: formData.current_ocular_symptoms,
      symptoms_details: formData.symptoms_details || null,

      // Agudeza visual - OD
      od_far_without_correction: formData.visual_acuity.od_sin_correccion_lejana || null,
      od_far_with_correction: formData.visual_acuity.od_con_correccion_lejana || null,
      od_near_without_correction: formData.visual_acuity.od_sin_correccion_cercana || null,
      od_near_with_correction: formData.visual_acuity.od_con_correccion_cercana || null,

      // Agudeza visual - OI
      oi_far_without_correction: formData.visual_acuity.oi_sin_correccion_lejana || null,
      oi_far_with_correction: formData.visual_acuity.oi_con_correccion_lejana || null,
      oi_near_without_correction: formData.visual_acuity.oi_sin_correccion_cercana || null,
      oi_near_with_correction: formData.visual_acuity.oi_con_correccion_cercana || null,

      // Examen externo
      external_exam_od: formData.external_exam.od || null,
      external_exam_oi: formData.external_exam.oi || null,

      // Cover test
      cover_test_far: formData.cover_test.lejos || null,
      cover_test_near: formData.cover_test.cerca || null,

      // Oftalmoscopía
      ophthalmoscopy_od: formData.oftalmoscopia.od || null,
      ophthalmoscopy_oi: formData.oftalmoscopia.oi || null,

      // Visión cromática y estereopsis
      chromatic_vision: formData.chromatic_vision,
      stereopsis: formData.estereopsis || null,

      // Queratometría
      keratometry_od: formData.queratometria.od || null,
      keratometry_oi: formData.queratometria.oi || null,

      // Retinoscopía
      retinoscopy_od: formData.retinoscopia.od || null,
      retinoscopy_oi: formData.retinoscopia.oi || null,

      // Diagnóstico
      diagnosis: formData.diagnosis || null,
      observations: formData.observations || null,
      eps_referral: formData.eps_referral,
    }

    if (isEdit && record) {
      const { error: updateError } = await supabase
        .from("clinical_records")
        .update({ ...dataToSave, updated_at: new Date().toISOString() })
        .eq("id", record.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from("clinical_records")
        .insert(dataToSave)

      if (insertError) throw insertError
    }

    router.push("/dashboard/historias")
    router.refresh()
  } catch (err) {
    console.error("Error completo:", err)
    setError("Error al guardar la historia clínica. Intenta de nuevo.")
  } finally {
    setLoading(false)
  }
}

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent as keyof typeof prev] as Record<string, string>), [field]: value },
    }))
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

        {/* Datos del examen */}
        <Card>
          <CardHeader>
            <CardTitle>Datos del Examen</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="patient_id">Paciente</Label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) => updateField("patient_id", value)}
                disabled={!!selectedPatient}
              >
                <SelectTrigger id="patient_id">
                  <SelectValue placeholder="Seleccionar paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.full_name} - {patient.identification_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_date">Fecha del Examen</Label>
              <Input
                id="exam_date"
                type="date"
                value={formData.exam_date}
                onChange={(e) => updateField("exam_date", e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam_type">Tipo de Examen</Label>
              <Select
                value={formData.exam_type}
                onValueChange={(value) => updateField("exam_type", value)}
              >
                <SelectTrigger id="exam_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Antecedentes ocupacionales */}
        <Card>
          <CardHeader>
            <CardTitle>Antecedentes Ocupacionales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="uses_protection"
                checked={formData.uses_protection}
                onCheckedChange={(checked) => updateField("uses_protection", checked)}
              />
              <Label htmlFor="uses_protection">¿Utiliza alguna protección?</Label>
            </div>

            {formData.uses_protection && (
              <div className="space-y-2">
                <Label htmlFor="protection_type">¿Cuál?</Label>
                <Input
                  id="protection_type"
                  value={formData.protection_type}
                  onChange={(e) => updateField("protection_type", e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time_in_job">Tiempo en este oficio</Label>
              <Input
                id="time_in_job"
                value={formData.time_in_job}
                onChange={(e) => updateField("time_in_job", e.target.value)}
                placeholder="Ej: 5 años"
                disabled={loading}
              />
            </div>
          </CardContent>
        </Card>

        {/* Examen de agudeza visual anterior */}
        <Card>
          <CardHeader>
            <CardTitle>Examen de Agudeza Visual Anterior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="previous_exam"
                  checked={formData.previous_exam}
                  onCheckedChange={(checked) => updateField("previous_exam", checked)}
                />
                <Label htmlFor="previous_exam">¿Le han practicado visiometría anteriormente?</Label>
              </div>

              {formData.previous_exam && (
                <div className="space-y-2">
                  <Label htmlFor="previous_exam_date">Fecha último examen</Label>
                  <Input
                    id="previous_exam_date"
                    type="date"
                    value={formData.previous_exam_date}
                    onChange={(e) => updateField("previous_exam_date", e.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="has_prescribed_lenses"
                  checked={formData.has_prescribed_lenses}
                  onCheckedChange={(checked) => updateField("has_prescribed_lenses", checked)}
                />
                <Label htmlFor="has_prescribed_lenses">¿Tiene lentes formulados?</Label>
              </div>

              {formData.has_prescribed_lenses && (
                <div className="space-y-2">
                  <Label>Forma de uso</Label>
                  <Select
                    value={formData.lens_usage}
                    onValueChange={(value) => updateField("lens_usage", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanentes">Permanentes</SelectItem>
                      <SelectItem value="ocasionales">Ocasionales</SelectItem>
                      <SelectItem value="para_ver_cerca">Para ver de cerca</SelectItem>
                      <SelectItem value="para_ver_lejos">Para ver de lejos</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ocular_surgery"
                    checked={formData.ocular_surgery}
                    onCheckedChange={(checked) => updateField("ocular_surgery", checked)}
                  />
                  <Label htmlFor="ocular_surgery">Cirugía ocular</Label>
                </div>
                {formData.ocular_surgery && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input
                      placeholder="¿Cuál?"
                      value={formData.surgery_details}
                      onChange={(e) => updateField("surgery_details", e.target.value)}
                      disabled={loading}
                    />
                    <Input
                      type="date"
                      placeholder="Fecha"
                      value={formData.surgery_date}
                      onChange={(e) => updateField("surgery_date", e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="current_ocular_symptoms"
                    checked={formData.current_ocular_symptoms}
                    onCheckedChange={(checked) => updateField("current_ocular_symptoms", checked)}
                  />
                  <Label htmlFor="current_ocular_symptoms">Sintomatología ocular actual</Label>
                </div>
                {formData.current_ocular_symptoms && (
                  <Input
                    placeholder="¿Cuál?"
                    value={formData.symptoms_details}
                    onChange={(e) => updateField("symptoms_details", e.target.value)}
                    disabled={loading}
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agudeza visual */}
        <Card>
          <CardHeader>
            <CardTitle>Agudeza Visual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-center" colSpan={2}>Visión Lejana</th>
                    <th className="p-2 text-center" colSpan={2}>Visión Cercana</th>
                  </tr>
                  <tr className="border-b">
                    <th className="p-2 text-left"></th>
                    <th className="p-2 text-center text-xs">Sin Corrección</th>
                    <th className="p-2 text-center text-xs">Con Corrección</th>
                    <th className="p-2 text-center text-xs">Sin Corrección</th>
                    <th className="p-2 text-center text-xs">Con Corrección</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium">OD (Ojo Derecho)</td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.od_sin_correccion_lejana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "od_sin_correccion_lejana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.od_con_correccion_lejana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "od_con_correccion_lejana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.od_sin_correccion_cercana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "od_sin_correccion_cercana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.od_con_correccion_cercana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "od_con_correccion_cercana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">OI (Ojo Izquierdo)</td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.oi_sin_correccion_lejana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "oi_sin_correccion_lejana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.oi_con_correccion_lejana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "oi_con_correccion_lejana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.oi_sin_correccion_cercana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "oi_sin_correccion_cercana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Select
                        value={formData.visual_acuity.oi_con_correccion_cercana}
                        onValueChange={(v) => updateNestedField("visual_acuity", "oi_con_correccion_cercana", v)}
                      >
                        <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                        <SelectContent>
                          {VISUAL_ACUITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Exámenes complementarios */}
        <Card>
          <CardHeader>
            <CardTitle>Exámenes Complementarios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Examen externo */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Examen Externo</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="external_exam_od">OD (Ojo Derecho)</Label>
                  <Input
                    id="external_exam_od"
                    value={formData.external_exam.od}
                    onChange={(e) => updateNestedField("external_exam", "od", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="external_exam_oi">OI (Ojo Izquierdo)</Label>
                  <Input
                    id="external_exam_oi"
                    value={formData.external_exam.oi}
                    onChange={(e) => updateNestedField("external_exam", "oi", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Cover test */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Cover Test</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cover_test_lejos">Lejos</Label>
                  <Input
                    id="cover_test_lejos"
                    value={formData.cover_test.lejos}
                    onChange={(e) => updateNestedField("cover_test", "lejos", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cover_test_cerca">Cerca</Label>
                  <Input
                    id="cover_test_cerca"
                    value={formData.cover_test.cerca}
                    onChange={(e) => updateNestedField("cover_test", "cerca", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Oftalmoscopía */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Oftalmoscopía</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="oftalmoscopia_od">OD</Label>
                  <Input
                    id="oftalmoscopia_od"
                    value={formData.oftalmoscopia.od}
                    onChange={(e) => updateNestedField("oftalmoscopia", "od", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oftalmoscopia_oi">OI</Label>
                  <Input
                    id="oftalmoscopia_oi"
                    value={formData.oftalmoscopia.oi}
                    onChange={(e) => updateNestedField("oftalmoscopia", "oi", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Visión cromática */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-base font-medium">Visión Cromática</Label>
                <RadioGroup
                  value={formData.chromatic_vision}
                  onValueChange={(value) => updateField("chromatic_vision", value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="normal" id="chromatic_normal" />
                    <Label htmlFor="chromatic_normal">Normal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anormal" id="chromatic_anormal" />
                    <Label htmlFor="chromatic_anormal">Anormal</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estereopsis">Estereopsis</Label>
                <Input
                  id="estereopsis"
                  value={formData.estereopsis}
                  onChange={(e) => updateField("estereopsis", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Queratometría */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Queratometría</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="queratometria_od">OD</Label>
                  <Input
                    id="queratometria_od"
                    value={formData.queratometria.od}
                    onChange={(e) => updateNestedField("queratometria", "od", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="queratometria_oi">OI</Label>
                  <Input
                    id="queratometria_oi"
                    value={formData.queratometria.oi}
                    onChange={(e) => updateNestedField("queratometria", "oi", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Retinoscopía */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Retinoscopía</Label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="retinoscopia_od">OD</Label>
                  <Input
                    id="retinoscopia_od"
                    value={formData.retinoscopia.od}
                    onChange={(e) => updateNestedField("retinoscopia", "od", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retinoscopia_oi">OI</Label>
                  <Input
                    id="retinoscopia_oi"
                    value={formData.retinoscopia.oi}
                    onChange={(e) => updateNestedField("retinoscopia", "oi", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnóstico y observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico y Observaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnóstico</Label>
              <Textarea
                id="diagnosis"
                value={formData.diagnosis}
                onChange={(e) => updateField("diagnosis", e.target.value)}
                placeholder="Ingresa el diagnóstico..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => updateField("observations", e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="eps_referral"
                checked={formData.eps_referral}
                onCheckedChange={(checked) => updateField("eps_referral", checked)}
              />
              <Label htmlFor="eps_referral">Remisión a EPS</Label>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/historias">
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
                {isEdit ? "Actualizar Historia" : "Guardar Historia"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
