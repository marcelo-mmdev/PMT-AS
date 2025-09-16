import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/types/user"

// 📌 GET: Listar todos usuários
export async function GET() {
  await dbConnect()
  const users = await User.find()
  return NextResponse.json(users)
}

// 📌 POST: Criar novo usuário
export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const { nome, email, senha, tipo } = body

  if (!nome || !email || !senha) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(senha, 10)

  try {
    const user = await User.create({
      nome,
      email,
      senha: hashedPassword,
      tipo,
    })
    return NextResponse.json(user)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
