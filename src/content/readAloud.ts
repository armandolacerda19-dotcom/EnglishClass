// Leitura em Voz Alta — tipo de exercício novo (Exercise Engine, prioridade
// 🟠 do relatório de 2026-08-28). Frases/mini-textos curtos, dentro do que o
// reconhecimento de voz de uma só passagem consegue transcrever com
// confiança razoável (Web Speech API, sem confirmação humana no meio).

export interface ReadAloudItem {
  id: string;
  level: string;
  text: string;
  translationPt: string;
}

export const READ_ALOUD_ITEMS: ReadAloudItem[] = [
  { id: "ra-01", level: "A1", text: "My name is Ana and I live in Lisbon.", translationPt: "O meu nome é Ana e eu vivo em Lisboa." },
  { id: "ra-02", level: "A1", text: "I usually wake up at seven and have breakfast.", translationPt: "Eu costumo acordar às sete e tomo o pequeno-almoço." },
  { id: "ra-03", level: "A2", text: "Last weekend, we went to the beach and had a great time.", translationPt: "No fim de semana passado, fomos à praia e divertimo-nos imenso." },
  { id: "ra-04", level: "A2", text: "She works at a bank and commutes by train every day.", translationPt: "Ela trabalha num banco e desloca-se de comboio todos os dias." },
  { id: "ra-05", level: "B1", text: "If the weather is nice tomorrow, we will go for a walk in the park.", translationPt: "Se o tempo estiver bom amanhã, vamos dar um passeio no parque." },
  { id: "ra-06", level: "B1", text: "I have been learning English for almost a year, and I can already understand most conversations.", translationPt: "Estou a aprender inglês há quase um ano, e já consigo perceber a maioria das conversas." },
  { id: "ra-07", level: "B1", text: "He asked me if I could help him move some boxes on Saturday.", translationPt: "Ele perguntou-me se eu podia ajudá-lo a mudar umas caixas no sábado." },
  { id: "ra-08", level: "B2", text: "Despite the heavy traffic, we managed to arrive at the airport just in time.", translationPt: "Apesar do trânsito intenso, conseguimos chegar ao aeroporto mesmo a tempo." },
  { id: "ra-09", level: "B2", text: "The company announced that it would be hiring fifty new employees over the next six months.", translationPt: "A empresa anunciou que iria contratar cinquenta novos funcionários nos próximos seis meses." },
  { id: "ra-10", level: "C1", text: "It could be argued that remote work has permanently changed the way companies think about office space.", translationPt: "Pode argumentar-se que o trabalho remoto mudou permanentemente a forma como as empresas pensam sobre o espaço de escritório." },
  { id: "ra-11", level: "C1", text: "Although the results were disappointing at first, the team eventually turned things around through sheer determination.", translationPt: "Embora os resultados tenham sido decepcionantes no início, a equipa acabou por dar a volta através de pura determinação." },
  { id: "ra-12", level: "C1", text: "The committee is expected to announce its final decision sometime next week, according to sources close to the matter.", translationPt: "Espera-se que a comissão anuncie a sua decisão final algures na próxima semana, segundo fontes próximas do assunto." },
];

export function getReadAloudItem(id: string): ReadAloudItem | undefined {
  return READ_ALOUD_ITEMS.find((r) => r.id === id);
}
