-- Impide que un usuario se asigne a sí mismo el rol de administrador (u otro rol).
-- Ejecutar en Supabase → SQL Editor.

-- 1. Función de rol con search_path fijo (buena práctica para SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Solo un administrador puede cambiar el rol de un perfil.
--    Las llamadas con service role key o desde el SQL Editor (auth.uid() es NULL) siguen permitidas.
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND auth.uid() IS NOT NULL
     AND public.get_user_role() IS DISTINCT FROM 'administrador' THEN
    RAISE EXCEPTION 'No tienes permiso para cambiar el rol';
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'No se puede cambiar el id del perfil';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_role_change ON public.profiles;

CREATE TRIGGER profiles_prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_change();

-- 3. Un usuario solo puede crear su propio perfil y únicamente como recepcionista
--    (lo usa app/dashboard/layout.tsx cuando falta el perfil)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id AND role = 'recepcionista');

-- 4. El trigger de registro ya no confía en user_metadata (lo controla quien se registra).
--    El rol se toma de app_metadata, que solo se puede escribir con la service role key.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE(NEW.raw_app_meta_data ->> 'role', 'recepcionista')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;
