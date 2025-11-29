'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validations'

export async function login(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase.auth.signInWithPassword(validatedFields.data)

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  const validatedFields = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: { name: validatedFields.data.name },
    },
  })

  if (error) {
    return { message: error.message }
  }

  redirect('/verify-email')
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInAnonymously() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInAnonymously()

  if (error) {
    return { message: error.message }
  }

  redirect('/dashboard')
}