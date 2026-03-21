-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_records ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Función auxiliar para obtener el rol del usuario
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Políticas para patients
-- Todos los usuarios autenticados pueden ver pacientes
CREATE POLICY "patients_select_authenticated" ON patients 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Todos los usuarios autenticados pueden crear pacientes
CREATE POLICY "patients_insert_authenticated" ON patients 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Solo optometra y administrador pueden actualizar pacientes
CREATE POLICY "patients_update_optometra_admin" ON patients 
  FOR UPDATE USING (
    get_user_role() IN ('optometra', 'administrador')
  );

-- Solo administrador puede eliminar pacientes
CREATE POLICY "patients_delete_admin" ON patients 
  FOR DELETE USING (
    get_user_role() = 'administrador'
  );

-- Políticas para clinical_records
-- Solo optometra y administrador pueden ver historias clínicas
CREATE POLICY "clinical_records_select_optometra_admin" ON clinical_records 
  FOR SELECT USING (
    get_user_role() IN ('optometra', 'administrador')
  );

-- Solo optometra y administrador pueden crear historias clínicas
CREATE POLICY "clinical_records_insert_optometra_admin" ON clinical_records 
  FOR INSERT WITH CHECK (
    get_user_role() IN ('optometra', 'administrador')
  );

-- Solo optometra y administrador pueden actualizar historias clínicas
CREATE POLICY "clinical_records_update_optometra_admin" ON clinical_records 
  FOR UPDATE USING (
    get_user_role() IN ('optometra', 'administrador')
  );

-- Solo administrador puede eliminar historias clínicas
CREATE POLICY "clinical_records_delete_admin" ON clinical_records 
  FOR DELETE USING (
    get_user_role() = 'administrador'
  );
