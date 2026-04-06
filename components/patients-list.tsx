"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { Eye, FileText, Pencil, Search, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Patient {
  id: string
  full_name: string
  identification_type: string
  identification_number: string
  age: number
  gender: string
  company: string | null
  phone: string | null
}

interface PatientsListProps {
  patients: Patient[]
  permissions: {
    canEditPatients: boolean
    canCreateRecords: boolean
    canDeletePatients: boolean
  }
}

export function PatientsList({ patients, permissions }: PatientsListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filtered = patients.filter((patient) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      patient.full_name.toLowerCase().includes(q) ||
      patient.identification_number.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await supabase
        .from("patients")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Pacientes</CardTitle>
        <CardDescription>{filtered.length} pacientes encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre o identificación..."
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
                  <TableHead>Identificación</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead className="hidden md:table-cell">Género</TableHead>
                  <TableHead className="hidden md:table-cell">Empresa</TableHead>
                  <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {patient.identification_type}
                        </span>
                        <p className="font-medium">{patient.identification_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{patient.full_name}</p>
                        <p className="text-sm text-muted-foreground">{patient.age} años</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {patient.gender === "M" ? "Masculino" : "Femenino"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {patient.company || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {patient.phone || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/pacientes/${patient.id}`}>
                            <Eye className="size-4" />
                          </Link>
                        </Button>
                        {permissions.canEditPatients && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/pacientes/${patient.id}/editar`}>
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                        )}
                        {permissions.canCreateRecords && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/historias/nueva?paciente=${patient.id}`}>
                              <FileText className="size-4" />
                            </Link>
                          </Button>
                        )}
                        {permissions.canDeletePatients && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                {deletingId === patient.id ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar paciente?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción desactivará a <strong>{patient.full_name}</strong> y no aparecerá más en el sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(patient.id)}
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
            {search ? "No se encontraron pacientes con esos criterios" : "No hay pacientes registrados"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}