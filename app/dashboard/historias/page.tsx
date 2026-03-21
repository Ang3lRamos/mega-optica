import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, FileDown } from "lucide-react"
import { EXAM_TYPE_LABELS } from "@/lib/types"
import { RecordsSearch } from "@/components/records-search"

export default async function HistoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const searchQuery = params.q || ""

  let query = supabase
    .from("clinical_records")
    .select(`
      id,
      exam_date,
      exam_type,
      diagnosis,
      patients (
        id,
        full_name,
        identification_number
      ),
      optometrist:profiles!clinical_records_optometrist_id_fkey (
        full_name
      )
    `)
    .order("exam_date", { ascending: false })

  const { data: records } = await query.limit(50)

  // Filter client-side if search query exists (for patient name/ID)
  const filteredRecords = searchQuery
    ? records?.filter((record) => {
        const patient = record.patients as { full_name: string; identification_number: string } | null
        if (!patient) return false
        const search = searchQuery.toLowerCase()
        return (
          patient.full_name.toLowerCase().includes(search) ||
          patient.identification_number.toLowerCase().includes(search)
        )
      })
    : records

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Historias Clínicas
          </h1>
          <p className="text-muted-foreground">
            Gestiona los registros de visiometría
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/historias/nueva">
            <Plus className="mr-2 size-4" />
            Nueva Historia
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registros de Visiometría</CardTitle>
          <CardDescription>
            {filteredRecords?.length || 0} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <RecordsSearch defaultValue={searchQuery} />
          </div>

          {filteredRecords && filteredRecords.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead className="hidden md:table-cell">Tipo</TableHead>
                    <TableHead className="hidden lg:table-cell">Diagnóstico</TableHead>
                    <TableHead className="hidden xl:table-cell">Optómetra</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const patient = record.patients as {
                      id: string
                      full_name: string
                      identification_number: string
                    } | null
                    const optometrist = record.optometrist as { full_name: string } | null

                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.exam_date).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{patient?.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              CC: {patient?.identification_number}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">
                            {EXAM_TYPE_LABELS[record.exam_type as keyof typeof EXAM_TYPE_LABELS]}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs truncate">
                          {record.diagnosis || "-"}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {optometrist?.full_name || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/historias/${record.id}`}>
                                <Eye className="size-4" />
                                <span className="sr-only">Ver</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/historias/${record.id}/pdf`}>
                                <FileDown className="size-4" />
                                <span className="sr-only">PDF</span>
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              {searchQuery
                ? "No se encontraron registros con esos criterios"
                : "No hay historias clínicas registradas"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
