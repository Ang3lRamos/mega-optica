"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft, Download, Eye } from "lucide-react"
import { ClinicalRecord, Patient, Profile } from "@/lib/types"
import { PDFDownloadButton } from "@/components/pdf-download-button"
import { PDFViewerWrapper } from "@/components/pdf-viewer-wrapper"

export default function PDFPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [record, setRecord] = useState<ClinicalRecord | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [optometrist, setOptometrist] = useState<Profile | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error: fetchError } = await supabase
          .from("clinical_records")
          .select(`
            *,
            patients (*),
            optometrist:profiles!clinical_records_optometrist_id_fkey (*)
          `)
          .eq("id", id)
          .single()

        if (fetchError || !data) {
          setError("No se encontró la historia clínica")
          return
        }

        setRecord(data as ClinicalRecord)
        setPatient(data.patients as Patient)
        setOptometrist(data.optometrist as Profile)
      } catch {
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !record || !patient || !optometrist) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex h-32 items-center justify-center">
            <p className="text-muted-foreground">{error || "Error al cargar"}</p>
          </CardContent>
        </Card>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" />
          Volver
        </Button>
      </div>
    )
  }

  const fileName = `visiometria_${patient.identification_number}_${record.exam_date}.pdf`

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/historias/`}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Generar PDF
            </h1>
            <p className="text-muted-foreground">
              Historia clínica de {patient.full_name}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="mr-2 size-4" />
            {showPreview ? "Ocultar" : "Vista previa"}
          </Button>
          <PDFDownloadButton
            record={record}
            patient={patient}
            optometrist={optometrist}
            fileName={fileName}
          />
        </div>
      </div>

      {showPreview && (
        <Card>
          <CardContent className="p-0">
            <div className="h-[80vh] w-full">
              <PDFViewerWrapper
                record={record}
                patient={patient}
                optometrist={optometrist}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {!showPreview && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Download className="size-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">PDF listo para descargar</h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic en el botón de descarga para obtener el documento
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Paciente: {patient.full_name}</p>
                <p>{patient.identification_type}: {patient.identification_number}</p>
                <p>Fecha: {new Date(record.exam_date).toLocaleDateString("es-CO")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}