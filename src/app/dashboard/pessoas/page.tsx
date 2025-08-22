"use client"

import { useRef, useState } from "react"
import { DataTable } from "@/components/data-table"
import { getColumns, Pessoa } from "./columns"
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
import { QRCodeCanvas } from "qrcode.react"
import { jsPDF } from "jspdf"
import { MobileSidebar } from "@/components/mobileSidebar"
import { Sidebar } from "@/components/sidebar"

export default function PessoasPage() {
  // Estados principais
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [search, setSearch] = useState("")
  const [editPessoa, setEditPessoa] = useState<Pessoa | null>(null)
  const [carteirinhaPessoa, setCarteirinhaPessoa] = useState<Pessoa | null>(null)
  const [abrirAdd, setAbrirAdd] = useState(false)

  // ref para captar o canvas do QR e inserir no PDF
  const qrRef = useRef<HTMLCanvasElement | null>(null)

  // --- CRUD Pessoas ---
  const handleAddPessoa = (novaPessoa: Pessoa) => {
    setPessoas((prev) => [
      ...prev,
      { ...novaPessoa, id: String(Date.now()) },
    ])
    setAbrirAdd(false)
  }

  const handleEditPessoa = (pessoa: Pessoa) => {
    setPessoas((prev) =>
      prev.map((p) => (p.id === pessoa.id ? pessoa : p))
    )
    setEditPessoa(null)
  }

  // --- PDF Carteirinha ---
  const handleDownloadPDF = (pessoa: Pessoa) => {
    const doc = new jsPDF("portrait", "mm", "a4")

    // Moldura estilo documento
    doc.setDrawColor(0, 100, 0)
    doc.setLineWidth(0.8)
    doc.rect(15, 15, 180, 110)

    // Cabeçalho
    doc.setTextColor(0, 100, 0)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("Cidade de Tacaimbó", 25, 28)
    doc.setFontSize(12)
    doc.text("CARTEIRA DE IDENTIDADE", 25, 36)

    // Foto
    doc.setDrawColor(150)
    doc.rect(22, 45, 28, 36)
    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text("FOTO 3x4", 27, 66)

    // Dados da pessoa
    doc.setTextColor(0)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)

    const startX = 55
    let y = 50

    const line = (label: string, value: string) => {
      doc.text(`${label}:`, startX, y)
      doc.setFont("helvetica", "normal")
      doc.text(value || "-", startX + 28, y)
      doc.setFont("helvetica", "bold")
      y += 7
    }

    line("Nome", pessoa.nome)
    line("CPF", pessoa.cpf)
    line("RG", pessoa.rg)
    line("Nascimento", pessoa.dataNascimento)
    line("Endereço", pessoa.endereco)
    line("Telefone", pessoa.telefone)

    // QRCode
    const canvas = qrRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      doc.addImage(dataUrl, "PNG", 150, 90, 35, 35)
    }

    doc.save(`carteirinha-${pessoa.nome}.pdf`)
  }

  // --- Busca ---
  const filteredPessoas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      {/* Sidebar fixa no desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 border-b flex items-center px-4 bg-white shadow-sm">
          <MobileSidebar />
          <h1 className="ml-4 font-semibold">Painel de Controle</h1>
        </header>

        {/* Conteúdo */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="p-6 space-y-4">
            {/* Ações topo */}
            <div className="flex items-center justify-between gap-3">
              <Input
                placeholder="Pesquisar pessoas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              <Dialog open={abrirAdd} onOpenChange={setAbrirAdd}>
                <DialogTrigger asChild>
                  <Button onClick={() => setAbrirAdd(true)}>
                    Adicionar Pessoa
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Pessoa</DialogTitle>
                    <DialogDescription className="sr-only">
                      Preencha os dados para cadastrar uma nova pessoa.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const novaPessoa: Pessoa = {
                        id: "",
                        nome: String(fd.get("nome")),
                        cpf: String(fd.get("cpf")),
                        rg: String(fd.get("rg")),
                        endereco: String(fd.get("endereco")),
                        telefone: String(fd.get("telefone")),
                        dataNascimento: String(fd.get("dataNascimento")),
                      }
                      handleAddPessoa(novaPessoa)
                    }}
                    className="space-y-2"
                  >
                    <Input name="nome" placeholder="Nome" required />
                    <Input name="cpf" placeholder="CPF" required />
                    <Input name="rg" placeholder="RG" required />
                    <Input name="endereco" placeholder="Endereço" required />
                    <Input name="telefone" placeholder="Telefone" required />
                    <Input name="dataNascimento" type="date" required />

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

            {/* Tabela */}
            <DataTable
              columns={getColumns({
                onEdit: (pessoa) => setEditPessoa(pessoa),
                onDelete: (id) =>
                  setPessoas((prev) => prev.filter((p) => p.id !== id)),
                onCarteirinha: (pessoa) => setCarteirinhaPessoa(pessoa),
              })}
              data={filteredPessoas}
            />

            {/* Modal Editar */}
            {editPessoa && (
              <Dialog
                open={!!editPessoa}
                onOpenChange={() => setEditPessoa(null)}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Pessoa</DialogTitle>
                    <DialogDescription className="sr-only">
                      Altere os campos e salve para atualizar os dados da
                      pessoa.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const pessoaEditada: Pessoa = {
                        ...editPessoa,
                        nome: String(fd.get("nome")),
                        cpf: String(fd.get("cpf")),
                        rg: String(fd.get("rg")),
                        endereco: String(fd.get("endereco")),
                        telefone: String(fd.get("telefone")),
                        dataNascimento: String(fd.get("dataNascimento")),
                      }
                      handleEditPessoa(pessoaEditada)
                    }}
                    className="space-y-2"
                  >
                    <Input
                      name="nome"
                      defaultValue={editPessoa.nome}
                      required
                    />
                    <Input
                      name="cpf"
                      defaultValue={editPessoa.cpf}
                      required
                    />
                    <Input name="rg" defaultValue={editPessoa.rg} required />
                    <Input
                      name="endereco"
                      defaultValue={editPessoa.endereco}
                      required
                    />
                    <Input
                      name="telefone"
                      defaultValue={editPessoa.telefone}
                      required
                    />
                    <Input
                      name="dataNascimento"
                      type="date"
                      defaultValue={editPessoa.dataNascimento}
                      required
                    />

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditPessoa(null)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Modal Carteirinha */}
            {carteirinhaPessoa && (
              <Dialog
                open={!!carteirinhaPessoa}
                onOpenChange={() => setCarteirinhaPessoa(null)}
              >
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Carteirinha</DialogTitle>
                    <DialogDescription className="sr-only">
                      Visualização da carteirinha com QR Code e opção de
                      download em PDF.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="bg-[#f5f9f4] border-2 border-green-900 shadow-lg rounded-md p-4 relative">
                    {/* Cabeçalho carteirinha */}
                    <div className="text-center text-xs font-semibold text-green-900">
                      <p>REPÚBLICA FEDERATIVA DA CIDADE DE TACAIMBÓ</p>
                      <p>CARTEIRA DA SEC. ASSISTÊNCIA SOCIAL</p>
                    </div>

                    <div className="flex mt-3 gap-4">
                      {/* Foto */}
                      <div className="w-20 h-24 border border-gray-400 bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                        FOTO 3x4
                      </div>

                      {/* Dados */}
                      <div className="flex-1 text-sm space-y-1">
                        <p><strong>Nome:</strong> {carteirinhaPessoa.nome}</p>
                        <p><strong>CPF:</strong> {carteirinhaPessoa.cpf}</p>
                        <p><strong>RG:</strong> {carteirinhaPessoa.rg}</p>
                        <p><strong>Nascimento:</strong> {carteirinhaPessoa.dataNascimento}</p>
                        <p><strong>Endereço:</strong> {carteirinhaPessoa.endereco}</p>
                        <p><strong>Telefone:</strong> {carteirinhaPessoa.telefone}</p>
                      </div>
                    </div>

                    {/* QRCode */}
                    <div className="absolute bottom-3 right-3">
                      <QRCodeCanvas
                        ref={qrRef}
                        value={`${carteirinhaPessoa.nome} - ${carteirinhaPessoa.cpf}`}
                        size={132}
                        includeMargin
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button
                      onClick={() => handleDownloadPDF(carteirinhaPessoa)}
                    >
                      Baixar PDF
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
