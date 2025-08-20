"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()

  const routes = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Pessoas", icon: Users, href: "/dashboard/pessoas" },
    { label: "Relatórios", icon: BarChart3, href: "/dashboard/relatorios" },
  ]

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col shadow-sm">
      <div className="p-6 font-bold text-xl border-b">Meu Sistema</div>

      <nav className="flex-1 p-4 space-y-2">
        {routes.map(route => {
          const Icon = route.icon
          return (
            <Link key={route.href} href={route.href}>
              <Button
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-2")}
              >
                <Icon className="h-5 w-5" />
                {route.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button onClick={() => signOut({ callbackUrl: "/login" })} variant="destructive" className="w-full justify-start gap-2">
          <LogOut className="h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  )
}
