export function getCrowdStyle(level) {
  if (level === "Low")    return { bg:"bg-forest-50",  text:"text-forest-500", dot:"bg-forest-400", border:"border-forest-100" };
  if (level === "Medium") return { bg:"bg-amber-50",   text:"text-amber-600",  dot:"bg-amber-400",  border:"border-amber-100" };
  if (level === "High")   return { bg:"bg-red-50",     text:"text-red-500",    dot:"bg-red-400",    border:"border-red-100" };
  return { bg:"bg-stone-50", text:"text-stone-400", dot:"bg-stone-300", border:"border-stone-100" };
}
export function authColor(score) {
  if (score >= 70) return "#2D6A4F";
  if (score >= 45) return "#D4A853";
  return "#E07A3A";
}
export function fmtCount(n) {
  return n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(n);
}
export function catEmoji(cat) {
  return { café:"☕", monument:"🏛️", historic:"🏚️", nature:"🌿", religious:"🕌", garden:"🌸", museum:"🖼️", village:"🏡", temple:"⛩️" }[cat] || "📍";
}
