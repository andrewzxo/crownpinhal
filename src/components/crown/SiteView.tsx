"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Modalities from "./Modalities";
import ScheduleSection from "./ScheduleSection";
import Plans from "./Plans";
import Gallery from "./Gallery";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

export default function SiteView() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Modalities />
        <ScheduleSection />
        <Plans />
        <Gallery />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
