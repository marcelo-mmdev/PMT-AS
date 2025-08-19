"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

type Stats = {
  total: number
  faixaEtaria: {
    "0-17": number
    "18-30": number
    "31-50": number
    "51+": number
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/pessoas/stats")
      .then(res => res.json())
      .then(setStats)
  }, [])

  if (!stats) {
    return <p className="p-6">Carregando estatísticas...</p>
  }

  const chartData = Object.entries(stats.faixaEtaria).map(([faixa, qtd]) => ({
    faixa,
    qtd,
  }))

  const pieData = Object.entries(stats.faixaEtaria).map(([faixa, qtd]) => ({
    name: faixa,
    value: qtd,
  }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <main className="p-6 space-y-6">
      {/* botão para pessoas */}
      <div className="flex justify-end">
        <Link href="/dashboard/pessoas">
          <Button className="bg-blue-600 text-white">Gerenciar Pessoas</Button>
        </Link>
      </div>
      {/* métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Total de Pessoas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Faixa 18-30</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.faixaEtaria["18-30"]}</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Faixa 51+</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.faixaEtaria["51+"]}</p>
          </CardContent>
        </Card>
      </div>

      {/* gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Faixa Etária (Barras)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qtd" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Faixa Etária (Pizza)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
