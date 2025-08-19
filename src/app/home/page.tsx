'use client'
import axios from "axios";
import { useState } from "react";


export default function Home() {

  const [data, setData] = useState('')
  const [horainicio, setHoraInicio] = useState('')
  const [horafinal, setHoraFinal] = useState('')

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    alert(`Data: ${data}\nEntrada: ${horainicio}\nSaída: ${horafinal}`);
    //console.log(" Teste de console", data, horainicio, horafinal)
    const dados = {
      Data: data,
      HoraInicio: horainicio,
      HoraFinal: horafinal
    }

    axios.post('https://api.sheetbest.com/sheets/d62ffb52-b143-4612-a599-ec42bada050e',
      dados
    ).then((response) => {
      setData('')
      setHoraInicio('')
      setHoraFinal('')
      console.log("Dados enviado", response)
    })
  }

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrar Horário</h1>

        <form autoComplete="off" className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-gray-700">Data</label>
          <input type="date" placeholder="Enter Nome" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
 required 
            onChange={(e) => setData(e.target.value)} value={data}/>
          <br></br>

          <label className="block text-sm font-medium text-gray-700">Hora de Entrada</label>
          <input type="time" placeholder="Enter horainicio" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
 required 
            onChange={(e) => setHoraInicio(e.target.value)} value={horainicio}/>
          <br></br>

          <label className="block text-sm font-medium text-gray-700">Hora de Saída</label>
          <input type="time" placeholder="Enter horafinal" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
 required 
            onChange={(e) => setHoraFinal(e.target.value)} value={horafinal}/>
          <br></br>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Salvar Registro
          </button>
        </form>
      </div>
      </div>
    </>
  );
}