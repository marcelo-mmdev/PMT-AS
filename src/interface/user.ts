// src/app/dashboard/usuarios/types.ts
export interface Usuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: "admin" | "entregador"
}
