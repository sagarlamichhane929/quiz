'use client'

import { useActionState } from 'react'
import { signInAnonymously } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GuestPage() {
  const [state, action, pending] = useActionState(signInAnonymously, undefined)

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Play as Guest</CardTitle>
          <CardDescription>Join quizzes anonymously</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <Button type="submit" disabled={pending} className="w-full">
              {pending ? 'Signing in...' : 'Continue as Guest'}
            </Button>
            {state?.message && <p className="text-red-500 text-sm">{state.message}</p>}
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-blue-500">Or login with account</a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}