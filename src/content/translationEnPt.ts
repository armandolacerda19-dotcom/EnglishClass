// Tradução EN→PT — tipo de exercício novo (Exercise Engine, prioridade 🔴 do
// relatório de 2026-08-28). A direção PT→EN já existia (TranslationStep);
// esta é a inversa, testando compreensão em vez de produção. `correctPt` traz
// mais do que uma forma aceitável — a correção usa semanticGrade (IA
// tolerante), nunca igualdade exata, porque há sempre mais do que uma forma
// válida de traduzir a mesma frase.

export interface TranslationEnPtItem {
  id: string;
  level: string;
  sentence: string; // em inglês
  correctPt: string[];
  note?: string;
}

export const TRANSLATION_EN_PT_ITEMS: TranslationEnPtItem[] = [
  { id: "tep-01", level: "A1", sentence: "I am thirty years old.", correctPt: ["Eu tenho trinta anos.", "Tenho trinta anos."] },
  { id: "tep-02", level: "A1", sentence: "She lives in a small flat.", correctPt: ["Ela vive num apartamento pequeno.", "Ela mora num apartamento pequeno."] },
  { id: "tep-03", level: "A1", sentence: "Can you help me, please?", correctPt: ["Pode ajudar-me, por favor?", "Podes ajudar-me, por favor?"] },
  { id: "tep-04", level: "A2", sentence: "I've been waiting for you.", correctPt: ["Tenho estado à tua espera.", "Estive à tua espera.", "Tenho estado à sua espera."] },
  { id: "tep-05", level: "A2", sentence: "We usually have dinner at eight.", correctPt: ["Nós costumamos jantar às oito.", "Costumamos jantar às oito."] },
  { id: "tep-06", level: "A2", sentence: "He has never been to London.", correctPt: ["Ele nunca esteve em Londres.", "Ele nunca foi a Londres."] },
  { id: "tep-07", level: "B1", sentence: "If I had more time, I would travel more.", correctPt: ["Se eu tivesse mais tempo, viajava mais.", "Se tivesse mais tempo, eu viajaria mais."] },
  { id: "tep-08", level: "B1", sentence: "She asked me where I lived.", correctPt: ["Ela perguntou-me onde é que eu vivia.", "Ela perguntou-me onde eu morava."] },
  { id: "tep-09", level: "B1", sentence: "I'm looking forward to seeing you.", correctPt: ["Estou ansioso por te ver.", "Mal posso esperar para te ver.", "Estou ansiosa por te ver."] },
  { id: "tep-10", level: "B1", sentence: "By next year, I will have finished my degree.", correctPt: ["No próximo ano, já terei terminado o curso.", "Até ao próximo ano, já terei acabado a licenciatura."] },
  { id: "tep-11", level: "B2", sentence: "Despite the rain, we went out.", correctPt: ["Apesar da chuva, saímos.", "Apesar de chover, nós saímos."] },
  { id: "tep-12", level: "B2", sentence: "The report was written by the intern.", correctPt: ["O relatório foi escrito pelo estagiário.", "O relatório foi redigido pelo estagiário."] },
  { id: "tep-13", level: "B2", sentence: "She not only passed the exam but also got the highest score.", correctPt: ["Ela não só passou no exame como também teve a nota mais alta.", "Ela não só passou no exame, mas também obteve a melhor nota."] },
  { id: "tep-14", level: "B2", sentence: "I wish I had studied harder.", correctPt: ["Quem me dera ter estudado mais.", "Gostava de ter estudado mais."] },
  { id: "tep-15", level: "C1", sentence: "It is essential that she be informed immediately.", correctPt: ["É essencial que ela seja informada imediatamente.", "É fundamental que ela seja informada de imediato."] },
  { id: "tep-16", level: "C1", sentence: "It could be argued that remote work has changed office culture.", correctPt: ["Poder-se-ia argumentar que o trabalho remoto mudou a cultura de escritório.", "Pode dizer-se que o trabalho remoto mudou a cultura do escritório."] },
  { id: "tep-17", level: "C1", sentence: "He is said to have left the country, though this has never been confirmed.", correctPt: ["Diz-se que ele deixou o país, embora isso nunca tenha sido confirmado.", "Consta que ele saiu do país, mas isso nunca foi confirmado."] },
  { id: "tep-18", level: "C1", sentence: "The committee will review the proposal next week.", correctPt: ["A comissão vai analisar a proposta na próxima semana.", "O comité irá rever a proposta na próxima semana."] },
];

export function getTranslationEnPtItem(id: string): TranslationEnPtItem | undefined {
  return TRANSLATION_EN_PT_ITEMS.find((t) => t.id === id);
}
