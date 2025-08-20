"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

export type Pessoa = {
  id: string
  nome: string
  cpf: string
  rg: string
  endereco: string
  telefone: string
  dataNascimento: string
}

interface ColumnActions {
  onEdit: (pessoa: Pessoa) => void
  onDelete: (id: string) => void
  onCarteirinha: (pessoa: Pessoa) => void
}

export function getColumns({
  onEdit,
  onDelete,
  onCarteirinha,
}: ColumnActions): ColumnDef<Pessoa>[] {
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
      accessorKey: "dataNascimento",
      header: "Nascimento",
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const pessoa = row.original
        return (
          <div className="flex gap-2">
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              variant="outline"
              size="sm"
              onClick={() => onEdit(pessoa)}
            >
              Editar
            </Button>
            <Button
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white"
              size="sm"
              onClick={() => onDelete(pessoa.id)}
            >
              Excluir
            </Button>
            <Button
              variant="secondary"
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              onClick={() => onCarteirinha(pessoa)}
            >
              Carteirinha
            </Button>
          </div>
        )
      },
    },
  ]
}
