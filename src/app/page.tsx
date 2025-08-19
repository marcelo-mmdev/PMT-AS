'use client'
import Login from "@/login/page";
import axios from "axios";
import { useState } from "react";


export default function Home() {

  const [data, setData] = useState('')
  const [horainicio, setHoraInicio] = useState('')
  const [horafinal, setHoraFinal] = useState('')

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault()
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
      <Login />
    </>
  );
}
