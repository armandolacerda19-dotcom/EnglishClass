export function formatLevelCode(profile: { currentLevel: string; currentSublevel: number }) {
  if (profile.currentLevel === "PRE_A1") return "Pre-A1";
  return `${profile.currentLevel}.${profile.currentSublevel}`;
}
