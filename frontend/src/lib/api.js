// утилиты для API
export function getInitDataRaw() {
  const tg = window.Telegram?.WebApp;
  const raw = tg?.initData || "";
  if (raw) return raw;
  const params = new URLSearchParams(window.location.search);
  return params.get("initData") || "";
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `${res.status} ${res.statusText}`);
  }
  return res.json();
}

// 1) авторизация по initData → вернёт объект с tg_id (и, возможно, именем)
export async function authByInitData() {
  const raw = getInitDataRaw();
  if (!raw) throw new Error("нет initData из Telegram");
  return fetchJson(`/api/auth?initData=${encodeURIComponent(raw)}`);
}

// 2) получить профиль пользователя по tg_id
export async function getStudent(tgId) {
  // предполагаем эндпоинт вида /api/students/:tg_id
  return fetchJson(`/api/students/${tgId}`);
}
