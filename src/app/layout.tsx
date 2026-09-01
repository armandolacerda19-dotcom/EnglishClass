import type { Metadata, Viewport } from "next";
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
      // O script no <head> abaixo adiciona a classe "dark" ao <html> ANTES de o
      // React hidratar (de propósito, para evitar o "flash" do tema claro) —
      // isso faz o className do <html> no DOM real divergir do que o servidor
      // enviou, disparando o aviso de hidratação do React (erros #418/#423 em
      // produção, confirmados na 5ª auditoria ao verificar o site publicado).
      // `suppressHydrationWarning` é a correção oficialmente recomendada pela
      // Next.js exatamente para este padrão (script de tema fora do React).
      suppressHydrationWarning
    >
      <head>
        {/* Aplica o tema guardado antes do primeiro paint, para não haver um
            "flash" do tema claro por defeito seguido de escuro (ou vice-versa).
            Default é sempre claro a não ser que o utilizador tenha escolhido
            escuro explicitamente via ThemeToggle — ver docs/decisions.md 2026-08-26. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}",
          }}
        />
      </head>
      <body className="font-sans">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
