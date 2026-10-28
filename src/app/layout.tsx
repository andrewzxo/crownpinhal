import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "CROWN Academia | Pinhal-SP",
  description:
    "Academia CROWN em Pinhal-SP. Musculação, CROSS, HYROX, CROWN RUN, aulas coletivas, lutas, beach tennis e futevôlei.",
  keywords: ["academia", "CROWN", "Pinhal", "musculação", "cross", "hyrox", "corrida", "fitness"],
  icons: {
    icon: "/logo.png",
  },
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
        <link rel="preload" as="image" href="/img/hero.jpg" fetchPriority="high" />
        <link rel="preload" as="image" href="/logo.png" />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
