/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPessoasStore, setPessoasStore } from "@/types/pessoa"
import { NextResponse } from "next/server"
//import { getPessoasStore, setPessoasStore } from "@/store/pessoas"

// GET /api/pessoas/:id
export async function GET(_: Request, { params }: any) {
  const pessoas = getPessoasStore()
  const pessoa = pessoas.find((p: any) => p.id === params.id)
  if (!pessoa) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
  return NextResponse.json(pessoa)
}

// PUT /api/pessoas/:id
export async function PUT(req: Request, { params }: any) {
  const pessoas = getPessoasStore()
  const index = pessoas.findIndex((p: any) => p.id === params.id)
  if (index === -1) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })

  const body = await req.json()
  pessoas[index] = { ...pessoas[index], ...body }
  setPessoasStore(pessoas)
  return NextResponse.json(pessoas[index])
}

// DELETE /api/pessoas/:id
export async function DELETE(_: Request, { params }: any) {
  let pessoas = getPessoasStore()
  const pessoa = pessoas.find((p: any) => p.id === params.id)
  if (!pessoa) return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })

  pessoas = pessoas.filter((p: any) => p.id !== params.id)
  setPessoasStore(pessoas)
  return NextResponse.json({ message: "Pessoa removida com sucesso" })
}
