"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

type LoginForm = {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)

    // 🚀 Mock temporário
    if (data.email === "admin@email.com" && data.password === "123456") {
      router.push("/dashboard")
    } else {
      alert("Credenciais inválidas")
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bem-vindo</h1>
          <p className="text-sm text-gray-500">Entre para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo Email */}
          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Digite seu email" })}
              className="h-11"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Campo Senha com botão de exibir/ocultar */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              {...register("password", { required: "Digite sua senha" })}
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 rounded-xl font-medium" 
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Seu Projeto
        </p>
      </div>
    </div>
  )
}
