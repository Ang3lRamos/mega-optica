-- Create admin user using Supabase auth.users table
-- First delete if exists to avoid conflicts
DELETE FROM auth.users WHERE email = 'cacastillo1121@gmail.com';

-- Insert into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'cacastillo1121@gmail.com',
  crypt('1121707024An', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Carlos Castillo", "role": "administrador"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
);
