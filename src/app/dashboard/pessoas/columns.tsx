"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Pessoa } from "@/types/pessoa"
//import { Pessoa } from "./types"

export type { Pessoa }

export function getColumns({
  onEdit,
  onDelete,
  onCarteirinha,
}: {
  onEdit: (pessoa: Pessoa) => void
  onDelete: (id: string) => void
  onCarteirinha: (pessoa: Pessoa) => void
}): ColumnDef<Pessoa>[] {
  return [
    {
      accessorKey: "nome",
      header: "Nome",
    },
    {
      accessorKey: "cpf",
      header: "CPF",
    },
    {
      accessorKey: "rg",
      header: "RG",
    },
    {
      accessorKey: "telefone",
      header: "Telefone",
    },
    {
      accessorKey: "endereco",
      header: "Endereço",
    },
    {
      accessorKey: "dataNascimento",
      header: "Nascimento",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              status === "lido"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status === "lido" ? "✔️ Lido" : "⏳ Pendente"}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const pessoa = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(pessoa)}>
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCarteirinha(pessoa)}
            >
              Carteirinha
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(pessoa.id)}
            >
              Excluir
            </Button>
          </div>
        )
      },
    },
  ]
}
