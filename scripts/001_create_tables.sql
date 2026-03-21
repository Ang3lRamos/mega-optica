-- 1. Perfiles de usuario con roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('recepcionista', 'optometra', 'administrador')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Pacientes/Clientes
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identification TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F')),
  birth_date DATE,
  age INTEGER,
  occupation TEXT,
  company TEXT,
  phone TEXT,
  email TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Historias clínicas de visiometría
CREATE TABLE IF NOT EXISTS clinical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  optometrist_id UUID REFERENCES profiles(id),
  
  -- Datos del examen
  exam_date DATE DEFAULT CURRENT_DATE,
  exam_type TEXT CHECK (exam_type IN (
    'ingreso', 'cambio_ocupacion', 'periodico_programado', 
    'retiro', 'post_incapacidad', 'reintegro', 'visiometria'
  )),
  
  -- Antecedentes ocupacionales
  time_in_position TEXT,
  uses_protection BOOLEAN DEFAULT FALSE,
  protection_type TEXT,
  
  -- Examen de agudeza visual anterior
  previous_exam BOOLEAN DEFAULT FALSE,
  previous_exam_date DATE,
  has_prescribed_lenses BOOLEAN DEFAULT FALSE,
  lens_usage TEXT CHECK (lens_usage IN ('permanentes', 'ocasionales', 'cerca', 'lejos', 'otros')),
  
  -- Cirugía ocular
  ocular_surgery BOOLEAN DEFAULT FALSE,
  surgery_details TEXT,
  surgery_date DATE,
  
  -- Sintomatología actual
  current_symptoms BOOLEAN DEFAULT FALSE,
  symptoms_details TEXT,
  
  -- Agudeza Visual - OD (Ojo Derecho)
  od_far_without_correction TEXT,
  od_far_with_correction TEXT,
  od_near_without_correction TEXT,
  od_near_with_correction TEXT,
  
  -- Agudeza Visual - OI (Ojo Izquierdo)
  oi_far_without_correction TEXT,
  oi_far_with_correction TEXT,
  oi_near_without_correction TEXT,
  oi_near_with_correction TEXT,
  
  -- Examen externo
  external_exam_od TEXT,
  external_exam_oi TEXT,
  
  -- Cover Test
  cover_test_far TEXT,
  cover_test_near TEXT,
  
  -- Oftalmoscopía
  ophthalmoscopy_od TEXT,
  ophthalmoscopy_oi TEXT,
  
  -- Visión cromática
  chromatic_vision TEXT CHECK (chromatic_vision IN ('normal', 'anormal')),
  
  -- Esteropsis
  stereopsis TEXT,
  
  -- Queratometría
  keratometry_od TEXT,
  keratometry_oi TEXT,
  
  -- Retinoscopía
  retinoscopy_od TEXT,
  retinoscopy_oi TEXT,
  
  -- Diagnóstico y observaciones
  diagnosis TEXT,
  observations TEXT,
  
  -- Remisión
  eps_referral BOOLEAN DEFAULT FALSE,
  
  -- Consentimiento
  consent_signed BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_patients_identification ON patients(identification);
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);
CREATE INDEX IF NOT EXISTS idx_clinical_records_patient_id ON clinical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_records_exam_date ON clinical_records(exam_date);
