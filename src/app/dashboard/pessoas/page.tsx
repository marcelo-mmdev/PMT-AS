"use client"

import { useEffect, useState, useMemo } from "react"
import { Pessoa } from "@/types/pessoa"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// schema de validação
const pessoaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  rg: z.string().optional(),
  endereco: z.string().min(5, "Endereço inválido"),
  telefone: z.string().min(8, "Telefone inválido"),
  dataNascimento: z.string().nonempty("Data de nascimento obrigatória"),
})

type PessoaForm = z.infer<typeof pessoaSchema>

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [search, setSearch] = useState("")
  const [editPessoa, setEditPessoa] = useState<Pessoa | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // form compartilhado (para cadastro e edição)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PessoaForm>({
    resolver: zodResolver(pessoaSchema),
  })

  useEffect(() => {
    fetch("/api/pessoas")
      .then(res => res.json())
      .then(setPessoas)
  }, [])

  // adicionar pessoa
  const addPessoa = async (data: PessoaForm) => {
    if (editPessoa) {
      // edição
      const res = await fetch(`/api/pessoas/${editPessoa.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      setPessoas(pessoas.map(p => (p.id === updated.id ? updated : p)))
    } else {
      // cadastro novo
      const res = await fetch("/api/pessoas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const nova = await res.json()
      setPessoas([...pessoas, nova])
    }

    reset()
    setEditPessoa(null)
    setIsModalOpen(false)
  }

  // deletar pessoa
  const deletePessoa = async (id: string) => {
    await fetch(`/api/pessoas/${id}`, { method: "DELETE" })
    setPessoas(pessoas.filter(p => p.id !== id))
  }

  // abrir modal edição
  const openEditModal = (pessoa: Pessoa) => {
    setEditPessoa(pessoa)
    reset(pessoa)
    setIsModalOpen(true)
  }

  // abrir modal cadastro
  const openCreateModal = () => {
    setEditPessoa(null)
    reset()
    setIsModalOpen(true)
  }

  // filtro
  const filtered = useMemo(
    () =>
      pessoas.filter(p =>
        p.nome.toLowerCase().includes(search.toLowerCase()) ||
        p.cpf.includes(search) ||
        (p.telefone?.includes(search) ?? false)
      ),
    [pessoas, search]
  )

  // paginação calculada
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage)

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Buscar por nome, CPF ou telefone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={openCreateModal} className="bg-blue-600 text-white">
          + Cadastrar Pessoa
        </Button>
      </div>

      {/* tabela */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nome</th>
            <th className="p-2 border">CPF</th>
            <th className="p-2 border">RG</th>
            <th className="p-2 border">Endereço</th>
            <th className="p-2 border">Telefone</th>
            <th className="p-2 border">Data Nasc.</th>
            <th className="p-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(p => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">{p.nome}</td>
              <td className="border p-2">{p.cpf}</td>
              <td className="border p-2">{p.rg}</td>
              <td className="border p-2">{p.endereco}</td>
              <td className="border p-2">{p.telefone}</td>
              <td className="border p-2">{p.dataNascimento}</td>
              <td className="border p-2 space-x-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deletePessoa(p.id)}>
                  Excluir
                </Button>
              </td>
            </tr>
          ))}

          {paginated.length === 0 && (
            <tr>
              <td colSpan={7} className="p-4 text-gray-500">
                Nenhuma pessoa encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}

      {/* Modal de cadastro/edição */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editPessoa ? "Editar Pessoa" : "Cadastrar Pessoa"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(addPessoa)} className="grid grid-cols-1 gap-2">
            <Input placeholder="Nome" {...register("nome")} />
            {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}

            <Input placeholder="CPF" {...register("cpf")} />
            {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}

            <Input placeholder="RG" {...register("rg")} />

            <Input placeholder="Endereço" {...register("endereco")} />
            {errors.endereco && <p className="text-red-500 text-sm">{errors.endereco.message}</p>}

            <Input placeholder="Telefone" {...register("telefone")} />
            {errors.telefone && <p className="text-red-500 text-sm">{errors.telefone.message}</p>}

            <Input type="date" {...register("dataNascimento")} />
            {errors.dataNascimento && (
              <p className="text-red-500 text-sm">{errors.dataNascimento.message}</p>
            )}

            <DialogFooter>
              <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-green-600 text-white">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
