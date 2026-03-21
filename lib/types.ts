export type UserRole = 'recepcionista' | 'optometra' | 'administrador'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  identification_type: string
  identification_number: string
  full_name: string
  gender: 'M' | 'F'
  birth_date: string
  age: number
  phone: string
  email: string | null
  address: string | null
  company: string | null
  occupation: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export type ExamType = 
  | 'ingreso' 
  | 'cambio_ocupacion' 
  | 'periodico_programado' 
  | 'retiro' 
  | 'post_incapacidad' 
  | 'reintegro' 
  | 'visiometria'

export interface VisualAcuity {
  od_sin_correccion_lejana: string
  od_con_correccion_lejana: string
  oi_sin_correccion_lejana: string
  oi_con_correccion_lejana: string
  od_sin_correccion_cercana: string
  od_con_correccion_cercana: string
  oi_sin_correccion_cercana: string
  oi_con_correccion_cercana: string
}

export interface ExternalExam {
  od: string
  oi: string
}

export interface CoverTest {
  lejos: string
  cerca: string
}

export interface Oftalmoscopia {
  od: string
  oi: string
}

export interface Queratometria {
  od: string
  oi: string
}

export interface Retinoscopia {
  od: string
  oi: string
}

export interface ClinicalRecord {
  id: string
  patient_id: string
  optometrist_id: string
  exam_date: string
  exam_type: ExamType
  
  // Antecedentes ocupacionales
  uses_protection: boolean
  protection_type: string | null
  time_in_job: string | null
  
  // Examen de agudeza visual anterior
  previous_exam: boolean
  previous_exam_date: string | null
  has_prescribed_lenses: boolean
  lens_usage: 'permanentes' | 'ocasionales' | 'para_ver_cerca' | 'para_ver_lejos' | 'otros' | null
  ocular_surgery: boolean
  surgery_details: string | null
  surgery_date: string | null
  current_ocular_symptoms: boolean
  symptoms_details: string | null
  
  // Agudeza visual
  visual_acuity: VisualAcuity
  
  // Examen externo
  external_exam: ExternalExam
  
  // Cover test
  cover_test: CoverTest
  
  // Oftalmoscopía
  oftalmoscopia: Oftalmoscopia
  
  // Visión cromática
  chromatic_vision: 'normal' | 'anormal'
  estereopsis: string | null
  
  // Queratometría
  queratometria: Queratometria
  
  // Retinoscopía
  retinoscopia: Retinoscopia
  
  // Diagnóstico y observaciones
  diagnosis: string
  observations: string | null
  
  // Remisión
  eps_referral: boolean
  
  created_at: string
  updated_at: string
  
  // Relations
  patient?: Patient
  optometrist?: Profile
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  ingreso: 'Ingreso',
  cambio_ocupacion: 'Cambio de Ocupación',
  periodico_programado: 'Periódico Programado',
  retiro: 'Retiro',
  post_incapacidad: 'Post-Incapacidad',
  reintegro: 'Reintegro',
  visiometria: 'Visiometría'
}

export const ROLE_LABELS: Record<UserRole, string> = {
  recepcionista: 'Recepcionista',
  optometra: 'Optómetra',
  administrador: 'Administrador'
}

export const ROLE_PERMISSIONS: Record<UserRole, {
  canCreatePatients: boolean
  canEditPatients: boolean
  canDeletePatients: boolean
  canCreateRecords: boolean
  canEditRecords: boolean
  canDeleteRecords: boolean
  canManageUsers: boolean
}> = {
  recepcionista: {
    canCreatePatients: true,
    canEditPatients: false,
    canDeletePatients: false,
    canCreateRecords: false,
    canEditRecords: false,
    canDeleteRecords: false,
    canManageUsers: false
  },
  optometra: {
    canCreatePatients: true,
    canEditPatients: true,
    canDeletePatients: false,
    canCreateRecords: true,
    canEditRecords: true,
    canDeleteRecords: false,
    canManageUsers: false
  },
  administrador: {
    canCreatePatients: true,
    canEditPatients: true,
    canDeletePatients: true,
    canCreateRecords: true,
    canEditRecords: true,
    canDeleteRecords: true,
    canManageUsers: true
  }
}
