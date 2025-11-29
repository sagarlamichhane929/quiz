import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p>Welcome, {user.email}!</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/create-room">Create Room</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/join-room">Join Room</Link>
          </Button>
        </div>
        <form action={logout}>
          <Button variant="destructive" type="submit">Logout</Button>
        </form>
      </div>
    </div>
  )
}