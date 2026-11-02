import type { Metadata } from "next";
import Script from "next/script";
import { Anton, Inter, Oswald } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// URL canônica do site (troque NEXT_PUBLIC_SITE_URL ao apontar um domínio próprio)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://crownpinhal.vercel.app";

const SITE_NAME = "CROWN Academia | Pinhal-SP";
const SITE_DESC =
  "Academia completa em Espírito Santo do Pinhal-SP: musculação, CROSS, HYROX oficial, CROWN RUN, lutas, beach tennis, futevôlei e aulas coletivas. Comece com 7 dias grátis — Av. Washington Luís, 45.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESC,
  keywords: [
    "academia Pinhal",
    "academia Espírito Santo do Pinhal",
    "CROWN Academia",
    "musculação Pinhal-SP",
    "crossfit Pinhal",
    "CROSS Pinhal",
    "HYROX Pinhal",
    "beach tennis Pinhal",
    "futevôlei Pinhal",
    "pilates Pinhal",
    "jump",
    "muay thai",
    "boxe",
    "fitness & lifestyle",
    "7 dias grátis academia",
  ],
  applicationName: "CROWN Academia",
  authors: [{ name: "CROWN Academia" }],
  creator: "CROWN Academia",
  category: "fitness",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "CROWN Academia",
    title: "CROWN Academia — Fitness & Lifestyle em Pinhal-SP",
    description: SITE_DESC,
    images: [
      {
        url: "/img/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "CROWN Academia — Espírito Santo do Pinhal-SP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CROWN Academia — Fitness & Lifestyle em Pinhal-SP",
    description: SITE_DESC,
    images: ["/img/og-cover.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Search Console: cole o token de verificação em NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// ---------- Google Analytics (só carrega se NEXT_PUBLIC_GA_ID estiver definido) ----------
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

// ---------- Microsoft Clarity (só carrega se NEXT_PUBLIC_CLARITY_ID estiver definido) ----------
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

// ---------- JSON-LD: dados estruturados da academia (Google/Search) ----------
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  "@id": `${SITE_URL}/#academia`,
  name: "CROWN Academia",
  alternateName: "CROWN Pinhal",
  slogan: "Conectando pessoas através do fitness",
  description: SITE_DESC,
  url: SITE_URL,
  image: `${SITE_URL}/img/og-cover.jpg`,
  logo: `${SITE_URL}/icon`,
  telephone: "+55-19-99150-4548",
  priceRange: "R$",
  currenciesAccepted: "BRL",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Washington Luís, 45",
    addressLocality: "Espírito Santo do Pinhal",
    addressRegion: "SP",
    postalCode: "13990-000",
    addressCountry: "BR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "05:00",
      closes: "22:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "16:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  sameAs: [
    "https://www.instagram.com/crownpinhal",
    "https://beacons.ai/crownpinhal",
    "https://crown-gym-pinhal.ticketbro.com/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${oswald.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {/* React 19 move estes links para o <head>: a hero baixa junto com o HTML */}
        <link rel="preload" as="image" href="/img/hero.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo.webp" />

        {/* Dados estruturados p/ Google (rich results / painel de conhecimento) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}

        {/* Google Analytics 4 — ativado ao definir NEXT_PUBLIC_GA_ID (ex.: G-XXXXXXXXXX) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity — ativado ao definir NEXT_PUBLIC_CLARITY_ID */}
        {CLARITY_ID && (
          <Script id="clarity-init" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `}
          </Script>
        )}

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
