import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'cacastillo1121@gmail.com'
  const password = '1121707024An'
  
  console.log('Creating admin user:', email)
  
  // Create user with admin API
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Carlos Castillo',
      role: 'administrador'
    }
  })
  
  if (userError) {
    console.error('Error creating user:', userError.message)
    process.exit(1)
  }
  
  console.log('User created successfully:', userData.user.id)
  
  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: userData.user.id,
      email: email,
      full_name: 'Carlos Castillo',
      role: 'administrador'
    })
  
  if (profileError) {
    console.error('Error creating profile:', profileError.message)
  } else {
    console.log('Profile created successfully')
  }
  
  console.log('Admin user created successfully!')
  console.log('Email:', email)
  console.log('Password:', password)
}

createAdminUser()
