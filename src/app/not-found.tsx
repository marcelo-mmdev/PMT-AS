import Link from "next/link"
//import { auth } from "@/auth" // usamos a sessão
//import { Button } from "@/components/ui/button" // caso tenha shadcn/ui, se não pode usar <a>
import { auth } from "@/types/auth"

export default async function NotFoundPage() {
  const session = await auth()

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold mb-4 text-red-600">404</h1>
      <p className="text-lg text-gray-700 mb-6">Página não encontrada</p>

      {!session ? (
        <Link href="/login">
          <button className="px-6 py-2">
            Ir para Login
          </button>
        </Link>
      ) : (
        <Link href="/dashboard">
          <button className="px-6 py-2">
            Ir para Dashboard
          </button>
        </Link>
      )}
    </main>
  )
}
