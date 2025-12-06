//src/app/[locale]/payment/detalleFactura/[invoiceId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import InvoiceDetail, { InvoiceDetailData } from '../../../../../Components/payment/InvoiceDetail';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const InvoiceDetailPage: React.FC = () => {
  const params = useParams() as { locale: string; invoiceId: string };
  const invoiceId = params?.invoiceId;

  const [invoiceData, setInvoiceData] = useState<InvoiceDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;

    const requesterId = (() => {
      try {
        const userJson = localStorage.getItem('servineo_user');
        return userJson ? JSON.parse(userJson).id : null;
      } catch {
        return null;
      }
    })();

    if (!requesterId) {
      setLoading(false);
      return;
    }

    const fetchInvoice = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/invoices/${invoiceId}?requesterId=${requesterId}`
        );

        if (!res.ok) {
          setInvoiceData(null);
          setLoading(false);
          return;
        }

        const { data } = await res.json();
        setInvoiceData(data);
      } catch {
        setInvoiceData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Cargando factura...</p>
      </main>
    );
  }

  if (!invoiceData) {
    return (
      <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Factura no encontrada</h1>
        <p className="text-gray-600 mt-2">ID: {invoiceId}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <InvoiceDetail invoice={invoiceData} />
    </main>
  );
};

export default InvoiceDetailPage;
