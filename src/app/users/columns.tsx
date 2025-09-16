'use client'
import { ColumnDef } from "@tanstack/react-table"
//import { Usuario } from "./types"
import { Button } from "@/components/ui/button"
import { Usuario } from "@/interface/user"

interface GetColumnsProps {
  onEdit: (usuario: Usuario) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: GetColumnsProps): ColumnDef<Usuario>[] => [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const tipo = row.original.tipo
      return tipo === "admin" ? "Admin" : "Entregador"
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.original.id)}
        >
          Deletar
        </Button>
      </div>
    ),
  },
]

export type { Usuario }