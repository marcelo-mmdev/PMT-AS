"use client"

import { ColumnDef } from "@tanstack/react-table"
//import { Pessoa } from "./columns" // ⚠️ Se der loop, mova o type Pessoa p/ types.ts
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

interface ActionsProps {
  onEdit: (pessoa: Pessoa) => void
  onDelete: (id: string) => void
  onCarteirinha: (pessoa: Pessoa) => void
}

export const getColumns = ({
  onEdit,
  onDelete,
  onCarteirinha,
}: ActionsProps): ColumnDef<Pessoa>[] => [
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
    accessorKey: "dataNascimento",
    header: "Nascimento",
  },
  {
    accessorKey: "telefone",
    header: "Telefone",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const pessoa = row.original
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(pessoa)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(pessoa.id)}
          >
            Excluir
          </Button>
          <Button
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
