import { describe, expect, it } from "vitest";
import { classify } from "./certificate";

// Fase 8 (auditoria 2026-08-27) — fixa as fronteiras exatas de classificação
// do certificado público (/verify/[code]). Um erro de "off-by-one" aqui
// mudaria silenciosamente quem recebe "Competente" vs "Em desenvolvimento"
// num documento já considerado uma prova pública de nível.

describe("classify", () => {
  it("abaixo de 50 é 'Ainda não pronto'", () => {
    expect(classify(0)).toBe("Ainda não pronto");
    expect(classify(49)).toBe("Ainda não pronto");
  });

  it("50-64 é 'Em desenvolvimento'", () => {
    expect(classify(50)).toBe("Em desenvolvimento");
    expect(classify(64)).toBe("Em desenvolvimento");
  });

  it("65-79 é 'Competente' (o limiar mínimo para emitir certificado)", () => {
    expect(classify(65)).toBe("Competente");
    expect(classify(79)).toBe("Competente");
  });

  it("80-89 é 'Forte'", () => {
    expect(classify(80)).toBe("Forte");
    expect(classify(89)).toBe("Forte");
  });

  it("90 ou mais é 'Excecional'", () => {
    expect(classify(90)).toBe("Excecional");
    expect(classify(100)).toBe("Excecional");
  });
});
