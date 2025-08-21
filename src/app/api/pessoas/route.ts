import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { getPessoasStore, setPessoasStore } from "@/types/pessoa"
//import { getPessoasStore, setPessoasStore } from "@/store/pessoas"

// GET /api/pessoas → lista todas
export async function GET() {
  return NextResponse.json(getPessoasStore())
}

// POST /api/pessoas → cria nova pessoa
export async function POST(req: Request) {
  const body = await req.json()
  const novaPessoa = {
    id: randomUUID(),
    nome: body.nome,
    cpf: body.cpf,
    rg: body.rg,
    endereco: body.endereco,
    telefone: body.telefone,
    dataNascimento: body.dataNascimento,
  }
  const pessoas = getPessoasStore()
  pessoas.push(novaPessoa)
  setPessoasStore(pessoas)
  return NextResponse.json(novaPessoa, { status: 201 })
}
