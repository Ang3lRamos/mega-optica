"use client"

import { useState, useEffect } from "react"
import { ClinicalRecord, Patient, Profile } from "@/lib/types"

interface PDFViewerWrapperProps {
  record: ClinicalRecord
  patient: Patient
  optometrist: Profile
}

export function PDFViewerWrapper({ record, patient, optometrist }: PDFViewerWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const [PDFViewer, setPDFViewer] = useState<any>(null)
  const [VisiometryPDF, setVisiometryPDF] = useState<any>(null)

  useEffect(() => {
    async function loadModules() {
      const [pdfRenderer, visiometryModule] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/visiometry-pdf"),
      ])
      setPDFViewer(() => pdfRenderer.PDFViewer)
      setVisiometryPDF(() => visiometryModule.VisiometryPDF)
      setMounted(true)
    }
    loadModules()
  }, [])

  if (!mounted || !PDFViewer || !VisiometryPDF) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Cargando vista previa...
      </div>
    )
  }

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <VisiometryPDF
        record={record}
        patient={patient}
        optometrist={optometrist}
      />
    </PDFViewer>
  )
}