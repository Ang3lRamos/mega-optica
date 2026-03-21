"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Download } from "lucide-react"
import { ClinicalRecord, Patient, Profile } from "@/lib/types"

interface PDFDownloadButtonProps {
  record: ClinicalRecord
  patient: Patient
  optometrist: Profile
  fileName: string
}

export function PDFDownloadButton({ record, patient, optometrist, fileName }: PDFDownloadButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const [{ pdf }, { VisiometryPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/visiometry-pdf"),
      ])

      const blob = await pdf(
        <VisiometryPDF
          record={record}
          patient={patient}
          optometrist={optometrist}
        />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error generando PDF:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading}>
      {loading ? (
        <>
          <Spinner className="mr-2" />
          Generando...
        </>
      ) : (
        <>
          <Download className="mr-2 size-4" />
          Descargar PDF
        </>
      )}
    </Button>
  )
}