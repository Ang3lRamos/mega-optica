import { PatientForm } from "@/components/patient-form"

export default function NuevoPacientePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nuevo Paciente
        </h1>
        <p className="text-muted-foreground">
          Registra un nuevo paciente en el sistema
        </p>
      </div>

      <PatientForm />
    </div>
  )
}
