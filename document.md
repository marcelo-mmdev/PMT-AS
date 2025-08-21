## Getting Started
admin@teste.com
123456

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



## Deploy on Vercel

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

validar/page.tsx

"use client"

import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, CheckCircle2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
//import { Sidebar } from "@/components/Sidebar"

export default function ValidarPage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    })

    scanner.render(
      (decodedText) => {
        setScannedResult(decodedText)
        setOpen(true)
        scanner.clear()
      },
      (error) => {
        console.warn("Erro ao ler QR Code:", error)
      }
    )

    return () => {
      scanner.clear().catch(() => {})
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar reaproveitada */}
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <QrCode className="w-16 h-16 mx-auto text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Leitor de QR Code
          </h1>
          <p className="text-gray-500 text-sm">
            Aponte a câmera para o QR Code da carteirinha
          </p>
        </div>

        {/* Área do scanner */}
        <div
          id="reader"
          className="w-full max-w-md rounded-xl shadow-lg overflow-hidden border border-gray-200"
        />
      </main>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              QR Code Lido com Sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="mb-6 font-medium text-gray-700">{scannedResult}</p>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              onClick={() => setOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


validar/page.tsx    ---  2

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, CheckCircle2 } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function ValidarPage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [scanning, setScanning] = useState(false)

  // 🔊 Beep + vibração
  const playFeedback = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime)
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.2)

      if (navigator.vibrate) {
        navigator.vibrate(200)
      }
    } catch (err) {
      console.warn("Erro ao tocar feedback:", err)
    }
  }

  const startScanner = async () => {
    if (scanning) return // 🚫 já está rodando
    setScanning(true)

    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader")
    }

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          playFeedback()
          setScannedResult(decodedText)
          setOpen(true)
          stopScanner()
        },
        (errorMessage) => {
          console.warn("Erro ao ler QR Code:", errorMessage)
        }
      )
    } catch (err) {
      console.error("Erro ao iniciar câmera:", err)
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && scanning) {
      try {
        await scannerRef.current.stop()
      } catch {
        // ignora se já estiver parado
      }
      setScanning(false)
    }
  }

  useEffect(() => {
    startScanner()
    return () => {
      stopScanner()
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setScannedResult(null)
      startScanner()
    }
  }, [open])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <QrCode className="w-16 h-16 mx-auto text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Leitor de QR Code
          </h1>
          <p className="text-gray-500 text-sm">
            Aponte a câmera para o QR Code da carteirinha
          </p>
        </div>

        <div
          id="reader"
          className="w-full max-w-md rounded-xl shadow-lg overflow-hidden border border-gray-200"
        />
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              QR Code Lido com Sucesso
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="mb-6 font-medium text-gray-700">{scannedResult}</p>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white px-6"
              onClick={() => setOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
