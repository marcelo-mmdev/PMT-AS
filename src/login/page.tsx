"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};
const Login = () => {

  const { register, handleSubmit } = useForm<FormData>();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (result?.error) {
      setError("Credenciais inválidas");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full min-h-screen grid bg-orange-300/20">
        <div className="m-auto">
          <h1 className="w-full font-bold text-4xl mb-5 text-center uppercase">
            Ação Social 👋
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="border p-16 bg-white/30 rounded-lg shadow-md"
          >
            <h1 className="text-center font-semibold text-3xl mb-5">Cesta Básica</h1>
            
            <div className="flex flex-col gap-2">
              <label>Email</label>
              <input
               {...register("email")}
          type="email"
          placeholder="E-mail"
          required
                className="text-black border border-black/20 rounded-lg p-1 shadow-sm"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Password</label>
              <input
               {...register("password")}
          type="password"
          placeholder="Senha"
          required
                className="text-black border border-black/20 rounded-lg p-1 shadow-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
              className="w-full flex justify-center items-center cursor-pointer gap-2 bg-green-300/50 rounded-md p-1 hover:shadow-md mt-5 font-bold text-lg"
          >
            Entrar
          </button>
          
            
            <div className="mt-5">
              <span className="cursor-default">
                Sistema
              </span>
             
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

