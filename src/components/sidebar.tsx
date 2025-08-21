"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, QrCode, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import { useState } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Pessoas", icon: Users, href: "/dashboard/pessoas" },
    { label: "Leitor de QRCode", icon: QrCode, href: "/dashboard/validar" },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpen(!open)}
          className="bg-white shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static top-0 left-0 h-screen w-64 bg-white border-r flex flex-col shadow-sm transform transition-transform duration-300 z-40",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 font-bold text-xl border-b">Meu Sistema</div>

        <nav className="flex-1 p-4 space-y-2">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
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
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="destructive"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  )
}
