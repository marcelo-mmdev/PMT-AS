/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { getPessoasStore, setPessoasStore } from "../route"

// GET /api/pessoas/:id
export async function GET(request: Request, context: any) {
  const { id } = context.params
  const pessoas = getPessoasStore()
  const pessoa = pessoas.find(p => p.id === id)
  if (!pessoa) {
    return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
  }
  return NextResponse.json(pessoa)
}

// PUT /api/pessoas/:id
export async function PUT(request: Request, context: any) {
  const { id } = context.params
  const pessoas = getPessoasStore()
  const index = pessoas.findIndex(p => p.id === id)
  if (index === -1) {
    return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
  }

  const body = await request.json()
  pessoas[index] = { ...pessoas[index], ...body }
  setPessoasStore(pessoas)

  return NextResponse.json(pessoas[index])
}

// DELETE /api/pessoas/:id
export async function DELETE(request: Request, context: any) {
  const { id } = context.params
  let pessoas = getPessoasStore()
  const pessoa = pessoas.find(p => p.id === id)
  if (!pessoa) {
    return NextResponse.json({ error: "Pessoa não encontrada" }, { status: 404 })
  }

  pessoas = pessoas.filter(p => p.id !== id)
  setPessoasStore(pessoas)

  return NextResponse.json({ message: "Pessoa removida com sucesso" })
}
