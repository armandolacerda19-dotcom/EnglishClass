// Sinónimos e Antónimos — tipo de exercício novo (Exercise Engine, 2026-08-28).

export interface SynonymAntonymItem {
  id: string;
  level: string;
  word: string;
  kind: "synonym" | "antonym";
  options: string[];
  correct: string;
  translationPt: string;
}

export const SYNONYM_ANTONYM_ITEMS: SynonymAntonymItem[] = [
  { id: "sa-01", level: "A1", word: "happy", kind: "antonym", options: ["sad", "joyful", "excited", "pleased"], correct: "sad", translationPt: "feliz ↔ triste" },
  { id: "sa-02", level: "A1", word: "big", kind: "synonym", options: ["large", "small", "short", "narrow"], correct: "large", translationPt: "grande = large" },
  { id: "sa-03", level: "A1", word: "fast", kind: "antonym", options: ["slow", "quick", "rapid", "speedy"], correct: "slow", translationPt: "rápido ↔ lento" },
  { id: "sa-04", level: "A1", word: "hot", kind: "antonym", options: ["cold", "warm", "boiling", "burning"], correct: "cold", translationPt: "quente ↔ frio" },
  { id: "sa-05", level: "A2", word: "begin", kind: "synonym", options: ["start", "finish", "continue", "stop"], correct: "start", translationPt: "começar = start" },
  { id: "sa-06", level: "A2", word: "easy", kind: "antonym", options: ["difficult", "simple", "quick", "clear"], correct: "difficult", translationPt: "fácil ↔ difícil" },
  { id: "sa-07", level: "A2", word: "buy", kind: "antonym", options: ["sell", "purchase", "own", "keep"], correct: "sell", translationPt: "comprar ↔ vender" },
  { id: "sa-08", level: "A2", word: "quiet", kind: "synonym", options: ["silent", "loud", "noisy", "busy"], correct: "silent", translationPt: "calmo/silencioso = silent" },
  { id: "sa-09", level: "A2", word: "arrive", kind: "antonym", options: ["leave", "come", "reach", "land"], correct: "leave", translationPt: "chegar ↔ partir" },
  { id: "sa-10", level: "B1", word: "expensive", kind: "antonym", options: ["cheap", "costly", "pricey", "valuable"], correct: "cheap", translationPt: "caro ↔ barato" },
  { id: "sa-11", level: "B1", word: "increase", kind: "antonym", options: ["decrease", "grow", "rise", "expand"], correct: "decrease", translationPt: "aumentar ↔ diminuir" },
  { id: "sa-12", level: "B1", word: "wealthy", kind: "synonym", options: ["rich", "poor", "average", "modest"], correct: "rich", translationPt: "abastado = rich" },
  { id: "sa-13", level: "B1", word: "accept", kind: "antonym", options: ["refuse", "agree", "approve", "welcome"], correct: "refuse", translationPt: "aceitar ↔ recusar" },
  { id: "sa-14", level: "B1", word: "brave", kind: "synonym", options: ["courageous", "afraid", "nervous", "shy"], correct: "courageous", translationPt: "corajoso = courageous" },
  { id: "sa-15", level: "B2", word: "reluctant", kind: "synonym", options: ["unwilling", "eager", "willing", "keen"], correct: "unwilling", translationPt: "relutante = unwilling" },
  { id: "sa-16", level: "B2", word: "genuine", kind: "antonym", options: ["fake", "real", "honest", "true"], correct: "fake", translationPt: "genuíno ↔ falso" },
  { id: "sa-17", level: "B2", word: "thorough", kind: "synonym", options: ["meticulous", "careless", "quick", "vague"], correct: "meticulous", translationPt: "meticuloso = meticulous" },
  { id: "sa-18", level: "B2", word: "reveal", kind: "antonym", options: ["hide", "show", "expose", "disclose"], correct: "hide", translationPt: "revelar ↔ esconder" },
  { id: "sa-19", level: "C1", word: "happy", kind: "synonym", options: ["ecstatic", "content", "annoyed", "indifferent"], correct: "ecstatic", translationPt: "feliz → extasiado (intensidade maior)" },
  { id: "sa-20", level: "C1", word: "ambiguous", kind: "synonym", options: ["unclear", "obvious", "precise", "certain"], correct: "unclear", translationPt: "ambíguo = unclear" },
  { id: "sa-21", level: "C1", word: "reluctantly", kind: "antonym", options: ["willingly", "hesitantly", "unwillingly", "cautiously"], correct: "willingly", translationPt: "relutantemente ↔ de boa vontade" },
  { id: "sa-22", level: "C1", word: "meticulous", kind: "antonym", options: ["careless", "precise", "thorough", "detailed"], correct: "careless", translationPt: "meticuloso ↔ descuidado" },
];

export function getSynonymAntonymItem(id: string): SynonymAntonymItem | undefined {
  return SYNONYM_ANTONYM_ITEMS.find((s) => s.id === id);
}
