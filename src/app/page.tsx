"use client";
import HeroSection from "@/Components/Home/Hero-section";
import ServicesSection from "@/Components/Home/Services-section";
import HowItWorksSection from "@/Components/Home/HowItWorks-section";
import CTASection from "@/Components/Home/CTA-section";
import MapSection from "@/Components/Home/Map-section";
import InspirationSection from "@/Components/Home/Inspiration-section";
import RecentOffersSection from "@/Components/Home/RecentOffer-secction";
import FooterSection from "@/Components/Home/Footer-section";
// 1. IMPORTAMOS TU NUEVO COMPONENTE AQUÍ:
import { WhatsappBanner } from "@/Components/WhatsappBanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <MapSection />
          <InspirationSection />
          <RecentOffersSection />
        </div>
      </section>

      <ServicesSection />
      <HowItWorksSection />
      
      {/* 2. AQUÍ AGREGAMOS EL BANNER DE WHATSAPP: */}
      <WhatsappBanner />

      <CTASection />
      <FooterSection />
    </div>
  );
}