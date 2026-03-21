-- Actualizar el perfil del admin para asegurar que tenga rol de administrador
UPDATE public.profiles 
SET 
  role = 'administrador',
  full_name = 'Carlos Castillo'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'cacastillo1121@gmail.com'
);

-- Si no existe el profile, créalo
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Carlos Castillo', 'administrador'
FROM auth.users 
WHERE email = 'cacastillo1121@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'administrador', full_name = 'Carlos Castillo';
