import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plataforma de Inglês",
  description: "O seu professor particular de inglês, disponível 24/7.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Inglês",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A4A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-PT"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
      // O script de tema abaixo pode adicionar a classe "dark" ao <html> antes
      // da hidratação do React (de propósito, para evitar o "flash" do tema
      // claro) — mantido como salvaguarda mesmo depois da correção real
      // (ver nota abaixo), para o caso de o utilizador ter "dark" guardado.
      suppressHydrationWarning
    >
      <body className="font-sans">
        {/* Fase 29/30 (5ª auditoria, 2026-08-28): a causa real dos erros de
            hidratação #418/#423 em produção (confirmados em todas as páginas,
            mesmo com "theme" vazio no localStorage — por isso não era o script
            em si a mutar o DOM) era escrever um <head> manual no layout raiz
            enquanto também se usa a API `metadata`/`viewport` — a Next.js gere
            o <head> por streaming próprio, e um <head> explícito com filhos
            entra em conflito com essa gestão (problema documentado da App
            Router). Corrigido removendo o <head> manual e usando
            next/script com strategy="beforeInteractive" — a forma
            oficialmente suportada de injetar um script antes da hidratação,
            sem escrever <head> à mão. */}
        <Script id="theme-init" strategy="beforeInteractive">
          {"try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}"}
        </Script>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
