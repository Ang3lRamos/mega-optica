import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, FileDown, User } from "lucide-react"
import { EXAM_TYPE_LABELS, ClinicalRecord, Patient, Profile } from "@/lib/types"

export default async function HistoriaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: record } = await supabase
    .from("clinical_records")
    .select(`
      *,
      patients (*),
      optometrist:profiles!clinical_records_optometrist_id_fkey (*)
    `)
    .eq("id", id)
    .single()

  if (!record) {
    notFound()
  }

  const patient = record.patients as Patient
  const optometrist = record.optometrist as Profile
  const visualAcuity = record.visual_acuity as ClinicalRecord["visual_acuity"]
  const externalExam = record.external_exam as ClinicalRecord["external_exam"]
  const coverTest = record.cover_test as ClinicalRecord["cover_test"]
  const oftalmoscopia = record.oftalmoscopia as ClinicalRecord["oftalmoscopia"]
  const queratometria = record.queratometria as ClinicalRecord["queratometria"]
  const retinoscopia = record.retinoscopia as ClinicalRecord["retinoscopia"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/historias">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Historia Clínica
            </h1>
            <p className="text-muted-foreground">
              {new Date(record.exam_date).toLocaleDateString("es-CO", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/historias/${id}/editar`}>
              <Edit className="mr-2 size-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/historias/${id}/pdf`}>
              <FileDown className="mr-2 size-4" />
              Descargar PDF
            </Link>
          </Button>
        </div>
      </div>

      {/* Patient Info */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <User className="size-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>{patient.full_name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {patient.identification_type}: {patient.identification_number} | {patient.age} años | {patient.gender === "M" ? "Masculino" : "Femenino"}
            </p>
          </div>
          <Badge>{EXAM_TYPE_LABELS[record.exam_type as keyof typeof EXAM_TYPE_LABELS]}</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-medium">{patient.company || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ocupación</p>
              <p className="font-medium">{patient.occupation || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Optómetra</p>
              <p className="font-medium">{optometrist?.full_name || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Antecedentes ocupacionales */}
      <Card>
        <CardHeader>
          <CardTitle>Antecedentes Ocupacionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">¿Usa protección?</p>
              <p className="font-medium">{record.uses_protection ? "Sí" : "No"}</p>
            </div>
            {record.uses_protection && (
              <div>
                <p className="text-sm text-muted-foreground">Tipo de protección</p>
                <p className="font-medium">{record.protection_type || "-"}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Tiempo en el oficio</p>
              <p className="font-medium">{record.time_in_job || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examen anterior */}
      <Card>
        <CardHeader>
          <CardTitle>Examen de Agudeza Visual Anterior</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">¿Visiometría anterior?</p>
              <p className="font-medium">{record.previous_exam ? "Sí" : "No"}</p>
            </div>
            {record.previous_exam && (
              <div>
                <p className="text-sm text-muted-foreground">Fecha último examen</p>
                <p className="font-medium">
                  {record.previous_exam_date
                    ? new Date(record.previous_exam_date).toLocaleDateString("es-CO")
                    : "-"}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">¿Tiene lentes formulados?</p>
              <p className="font-medium">{record.has_prescribed_lenses ? "Sí" : "No"}</p>
            </div>
            {record.has_prescribed_lenses && (
              <div>
                <p className="text-sm text-muted-foreground">Forma de uso</p>
                <p className="font-medium capitalize">{record.lens_usage?.replace(/_/g, " ") || "-"}</p>
              </div>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Cirugía ocular</p>
              <p className="font-medium">
                {record.ocular_surgery
                  ? `${record.surgery_details || "Sí"} ${record.surgery_date ? `(${new Date(record.surgery_date).toLocaleDateString("es-CO")})` : ""}`
                  : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sintomatología ocular actual</p>
              <p className="font-medium">
                {record.current_ocular_symptoms ? record.symptoms_details || "Sí" : "No"}
              </p>
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
                <tr className="border-b bg-muted/50">
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
                  <td className="p-2 text-center">{visualAcuity?.od_sin_correccion_lejana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.od_con_correccion_lejana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.od_sin_correccion_cercana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.od_con_correccion_cercana || "-"}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">OI (Ojo Izquierdo)</td>
                  <td className="p-2 text-center">{visualAcuity?.oi_sin_correccion_lejana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.oi_con_correccion_lejana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.oi_sin_correccion_cercana || "-"}</td>
                  <td className="p-2 text-center">{visualAcuity?.oi_con_correccion_cercana || "-"}</td>
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Examen Externo</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">OD:</span> {externalExam?.od || "-"}</p>
                <p><span className="font-medium">OI:</span> {externalExam?.oi || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cover Test</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">Lejos:</span> {coverTest?.lejos || "-"}</p>
                <p><span className="font-medium">Cerca:</span> {coverTest?.cerca || "-"}</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Oftalmoscopía</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">OD:</span> {oftalmoscopia?.od || "-"}</p>
                <p><span className="font-medium">OI:</span> {oftalmoscopia?.oi || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Visión Cromática / Estereopsis</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">Visión Cromática:</span> {record.chromatic_vision === "normal" ? "Normal" : "Anormal"}</p>
                <p><span className="font-medium">Estereopsis:</span> {record.estereopsis || "-"}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Queratometría</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">OD:</span> {queratometria?.od || "-"}</p>
                <p><span className="font-medium">OI:</span> {queratometria?.oi || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retinoscopía</p>
              <div className="mt-1 grid gap-2">
                <p><span className="font-medium">OD:</span> {retinoscopia?.od || "-"}</p>
                <p><span className="font-medium">OI:</span> {retinoscopia?.oi || "-"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico y Observaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Diagnóstico</p>
            <p className="mt-1 whitespace-pre-wrap">{record.diagnosis || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
            <p className="mt-1 whitespace-pre-wrap">{record.observations || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Remisión a EPS</p>
            <Badge variant={record.eps_referral ? "default" : "secondary"}>
              {record.eps_referral ? "Sí" : "No"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
