import { ReactNode } from "react"

export type Pessoa = {
  nascimento: ReactNode
  id: string
  nome: string
  cpf: string
  rg: string
  telefone: string
  endereco: string
  dataNascimento: string
}
