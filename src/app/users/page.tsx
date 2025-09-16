// src/app/dashboard/usuarios/page.tsx
"use client"

import { useRef, useState } from "react"
//import { DataTable } from "@/components/data-table"
import { getColumns, Usuario } from "./columns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MobileSidebar } from "@/components/mobileSidebar"
import { Sidebar } from "@/components/sidebar"
import { DataTable } from "@/components/data-table"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [search, setSearch] = useState("")
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null)
  const [abrirAdd, setAbrirAdd] = useState(false)

const handleAddUsuario = async (novoUsuario: Usuario) => {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoUsuario),
  })
  if (res.ok) {
    const data = await res.json()
    setUsuarios((prev) => [...prev, data])
    setAbrirAdd(false)
  } else {
    alert("Erro ao salvar usuário")
  }
}

  const handleEditUsuario = (usuario: Usuario) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuario.id ? usuario : u))
    )
    setEditUsuario(null)
  }

  const filteredUsuarios = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center px-4 bg-white shadow-sm">
          <MobileSidebar />
          <h1 className="ml-4 font-semibold">Usuários</h1>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <Input
                placeholder="Pesquisar usuários..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              <Dialog open={abrirAdd} onOpenChange={setAbrirAdd}>
                <DialogTrigger asChild>
                  <Button onClick={() => setAbrirAdd(true)}>
                    Adicionar Usuário
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Usuário</DialogTitle>
                    <DialogDescription className="sr-only">
                      Preencha os dados para cadastrar um novo usuário.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const novoUsuario: Usuario = {
                        id: "",
                        nome: String(fd.get("nome")),
                        email: String(fd.get("email")),
                        senha: String(fd.get("senha")),
                        tipo: String(fd.get("tipo")), // 'admin' ou 'entregador'
                      }
                      handleAddUsuario(novoUsuario)
                    }}
                    className="space-y-2"
                  >
                    <Input name="nome" placeholder="Nome" required />
                    <Input name="email" placeholder="Email" type="email" required />
                    <Input name="senha" placeholder="Senha" type="password" required />
                    <select
                      name="tipo"
                      className="border rounded-md px-2 py-1 w-full"
                      required
                    >
                      <option value="">Selecione o tipo</option>
                      <option value="admin">Admin</option>
                      <option value="entregador">Entregador</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAbrirAdd(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <DataTable
              columns={getColumns({
                onEdit: (usuario) => setEditUsuario(usuario),
                onDelete: (id) =>
                  setUsuarios((prev) => prev.filter((u) => u.id !== id)),
              })}
              data={filteredUsuarios}
            />

            {editUsuario && (
              <Dialog
                open={!!editUsuario}
                onOpenChange={() => setEditUsuario(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const usuarioEditado: Usuario = {
                        ...editUsuario,
                        nome: String(fd.get("nome")),
                        email: String(fd.get("email")),
                        senha: String(fd.get("senha")),
                        tipo: String(fd.get("tipo")),
                      }
                      handleEditUsuario(usuarioEditado)
                    }}
                    className="space-y-2"
                  >
                    <Input
                      name="nome"
                      defaultValue={editUsuario.nome}
                      required
                    />
                    <Input
                      name="email"
                      defaultValue={editUsuario.email}
                      type="email"
                      required
                    />
                    <Input
                      name="senha"
                      defaultValue={editUsuario.senha}
                      type="password"
                      required
                    />
                    <select
                      name="tipo"
                      defaultValue={editUsuario.tipo}
                      className="border rounded-md px-2 py-1 w-full"
                      required
                    >
                      <option value="admin">Admin</option>
                      <option value="entregador">Entregador</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditUsuario(null)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
