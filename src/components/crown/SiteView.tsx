"use client";

import Navbar from "./Navbar";
import SectionNav from "./SectionNav";
import Hero from "./Hero";
import About from "./About";
import Modalities from "./Modalities";
import Coletivas from "./Coletivas";
import ScheduleSection from "./ScheduleSection";
import Empresas from "./Empresas";
import Plans from "./Plans";
import Gallery from "./Gallery";
import Comunidade from "./Comunidade";
import SocialSection from "./SocialSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";
import WhatsAppFloat from "./WhatsAppFloat";

export default function SiteView() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <SectionNav />
      <main className="flex-1">
        <Hero />
        <About />
        <Modalities />
        <Coletivas />
        <ScheduleSection />
        <Empresas />
        <Plans />
        <Gallery />
        <Comunidade />
        <SocialSection />
        <CtaSection />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
