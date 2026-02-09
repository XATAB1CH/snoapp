export function safeExternalHref(v) {
  const s = (v ?? "").toString().trim();
  if (!s) return undefined;
  const lower = s.toLowerCase();
  if (lower.startsWith("javascript:") || lower.startsWith("data:")) return undefined;
  if (lower.startsWith("http://") || lower.startsWith("https://")) return s;
  if (lower.startsWith("//")) return "https:" + s;
  if (/^[a-z0-9.-]+\\.[a-z]{2,}([/:?#].*)?$/i.test(s)) return "https://" + s;
  return undefined;
}
export function safeImg(v) {
  const s = (v ?? "").toString().trim();
  if (!s) return placeholder();
  try { return new URL(s, window.location.origin).toString(); }
  catch { return placeholder(); }
}
export function placeholder(text="image") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect width='100%' height='100%' fill='%23e5e7eb'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16' font-family='Inter,Arial,sans-serif'>${text}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
}
