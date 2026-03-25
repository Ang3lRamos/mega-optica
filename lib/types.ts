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
  gender: 'M' | 'F' | 'O' | 'NB' | 'GF' | 'ND' | string
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

export interface ClinicalRecord {
  id: string
  patient_id: string
  optometrist_id: string
  exam_date: string
  exam_type: ExamType
  consultation_reason: string | null

  // Antecedentes personales
  personal_history: string[]
  personal_history_other: string | null
  family_history: string[]
  family_history_other: string | null

  // Antecedentes ocupacionales
  uses_protection: boolean
  protection_type: string | null
  time_in_job: string | null
  occupational_exposures: string[]
  previous_exam: boolean
  previous_exam_date: string | null
  has_prescribed_lenses: boolean
  lens_usage: 'permanentes' | 'ocasionales' | 'para_ver_cerca' | 'para_ver_lejos' | 'otros' | null
  ocular_surgery: boolean
  surgery_details: string | null
  surgery_date: string | null
  current_ocular_symptoms: boolean
  current_symptoms: boolean
  symptoms_details: string | null

  // Agudeza visual
  visual_acuity: VisualAcuity
  ph_od: string | null
  ph_oi: string | null
  ao_far_without_correction: string | null
  ao_far_with_correction: string | null
  ao_near_without_correction: string | null
  ao_near_with_correction: string | null

  // Examen externo detallado
  ext_parpados_od: string | null
  ext_parpados_oi: string | null
  ext_conjuntiva_od: string | null
  ext_conjuntiva_oi: string | null
  ext_cornea_od: string | null
  ext_cornea_oi: string | null
  ext_iris_od: string | null
  ext_iris_oi: string | null
  ext_pupila_od: string | null
  ext_pupila_oi: string | null
  ext_cristalino_od: string | null
  ext_cristalino_oi: string | null
  ext_motilidad: string | null
  ext_cover_test: string | null
  ext_ppc: string | null
  ext_observations: string | null

  // Refracción
  refraction_od_esfera: string | null
  refraction_od_cilindro: string | null
  refraction_od_eje: string | null
  refraction_od_add: string | null
  refraction_od_av: string | null
  refraction_oi_esfera: string | null
  refraction_oi_cilindro: string | null
  refraction_oi_eje: string | null
  refraction_oi_add: string | null
  refraction_oi_av: string | null
  refraction_dp: string | null
  refraction_lens_type: string | null

  // Queratometría
  keratometry_od_k1: string | null
  keratometry_od_k2: string | null
  keratometry_od_eje: string | null
  keratometry_oi_k1: string | null
  keratometry_oi_k2: string | null
  keratometry_oi_eje: string | null

  // Test complementarios
  test_ishihara: string | null
  test_estereopsis: string | null
  test_others: string | null

  // Visión cromática
  chromatic_vision: 'normal' | 'anormal'
  estereopsis: string | null

  // Diagnóstico
  diagnosis: string | null
  observations: string | null
  conduct: string | null
  occupational_concept: string | null
  eps_referral: boolean
  eps_referral_details: string | null

  // Profesional y firmas
  professional_name: string | null
  professional_registration: string | null
  signature_professional: string | null
  signature_patient: string | null

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
    canEditPatients: true,
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