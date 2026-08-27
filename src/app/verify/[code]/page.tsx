import { prisma } from "@/lib/prisma";

// Página pública de verificação de certificado — item #17 da lista de
// melhorias. /verify/ já estava previsto como caminho público em
// src/middleware.ts desde a Fase 0. Sem QR real (ver src/lib/certificate.ts) —
// é o próprio link/código que serve de prova, partilhável por quem o recebeu.
export default async function VerifyCertificatePage({ params }: { params: { code: string } }) {
  const certificate = await prisma.certificate.findUnique({
    where: { verificationCode: params.code },
    include: { profile: { select: { name: true } } },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-lg lg:max-w-2xl flex-col items-center justify-center bg-ink px-6 py-16 text-center text-linen">
      {certificate ? (
        <>
          <div className="mb-6 flex h-24 w-24 -rotate-6 items-center justify-center rounded-full border-2 border-brass font-mono text-sm font-semibold text-brass">
            {certificate.cefr.replace("_", "-")}
          </div>
          <h1 className="mb-2 font-display text-2xl">Certificado Verificado</h1>
          <p className="mb-1 text-linen/80">{certificate.profile.name}</p>
          <p className="mb-6 text-sm text-linen/60">
            Nível {certificate.cefr.replace("_", "-")} · {certificate.classification} · {certificate.overallScore}/100
          </p>
          <p className="font-mono text-xs text-linen/40">
            Emitido em {certificate.issuedAt.toLocaleDateString("pt-PT")} · código {certificate.verificationCode}
          </p>
        </>
      ) : (
        <>
          <h1 className="mb-2 font-display text-2xl">Código não encontrado</h1>
          <p className="text-sm text-linen/60">Este código de verificação não corresponde a nenhum certificado emitido.</p>
        </>
      )}
    </main>
  );
}
