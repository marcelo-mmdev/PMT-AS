/* eslint-disable @typescript-eslint/no-explicit-any */
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
import QrReader from "react-qr-scanner" // 📌 leitor de QRCode

export default function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [search, setSearch] = useState("")
  const [editPessoa, setEditPessoa] = useState<Pessoa | null>(null)
  const [carteirinhaPessoa, setCarteirinhaPessoa] = useState<Pessoa | null>(null)
  const [abrirAdd, setAbrirAdd] = useState(false)
  const [scannerAberto, setScannerAberto] = useState(false) // 📌 controle do leitor
  const qrRef = useRef<HTMLCanvasElement | null>(null)
  const [deletePessoa, setDeletePessoa] = useState<Pessoa | null>(null) // 📌 estado para exclusão

  // --- CRUD Pessoas ---
  const handleAddPessoa = (novaPessoa: Pessoa) => {
    setPessoas((prev) => [
      ...prev,
      { ...novaPessoa, id: String(Date.now()), status: "pendente" }, // 📌 status inicial
    ])
    setAbrirAdd(false)
  }

  const handleEditPessoa = (pessoa: Pessoa) => {
    setPessoas((prev) =>
      prev.map((p) => (p.id === pessoa.id ? pessoa : p))
    )
    setEditPessoa(null)
  }

  const handleDeletePessoa = (id: string) => {
    setPessoas((prev) => prev.filter((p) => p.id !== id))
    setDeletePessoa(null)
  }

  // --- QRCode Scanner ---
  const handleScan = (data: string | null) => {
    if (!data) return
    const [nome, cpf] = data.split(" - ")

    setPessoas((prev) => {
      const pessoa = prev.find((p) => p.nome === nome && p.cpf === cpf)
      if (!pessoa) {
        alert("⚠️ Pessoa não cadastrada!")
        return prev
      }

      if (pessoa.status === "lido") {
        alert("⚠️ Esse QR Code já foi lido!")
        return prev
      }

      return prev.map((p) =>
        p.id === pessoa.id ? { ...p, status: "lido" } : p
      )
    })
  }

  const handleError = (err: any) => {
    console.error(err)
    alert("Erro ao ler QR Code")
  }

  // --- PDF Carteirinha ---
  const handleDownloadPDF = (pessoa: Pessoa) => {
    const doc = new jsPDF("portrait", "mm", "a4")
    const card = { x: 30, y: 30, w: 150, h: 90 }
    doc.setDrawColor(0, 100, 0)
    doc.setLineWidth(0.8)
    doc.rect(card.x, card.y, card.w, card.h)

    doc.setTextColor(0, 100, 0)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text(
      "REPÚBLICA FEDERATIVA DA CIDADE DE TACAIMBÓ",
      card.x + card.w / 2,
      card.y + 10,
      { align: "center" }
    )
    doc.text(
      "CARTEIRA DA SEC. ASSISTÊNCIA SOCIAL",
      card.x + card.w / 2,
      card.y + 17,
      { align: "center" }
    )

    const photo = { x: card.x + 8, y: card.y + 26, w: 28, h: 36 }
    doc.setDrawColor(150)
    doc.rect(photo.x, photo.y, photo.w, photo.h)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(120)
    doc.text("FOTO 3x4", photo.x + photo.w / 2, photo.y + photo.h / 2 + 2, {
      align: "center",
    })

    const startX = photo.x + photo.w + 8
    const firstY = photo.y + 6
    let y = firstY
    const lineH = 5
    doc.setFontSize(10)
    doc.setTextColor(0)

    const row = (label: string, value: string) => {
      const lbl = `${label}: `
      doc.setFont("helvetica", "bold")
      doc.text(lbl, startX, y)
      const lblW = doc.getTextWidth(lbl)
      doc.setFont("helvetica", "normal")
      doc.text(value || "-", startX + lblW, y)
      y += lineH
    }

    row("Nome", pessoa.nome)
    row("CPF", pessoa.cpf)
    row("RG", pessoa.rg)
    row("Nascimento", pessoa.dataNascimento)
    row("Endereço", pessoa.endereco)
    row("Telefone", pessoa.telefone)

    const canvas = qrRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const qrSize = 38
      const dataBlockW = 60
      const padding = 6
      const qrMaxX = card.x + card.w - 8 - qrSize
      const qrXProposto = startX + dataBlockW + padding
      const qrX = Math.min(qrXProposto, qrMaxX)
      const lastBaseline = y - lineH
      const dataMidY = (firstY + lastBaseline) / 2
      const qrY = dataMidY - qrSize / 2
      doc.addImage(dataUrl, "PNG", qrX, qrY, qrSize, qrSize)
    }

    doc.save(`carteirinha-${pessoa.nome}.pdf`)
  }

  const filteredPessoas = pessoas.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center px-4 bg-white shadow-sm">
          <MobileSidebar />
          <h1 className="ml-4 font-semibold">Painel de Controle</h1>
          <div className="ml-auto">
            <Button onClick={() => setScannerAberto(true)}>📷 Ler QR Code</Button>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="p-6 space-y-4">
            {/* Busca */}
            <div className="flex items-center justify-between gap-3">
              <Input
                placeholder="Pesquisar pessoas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              {/* Botão Adicionar Pessoa */}
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
                        status: "pendente",
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
                onDelete: (id) => {
                  const p = pessoas.find((x) => x.id === id)
                  if (p) setDeletePessoa(p)   // 👉 agora abre modal
                },
                onCarteirinha: (pessoa) => setCarteirinhaPessoa(pessoa),
              })}
              data={filteredPessoas}
            />

            {/* Modal Scanner */}
            {scannerAberto && (
              <Dialog open={scannerAberto} onOpenChange={setScannerAberto}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Leitor de QR Code</DialogTitle>
                  </DialogHeader>
                  <QrReader
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ width: "100%" }}
                  />
                  <div className="flex justify-end pt-3">
                    <Button onClick={() => setScannerAberto(false)}>
                      Fechar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Modal Excluir Pessoa */}
            {deletePessoa && (
              <Dialog
                open={!!deletePessoa}
                onOpenChange={(open) => {
                  if (!open) setDeletePessoa(null)
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Excluir Pessoa</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir{" "}
                      <strong>{deletePessoa.nome}</strong>? Essa ação não pode
                      ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDeletePessoa(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeletePessoa(deletePessoa.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Modal Editar Pessoa */}
            {editPessoa && (
              <Dialog open={!!editPessoa} onOpenChange={() => setEditPessoa(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Pessoa</DialogTitle>
                  </DialogHeader>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const fd = new FormData(e.currentTarget)
                      const pessoaAtualizada: Pessoa = {
                        ...editPessoa,
                        nome: String(fd.get("nome")),
                        cpf: String(fd.get("cpf")),
                        rg: String(fd.get("rg")),
                        endereco: String(fd.get("endereco")),
                        telefone: String(fd.get("telefone")),
                        dataNascimento: String(fd.get("dataNascimento")),
                      }
                      handleEditPessoa(pessoaAtualizada)
                    }}
                    className="space-y-2"
                  >
                    <Input name="nome" defaultValue={editPessoa.nome} required />
                    <Input name="cpf" defaultValue={editPessoa.cpf} required />
                    <Input name="rg" defaultValue={editPessoa.rg} required />
                    <Input name="endereco" defaultValue={editPessoa.endereco} required />
                    <Input name="telefone" defaultValue={editPessoa.telefone} required />
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
