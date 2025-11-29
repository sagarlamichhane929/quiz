import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Quiz App</h1>
        <p className="text-lg text-zinc-600">Create and join quiz rooms</p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/guest">Play as Guest</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
