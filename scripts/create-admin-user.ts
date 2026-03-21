import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'cacastillo1121@gmail.com'
  const password = '1121707024An'
  const fullName = 'Administrador'
  const role = 'administrador'

  console.log('Creating admin user...')

  // Create user with admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
    user_metadata: {
      full_name: fullName,
      role: role
    }
  })

  if (authError) {
    console.error('Error creating user:', authError.message)
    return
  }

  console.log('User created successfully:', authData.user?.id)

  // The trigger should create the profile automatically, but let's verify
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user?.id)
    .single()

  if (profileError) {
    console.log('Profile not found, creating manually...')
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user?.id,
        full_name: fullName,
        role: role
      })

    if (insertError) {
      console.error('Error creating profile:', insertError.message)
    } else {
      console.log('Profile created successfully')
    }
  } else {
    console.log('Profile exists:', profile)
  }

  console.log('\nAdmin user created!')
  console.log('Email:', email)
  console.log('Password:', password)
}

createAdminUser()
