import React from 'react';
import Link from 'next/link';

export const WhatsappBanner = () => {
  // Configuración del número y mensaje
  const phoneNumber = "59100000000"; 
  const message = "Hola, necesito ayuda con un servicio.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white border border-gray-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        ¿Necesitas ayuda rápida?
      </h2>
      <p className="text-gray-600 mb-6">
        Habla con nuestra IA en WhatsApp ahora mismo y resuelve tus dudas al instante.
      </p>
      
      <Link 
        href={whatsappUrl}
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
      >
        {/* Icono de WhatsApp SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
        </svg>
        Chatear ahora
      </Link>
    </div>
  );
};