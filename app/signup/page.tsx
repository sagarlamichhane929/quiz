'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div>
              <Input name="name" type="text" placeholder="Name" required />
              {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
            </div>
            <div>
              <Input name="email" type="email" placeholder="Email" required />
              {state?.errors?.email && <p className="text-red-500 text-sm">{state.errors.email}</p>}
            </div>
            <div>
              <Input name="password" type="password" placeholder="Password" required />
              {state?.errors?.password && <p className="text-red-500 text-sm">{state.errors.password}</p>}
            </div>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Signing up...' : 'Sign Up'}
            </Button>
            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-blue-500">Already have an account? Login</a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}