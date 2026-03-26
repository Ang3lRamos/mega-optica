"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { Eye, FileDown, Search, Trash2, Edit } from "lucide-react"
import { EXAM_TYPE_LABELS } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"

interface Record {
  id: string
  exam_date: string
  exam_type: string
  diagnosis: string | null
  patients: { id: string; full_name: string; identification_number: string } | null
  optometrist: { full_name: string } | null
}

interface RecordsListProps {
  records: Record[]
  canDelete: boolean
}

export function RecordsList({ records, canDelete }: RecordsListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = records.filter((record) => {
    if (!search) return true
    const q = search.toLowerCase()
    const patient = record.patients
    return (
      patient?.full_name.toLowerCase().includes(q) ||
      patient?.identification_number.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await supabase.from("clinical_records").delete().eq("id", id)
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros de Visiometría</CardTitle>
        <CardDescription>{filtered.length} registros encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o identificación del paciente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {filtered.length > 0 ? (
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
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {new Date(record.exam_date).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.patients?.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          CC: {record.patients?.identification_number}
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
                      {record.optometrist?.full_name || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/historias/${record.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/historias/${record.id}/editar`}>
                            <Edit className="size-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/historias/${record.id}/pdf`}>
                            <FileDown className="size-4" />
                          </Link>
                        </Button>
                        {canDelete && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                {deletingId === record.id ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar historia clínica?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el registro de <strong>{record.patients?.full_name}</strong> del {new Date(record.exam_date).toLocaleDateString("es-CO")}. No se puede deshacer.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(record.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            {search ? "No se encontraron registros con esos criterios" : "No hay historias clínicas registradas"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}