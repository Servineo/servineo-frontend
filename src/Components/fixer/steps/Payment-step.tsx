"use client"

import type React from "react"

import { Card } from "@/Components/Card"
import { Banknote, CreditCard, QrCode, AlertCircle } from "lucide-react"

export type PaymentMethod = "cash" | "qr" | "card"

interface PaymentStepProps {
  payments: PaymentMethod[]
  accountInfo: string
  onTogglePayment: (method: PaymentMethod) => void
  onAccountInfoChange: (info: string) => void
  paymentsError?: string
  accountError?: string
}

const PAYMENT_CONFIG: Record<PaymentMethod, { label: string; icon: React.ReactNode }> = {
  cash: { label: "Efectivo", icon: <Banknote className="h-4 w-4" /> },
  qr: { label: "QR", icon: <QrCode className="h-4 w-4" /> },
  card: { label: "Tarjeta", icon: <CreditCard className="h-4 w-4" /> },
}

export function PaymentStep({
  payments,
  accountInfo,
  onTogglePayment,
  onAccountInfoChange,
  paymentsError,
  accountError,
}: PaymentStepProps) {
  const needsAccount = payments.includes("qr") || payments.includes("card")

  return (
    <Card title="Métodos de pago aceptados">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {(["cash", "qr", "card"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onTogglePayment(m)}
              className={
                "rounded-full px-4 py-2 text-sm transition-all flex items-center gap-2 " +
                (payments.includes(m)
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300")
              }
            >
              {PAYMENT_CONFIG[m].icon}
              {PAYMENT_CONFIG[m].label}
            </button>
          ))}
        </div>

        {needsAccount && (
          <div className="space-y-1 animate-fade-in">
            <label className="text-sm text-gray-800">Cuenta para recibir pagos (CBU/IBAN/alias)</label>
            <input
              value={accountInfo}
              onChange={(e) => onAccountInfoChange(e.target.value)}
              placeholder="Ingrese su cuenta"
              className="w-full rounded-full bg-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        )}

        {paymentsError && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{paymentsError}</span>
          </div>
        )}
        {accountError && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{accountError}</span>
          </div>
        )}
      </div>
    </Card>
  )
}
