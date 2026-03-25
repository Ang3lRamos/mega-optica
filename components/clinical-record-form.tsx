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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle, Save, ArrowLeft, ChevronRight, ChevronLeft, Upload } from "lucide-react"
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

const EXT_OPTIONS = ["Normal", "Anormal", "No evaluado"]

const PERSONAL_HISTORY_OPTIONS = [
  "Diabetes", "Hipertensión", "Migrañas", "Alergias", "Cirugías oculares", "Usa lentes"
]

const FAMILY_HISTORY_OPTIONS = [
  "Diabetes", "Hipertensión", "Glaucoma", "Cataratas", "Miopía"
]

const OCCUPATIONAL_EXPOSURES = [
  "Pantalla / VDT", "Químicos", "Soldadura", "Polvo / partículas", "Usa EPP visual"
]

const TABS = [
  { id: 0, label: "Datos del Examen" },
  { id: 1, label: "Antecedentes" },
  { id: 2, label: "Agudeza Visual" },
  { id: 3, label: "Examen Clínico" },
  { id: 4, label: "Diagnóstico" },
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
  const [activeTab, setActiveTab] = useState(0)
  const [showCoverTestDetails, setShowCoverTestDetails] = useState(
    !["Ortoforia", ""].includes(record?.ext_cover_test || "")
  )

  const [formData, setFormData] = useState({
    patient_id: selectedPatient?.id || record?.patient_id || "",
    exam_date: record?.exam_date || new Date().toISOString().split("T")[0],
    exam_type: record?.exam_type || ("visiometria" as ExamType),
    consultation_reason: record?.consultation_reason || "",

    personal_history: record?.personal_history || [] as string[],
    personal_history_other: record?.personal_history_other || "",
    family_history: record?.family_history || [] as string[],
    family_history_other: record?.family_history_other || "",

    uses_protection: record?.uses_protection || false,
    protection_type: record?.protection_type || "",
    time_in_job: record?.time_in_job || "",
    occupational_exposures: record?.occupational_exposures || [] as string[],
    previous_exam: record?.previous_exam || false,
    previous_exam_date: record?.previous_exam_date || "",
    has_prescribed_lenses: record?.has_prescribed_lenses || false,
    lens_usage: record?.lens_usage || "",
    ocular_surgery: record?.ocular_surgery || false,
    surgery_details: record?.surgery_details || "",
    surgery_date: record?.surgery_date || "",
    current_ocular_symptoms: record?.current_ocular_symptoms || false,
    symptoms_details: record?.symptoms_details || "",

    visual_acuity: record?.visual_acuity || {
      od_sin_correccion_lejana: "",
      od_con_correccion_lejana: "",
      oi_sin_correccion_lejana: "",
      oi_con_correccion_lejana: "",
      od_sin_correccion_cercana: "",
      od_con_correccion_cercana: "",
      oi_sin_correccion_cercana: "",
      oi_con_correccion_cercana: "",
      ao_sin_correccion_lejana: "",
      ao_con_correccion_lejana: "",
      ao_sin_correccion_cercana: "",
      ao_con_correccion_cercana: "",
    },
    ph_od: record?.ph_od || "",
    ph_oi: record?.ph_oi || "",

    ext_parpados_od: record?.ext_parpados_od || "Normal",
    ext_parpados_oi: record?.ext_parpados_oi || "Normal",
    ext_conjuntiva_od: record?.ext_conjuntiva_od || "Normal",
    ext_conjuntiva_oi: record?.ext_conjuntiva_oi || "Normal",
    ext_cornea_od: record?.ext_cornea_od || "Normal",
    ext_cornea_oi: record?.ext_cornea_oi || "Normal",
    ext_iris_od: record?.ext_iris_od || "Normal",
    ext_iris_oi: record?.ext_iris_oi || "Normal",
    ext_pupila_od: record?.ext_pupila_od || "Normal",
    ext_pupila_oi: record?.ext_pupila_oi || "Normal",
    ext_cristalino_od: record?.ext_cristalino_od || "Normal",
    ext_cristalino_oi: record?.ext_cristalino_oi || "Normal",
    ext_motilidad: record?.ext_motilidad || "Normal",
    ext_cover_test: record?.ext_cover_test || "",
    ext_observations: record?.ext_observations || "",

    refraction_od_esfera: record?.refraction_od_esfera || "",
    refraction_od_cilindro: record?.refraction_od_cilindro || "",
    refraction_od_eje: record?.refraction_od_eje || "",
    refraction_od_add: record?.refraction_od_add || "",
    refraction_od_av: record?.refraction_od_av || "",
    refraction_oi_esfera: record?.refraction_oi_esfera || "",
    refraction_oi_cilindro: record?.refraction_oi_cilindro || "",
    refraction_oi_eje: record?.refraction_oi_eje || "",
    refraction_oi_add: record?.refraction_oi_add || "",
    refraction_oi_av: record?.refraction_oi_av || "",
    refraction_dp: record?.refraction_dp || "",
    refraction_lens_type: record?.refraction_lens_type || "",

    keratometry_od_k1: record?.keratometry_od_k1 || "",
    keratometry_od_k2: record?.keratometry_od_k2 || "",
    keratometry_od_eje: record?.keratometry_od_eje || "",
    keratometry_oi_k1: record?.keratometry_oi_k1 || "",
    keratometry_oi_k2: record?.keratometry_oi_k2 || "",
    keratometry_oi_eje: record?.keratometry_oi_eje || "",

    test_ishihara: record?.test_ishihara || "",
    test_estereopsis: record?.test_estereopsis || "",
    test_others: record?.test_others || "",

    diagnosis: record?.diagnosis || "",
    observations: record?.observations || "",
    conduct: record?.conduct || "",
    eps_referral: record?.eps_referral || false,
    eps_referral_details: record?.eps_referral_details || "",

    professional_name: record?.professional_name || "",
    professional_registration: record?.professional_registration || "",
    signature_professional: record?.signature_professional || "",
  })

  const toggleArrayField = (field: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev] as string[]
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError("No hay sesión activa"); return }
      if (!formData.patient_id) { setError("Debes seleccionar un paciente"); setActiveTab(0); return }

      const dataToSave = {
        patient_id: formData.patient_id,
        optometrist_id: user.id,
        exam_date: formData.exam_date,
        exam_type: formData.exam_type,
        consultation_reason: formData.consultation_reason || null,

        personal_history: formData.personal_history,
        personal_history_other: formData.personal_history_other || null,
        family_history: formData.family_history,
        family_history_other: formData.family_history_other || null,

        time_in_position: formData.time_in_job,
        uses_protection: formData.uses_protection,
        protection_type: formData.protection_type || null,
        occupational_exposures: formData.occupational_exposures,
        previous_exam: formData.previous_exam,
        previous_exam_date: formData.previous_exam_date || null,
        has_prescribed_lenses: formData.has_prescribed_lenses,
        lens_usage: formData.lens_usage || null,
        ocular_surgery: formData.ocular_surgery,
        surgery_details: formData.surgery_details || null,
        surgery_date: formData.surgery_date || null,
        current_symptoms: formData.current_ocular_symptoms,
        symptoms_details: formData.symptoms_details || null,

        od_far_without_correction: formData.visual_acuity.od_sin_correccion_lejana || null,
        od_far_with_correction: formData.visual_acuity.od_con_correccion_lejana || null,
        od_near_without_correction: formData.visual_acuity.od_sin_correccion_cercana || null,
        od_near_with_correction: formData.visual_acuity.od_con_correccion_cercana || null,
        oi_far_without_correction: formData.visual_acuity.oi_sin_correccion_lejana || null,
        oi_far_with_correction: formData.visual_acuity.oi_con_correccion_lejana || null,
        oi_near_without_correction: formData.visual_acuity.oi_sin_correccion_cercana || null,
        oi_near_with_correction: formData.visual_acuity.oi_con_correccion_cercana || null,
        ph_od: formData.ph_od || null,
        ph_oi: formData.ph_oi || null,

        ext_parpados_od: formData.ext_parpados_od,
        ext_parpados_oi: formData.ext_parpados_oi,
        ext_conjuntiva_od: formData.ext_conjuntiva_od,
        ext_conjuntiva_oi: formData.ext_conjuntiva_oi,
        ext_cornea_od: formData.ext_cornea_od,
        ext_cornea_oi: formData.ext_cornea_oi,
        ext_iris_od: formData.ext_iris_od,
        ext_iris_oi: formData.ext_iris_oi,
        ext_pupila_od: formData.ext_pupila_od,
        ext_pupila_oi: formData.ext_pupila_oi,
        ext_cristalino_od: formData.ext_cristalino_od,
        ext_cristalino_oi: formData.ext_cristalino_oi,
        ext_motilidad: formData.ext_motilidad,
        ext_cover_test: formData.ext_cover_test || null,
        ext_observations: formData.ext_observations || null,

        refraction_od_esfera: formData.refraction_od_esfera || null,
        refraction_od_cilindro: formData.refraction_od_cilindro || null,
        refraction_od_eje: formData.refraction_od_eje || null,
        refraction_od_add: formData.refraction_od_add || null,
        refraction_od_av: formData.refraction_od_av || null,
        refraction_oi_esfera: formData.refraction_oi_esfera || null,
        refraction_oi_cilindro: formData.refraction_oi_cilindro || null,
        refraction_oi_eje: formData.refraction_oi_eje || null,
        refraction_oi_add: formData.refraction_oi_add || null,
        refraction_oi_av: formData.refraction_oi_av || null,
        refraction_dp: formData.refraction_dp || null,
        refraction_lens_type: formData.refraction_lens_type || null,

        keratometry_od_k1: formData.keratometry_od_k1 || null,
        keratometry_od_k2: formData.keratometry_od_k2 || null,
        keratometry_od_eje: formData.keratometry_od_eje || null,
        keratometry_oi_k1: formData.keratometry_oi_k1 || null,
        keratometry_oi_k2: formData.keratometry_oi_k2 || null,
        keratometry_oi_eje: formData.keratometry_oi_eje || null,

        test_ishihara: formData.test_ishihara || null,
        test_estereopsis: formData.test_estereopsis || null,
        test_others: formData.test_others || null,

        diagnosis: formData.diagnosis || null,
        observations: formData.observations || null,
        conduct: formData.conduct || null,
        eps_referral: formData.eps_referral,
        eps_referral_details: formData.eps_referral_details || null,

        professional_name: formData.professional_name || null,
        professional_registration: formData.professional_registration || null,
        signature_professional: formData.signature_professional || null,

        ao_far_without_correction: formData.visual_acuity.ao_sin_correccion_lejana || null,
        ao_far_with_correction: formData.visual_acuity.ao_con_correccion_lejana || null,
        ao_near_without_correction: formData.visual_acuity.ao_sin_correccion_cercana || null,
        ao_near_with_correction: formData.visual_acuity.ao_con_correccion_cercana || null,
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
      console.error("Error:", err)
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

  const ExtSelect = ({ field }: { field: string }) => (
    <Select
      value={formData[field as keyof typeof formData] as string}
      onValueChange={(v) => updateField(field, v)}
    >
      <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
      <SelectContent>
        {EXT_OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  const VASelect = ({ subfield }: { subfield: string }) => (
    <Select
      value={(formData.visual_acuity as Record<string, string>)[subfield]}
      onValueChange={(v) => updateNestedField("visual_acuity", subfield, v)}
    >
      <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
      <SelectContent>
        {VISUAL_ACUITY_OPTIONS.map((opt) => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Datos del Examen */}
        {activeTab === 0 && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Datos del Examen</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Paciente</Label>
                  <Select value={formData.patient_id} onValueChange={(v) => updateField("patient_id", v)} disabled={!!selectedPatient}>
                    <SelectTrigger><SelectValue placeholder="Seleccionar paciente" /></SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.full_name} - {p.identification_number}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fecha del Examen</Label>
                  <Input type="date" value={formData.exam_date} onChange={(e) => updateField("exam_date", e.target.value)} required disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Visiometría</Label>
                  <Select value={formData.exam_type} onValueChange={(v) => updateField("exam_type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(EXAM_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Datos del Profesional</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nombre del Profesional</Label>
                  <Input value={formData.professional_name} onChange={(e) => updateField("professional_name", e.target.value)} placeholder="Nombre completo" disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Registro Profesional / T.P.</Label>
                  <Input value={formData.professional_registration} onChange={(e) => updateField("professional_registration", e.target.value)} placeholder="TP 12345" disabled={loading} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Motivo de Consulta</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={formData.consultation_reason} onChange={(e) => updateField("consultation_reason", e.target.value)} placeholder="Describa el motivo de la consulta..." rows={4} disabled={loading} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: Antecedentes */}
        {activeTab === 1 && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Antecedentes Personales</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PERSONAL_HISTORY_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={`personal-${option}`} checked={formData.personal_history.includes(option)} onCheckedChange={() => toggleArrayField("personal_history", option)} />
                      <Label htmlFor={`personal-${option}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Otros antecedentes personales</Label>
                  <Textarea value={formData.personal_history_other} onChange={(e) => updateField("personal_history_other", e.target.value)} placeholder="Otros antecedentes relevantes..." rows={2} disabled={loading} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Antecedentes Familiares</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {FAMILY_HISTORY_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox id={`family-${option}`} checked={formData.family_history.includes(option)} onCheckedChange={() => toggleArrayField("family_history", option)} />
                      <Label htmlFor={`family-${option}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Otros antecedentes familiares</Label>
                  <Textarea value={formData.family_history_other} onChange={(e) => updateField("family_history_other", e.target.value)} placeholder="Otros antecedentes relevantes..." rows={2} disabled={loading} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Antecedentes Ocupacionales</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Cargo</Label>
                    <Input value={formData.time_in_job} onChange={(e) => updateField("time_in_job", e.target.value)} placeholder="Operario, administrativo..." disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Input value={formData.protection_type} onChange={(e) => updateField("protection_type", e.target.value)} placeholder="Nombre de la empresa" disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tiempo en el cargo</Label>
                    <Input placeholder="2 años, 6 meses..." disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Exposiciones</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {OCCUPATIONAL_EXPOSURES.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox id={`exposure-${option}`} checked={formData.occupational_exposures.includes(option)} onCheckedChange={() => toggleArrayField("occupational_exposures", option)} />
                        <Label htmlFor={`exposure-${option}`} className="cursor-pointer">{option}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="previous_exam" checked={formData.previous_exam} onCheckedChange={(v) => updateField("previous_exam", v)} />
                    <Label htmlFor="previous_exam">¿Visiometría anterior?</Label>
                  </div>
                  {formData.previous_exam && (
                    <div className="space-y-2 ml-6">
                      <Label>Fecha último examen</Label>
                      <Input type="date" value={formData.previous_exam_date} onChange={(e) => updateField("previous_exam_date", e.target.value)} disabled={loading} />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch id="has_prescribed_lenses" checked={formData.has_prescribed_lenses} onCheckedChange={(v) => updateField("has_prescribed_lenses", v)} />
                    <Label htmlFor="has_prescribed_lenses">¿Tiene lentes formulados?</Label>
                  </div>
                  {formData.has_prescribed_lenses && (
                    <div className="space-y-2 ml-6">
                      <Label>Forma de uso</Label>
                      <Select value={formData.lens_usage} onValueChange={(v) => updateField("lens_usage", v)}>
                        <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
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
                  <div className="flex items-center space-x-2">
                    <Switch id="ocular_surgery" checked={formData.ocular_surgery} onCheckedChange={(v) => updateField("ocular_surgery", v)} />
                    <Label htmlFor="ocular_surgery">¿Cirugía ocular?</Label>
                  </div>
                  {formData.ocular_surgery && (
                    <div className="grid gap-2 sm:grid-cols-2 ml-6">
                      <Input placeholder="¿Cuál?" value={formData.surgery_details} onChange={(e) => updateField("surgery_details", e.target.value)} disabled={loading} />
                      <Input type="date" value={formData.surgery_date} onChange={(e) => updateField("surgery_date", e.target.value)} disabled={loading} />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch id="current_ocular_symptoms" checked={formData.current_ocular_symptoms} onCheckedChange={(v) => updateField("current_ocular_symptoms", v)} />
                    <Label htmlFor="current_ocular_symptoms">¿Sintomatología ocular actual?</Label>
                  </div>
                  {formData.current_ocular_symptoms && (
                    <div className="ml-6">
                      <Input placeholder="¿Cuál?" value={formData.symptoms_details} onChange={(e) => updateField("symptoms_details", e.target.value)} disabled={loading} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 3: Agudeza Visual */}
        {activeTab === 2 && (
          <Card>
            <CardHeader><CardTitle>Agudeza Visual</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2 text-left w-16"></th>
                      <th className="p-2 text-center" colSpan={2}>Visión Lejana</th>
                      <th className="p-2 text-center" colSpan={2}>Visión Cercana</th>
                      <th className="p-2 text-center">PH</th>
                    </tr>
                    <tr className="border-b">
                      <th className="p-2 text-left"></th>
                      <th className="p-2 text-center text-xs">Sin Corrección</th>
                      <th className="p-2 text-center text-xs">Con Corrección</th>
                      <th className="p-2 text-center text-xs">Sin Corrección</th>
                      <th className="p-2 text-center text-xs">Con Corrección</th>
                      <th className="p-2 text-center text-xs">Agujero Estenopeico</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">OD</td>
                      <td className="p-2"><VASelect subfield="od_sin_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="od_con_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="od_sin_correccion_cercana" /></td>
                      <td className="p-2"><VASelect subfield="od_con_correccion_cercana" /></td>
                      <td className="p-2"><Input className="h-8" value={formData.ph_od} onChange={(e) => updateField("ph_od", e.target.value)} placeholder="-" disabled={loading} /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">OI</td>
                      <td className="p-2"><VASelect subfield="oi_sin_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="oi_con_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="oi_sin_correccion_cercana" /></td>
                      <td className="p-2"><VASelect subfield="oi_con_correccion_cercana" /></td>
                      <td className="p-2"><Input className="h-8" value={formData.ph_oi} onChange={(e) => updateField("ph_oi", e.target.value)} placeholder="-" disabled={loading} /></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium text-muted-foreground">AO</td>
                      <td className="p-2"><VASelect subfield="ao_sin_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="ao_con_correccion_lejana" /></td>
                      <td className="p-2"><VASelect subfield="ao_sin_correccion_cercana" /></td>
                      <td className="p-2"><VASelect subfield="ao_con_correccion_cercana" /></td>
                      <td className="p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* TAB 4: Examen Clínico */}
        {activeTab === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Examen Externo</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left w-32"></th>
                        <th className="p-2 text-center">OD (Derecho)</th>
                        <th className="p-2 text-center">OI (Izquierdo)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Párpados", od: "ext_parpados_od", oi: "ext_parpados_oi" },
                        { label: "Conjuntiva", od: "ext_conjuntiva_od", oi: "ext_conjuntiva_oi" },
                        { label: "Córnea", od: "ext_cornea_od", oi: "ext_cornea_oi" },
                        { label: "Iris", od: "ext_iris_od", oi: "ext_iris_oi" },
                        { label: "Pupila", od: "ext_pupila_od", oi: "ext_pupila_oi" },
                        { label: "Cristalino", od: "ext_cristalino_od", oi: "ext_cristalino_oi" },
                      ].map((row) => (
                        <tr key={row.label} className="border-b">
                          <td className="p-2 font-medium">{row.label}</td>
                          <td className="p-2"><ExtSelect field={row.od} /></td>
                          <td className="p-2"><ExtSelect field={row.oi} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-1">
                    <Label>Motilidad</Label>
                    <ExtSelect field="ext_motilidad" />
                  </div>
                  <div className="space-y-1">
                    <Label>Cover Test</Label>
                    <Select
                      value={formData.ext_cover_test === "Ortoforia" ? "Ortoforia" : formData.ext_cover_test ? "otro" : ""}
                      onValueChange={(v) => {
                        if (v === "Ortoforia") {
                          updateField("ext_cover_test", "Ortoforia")
                          setShowCoverTestDetails(false)
                        } else {
                          updateField("ext_cover_test", "")
                          setShowCoverTestDetails(true)
                        }
                      }}
                    >
                      <SelectTrigger className="h-8"><SelectValue placeholder="-" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ortoforia">Ortoforia</SelectItem>
                        <SelectItem value="otro">Otro...</SelectItem>
                      </SelectContent>
                    </Select>
                    {showCoverTestDetails && (
                      <Input
                        className="mt-2"
                        value={formData.ext_cover_test === "Ortoforia" ? "" : formData.ext_cover_test}
                        onChange={(e) => updateField("ext_cover_test", e.target.value)}
                        placeholder="Describe el resultado..."
                        disabled={loading}
                      />
                    )}
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label>Observaciones examen externo</Label>
                  <Textarea value={formData.ext_observations} onChange={(e) => updateField("ext_observations", e.target.value)} rows={2} disabled={loading} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Refracción</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left w-12"></th>
                        <th className="p-2 text-center">Esfera</th>
                        <th className="p-2 text-center">Cilindro</th>
                        <th className="p-2 text-center">Eje</th>
                        <th className="p-2 text-center">ADD</th>
                        <th className="p-2 text-center">AV</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">OD</td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_od_esfera} onChange={(e) => updateField("refraction_od_esfera", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_od_cilindro} onChange={(e) => updateField("refraction_od_cilindro", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_od_eje} onChange={(e) => updateField("refraction_od_eje", e.target.value)} placeholder="0-180" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_od_add} onChange={(e) => updateField("refraction_od_add", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_od_av} onChange={(e) => updateField("refraction_od_av", e.target.value)} placeholder="20/" disabled={loading} /></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">OI</td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_oi_esfera} onChange={(e) => updateField("refraction_oi_esfera", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_oi_cilindro} onChange={(e) => updateField("refraction_oi_cilindro", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_oi_eje} onChange={(e) => updateField("refraction_oi_eje", e.target.value)} placeholder="0-180" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_oi_add} onChange={(e) => updateField("refraction_oi_add", e.target.value)} placeholder="+/-" disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.refraction_oi_av} onChange={(e) => updateField("refraction_oi_av", e.target.value)} placeholder="20/" disabled={loading} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>DP (mm)</Label>
                    <Input value={formData.refraction_dp} onChange={(e) => updateField("refraction_dp", e.target.value)} placeholder="64" disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de lente recomendado</Label>
                    <Input value={formData.refraction_lens_type} onChange={(e) => updateField("refraction_lens_type", e.target.value)} placeholder="Monofocal, bifocal, progresivo..." disabled={loading} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Queratometría</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-left w-12"></th>
                        <th className="p-2 text-center"></th>
                        <th className="p-2 text-center"></th>
                        <th className="p-2 text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-medium">OD</td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_od_k1} onChange={(e) => updateField("keratometry_od_k1", e.target.value)} disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_od_k2} onChange={(e) => updateField("keratometry_od_k2", e.target.value)} disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_od_eje} onChange={(e) => updateField("keratometry_od_eje", e.target.value)} disabled={loading} /></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium">OI</td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_oi_k1} onChange={(e) => updateField("keratometry_oi_k1", e.target.value)} disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_oi_k2} onChange={(e) => updateField("keratometry_oi_k2", e.target.value)} disabled={loading} /></td>
                        <td className="p-2"><Input className="h-8" value={formData.keratometry_oi_eje} onChange={(e) => updateField("keratometry_oi_eje", e.target.value)} disabled={loading} /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Test Complementarios</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ishihara</Label>
                    <Input value={formData.test_ishihara} onChange={(e) => updateField("test_ishihara", e.target.value)} placeholder="Normal / Alterado" disabled={loading} />
                  </div>
                  <div className="space-y-2">
                    <Label>Estereopsis</Label>
                    <Input value={formData.test_estereopsis} onChange={(e) => updateField("test_estereopsis", e.target.value)} placeholder="Seg arco" disabled={loading} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Otros test</Label>
                  <Textarea value={formData.test_others} onChange={(e) => updateField("test_others", e.target.value)} placeholder="Otros examenes complementarios..." rows={2} disabled={loading} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: Diagnóstico */}
        {activeTab === 4 && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Diagnóstico y Observaciones</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Diagnóstico</Label>
                  <Textarea value={formData.diagnosis} onChange={(e) => updateField("diagnosis", e.target.value)} placeholder="Ingresa el diagnóstico..." rows={3} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Textarea value={formData.observations} onChange={(e) => updateField("observations", e.target.value)} placeholder="Observaciones adicionales..." rows={3} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <Label>Conducta / Recomendaciones</Label>
                  <Textarea value={formData.conduct} onChange={(e) => updateField("conduct", e.target.value)} placeholder="Uso de lentes correctivos, control anual..." rows={3} disabled={loading} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="eps_referral" checked={formData.eps_referral} onCheckedChange={(v) => updateField("eps_referral", v)} />
                    <Label htmlFor="eps_referral">Remisión a EPS</Label>
                  </div>
                  {formData.eps_referral && (
                    <Textarea
                      value={formData.eps_referral_details}
                      onChange={(e) => updateField("eps_referral_details", e.target.value)}
                      placeholder="Especifica el motivo de remisión..."
                      rows={2}
                      disabled={loading}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Firma del Profesional</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer border rounded-md px-4 py-2 text-sm hover:bg-accent transition-colors">
                    <Upload className="size-4" />
                    Subir imagen de firma
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const reader = new FileReader()
                      reader.onloadend = () => updateField("signature_professional", reader.result as string)
                      reader.readAsDataURL(file)
                    }} />
                  </label>
                  {formData.signature_professional && (
                    <img src={formData.signature_professional} alt="Firma profesional" className="h-12 object-contain border rounded" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navegación */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button type="button" variant="outline" asChild disabled={loading}>
            <Link href="/dashboard/historias">
              <ArrowLeft className="mr-2 size-4" />
              Cancelar
            </Link>
          </Button>
          <div className="flex gap-2">
            {activeTab > 0 && (
              <Button type="button" variant="outline" onClick={() => setActiveTab(activeTab - 1)} disabled={loading}>
                <ChevronLeft className="mr-2 size-4" />
                Anterior
              </Button>
            )}
            {activeTab < TABS.length - 1 ? (
              <Button type="button" onClick={() => setActiveTab(activeTab + 1)} disabled={loading}>
                Siguiente
                <ChevronRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <><Spinner className="mr-2" />Guardando...</>
                ) : (
                  <><Save className="mr-2 size-4" />{isEdit ? "Actualizar Historia" : "Guardar Historia"}</>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}