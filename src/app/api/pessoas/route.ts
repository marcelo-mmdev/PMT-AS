import { NextResponse } from "next/server"
import { Pessoa } from "@/types/pessoa"
import { randomUUID } from "crypto"

// armazenamento em memória (⚠️ será perdido a cada restart)
let pessoas: Pessoa[] = []

// GET /api/pessoas → lista todas
export async function GET() {
  return NextResponse.json(pessoas)
}

// POST /api/pessoas → cria nova pessoa
export async function POST(req: Request) {
  const body = await req.json()
  const novaPessoa: Pessoa = {
    id: randomUUID(),
    nome: body.nome,
    cpf: body.cpf,
    rg: body.rg,
    endereco: body.endereco,
    telefone: body.telefone,
    dataNascimento: body.dataNascimento,
  }
  pessoas.push(novaPessoa)
  return NextResponse.json(novaPessoa, { status: 201 })
}

// export para que [id]/route.ts possa acessar
export function getPessoasStore() {
  return pessoas
}
export function setPessoasStore(data: Pessoa[]) {
  pessoas = data
}
