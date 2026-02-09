// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/** Нормализуем tg_name:
 *  1) username (без @), если есть
 *  2) иначе "Имя Фамилия"
 *  3) иначе берём переданный fallback (и тоже чистим @)
 */
function deriveTgName(fallback = "") {
  const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (u && typeof u === "object") {
    if (u.username) return String(u.username).replace(/^@/, "");
    const pretty = `${u.first_name || ""} ${u.last_name || ""}`.trim();
    if (pretty) return pretty;
  }
  return String(fallback || "").replace(/^@/, "");
}

export default function Register() {
  const navigate = useNavigate();
  const loc = useLocation();

  const [vkLink, setVkLink] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [tgId, setTgId] = useState(null);
  const [tgName, setTgName] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const tgUser = loc.state?.tgUser;
    const unsafe = window.Telegram?.WebApp?.initDataUnsafe?.user;

    // 1) Если пришли сюда через navigate(..., { state: { tgUser } })
    if (tgUser?.tg_id || tgUser?.TGID) {
      setTgId(tgUser.tg_id || tgUser.TGID);

      const fromState =
        tgUser.tg_name ||
        tgUser.username ||
        tgUser.tg_username ||
        `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim();
      setTgName(deriveTgName(fromState));

      if (!firstName && tgUser.first_name) setFirstName(tgUser.first_name);
      if (!lastName && tgUser.last_name) setLastName(tgUser.last_name);
      return;
    }

    // 2) Иначе читаем напрямую из Telegram WebApp initDataUnsafe
    if (unsafe) {
      setTgId(unsafe.id);
      setTgName(deriveTgName()); // username без @ или "Имя Фамилия"
      if (!firstName && unsafe.first_name) setFirstName(unsafe.first_name);
      if (!lastName && unsafe.last_name) setLastName(unsafe.last_name);
      return;
    }

    // 3) На крайний случай — пробуем /api/auth, если initData доступен
    (async () => {
      try {
        const raw = window.Telegram?.WebApp?.initData || "";
        if (!raw) return;
        const r = await fetch(`/api/auth?initData=${encodeURIComponent(raw)}`);
        if (!r.ok) return;
        const u = await r.json();

        if (u?.tg_id || u?.TGID) setTgId(u.tg_id || u.TGID);

        const fromServer =
          u?.tg_name ||
          u?.username ||
          u?.tg_username ||
          `${u?.first_name || ""} ${u?.last_name || ""}`.trim();
        setTgName((prev) => deriveTgName(prev || fromServer));

        if (!firstName && (u?.first_name || u?.firstName)) {
          setFirstName(u.first_name || u.firstName);
        }
        if (!lastName && (u?.last_name || u?.lastName)) {
          setLastName(u.last_name || u.lastName);
        }
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc.state]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!tgId) {
      setErr("tg_id не найден. Откройте приложение из Telegram.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setErr("Укажите ваше имя и фамилию.");
      return;
    }

    try {
      setLoading(true);

      // Гарантируем расчёт tg_name прямо перед отправкой
      const normalizedTgName = deriveTgName(tgName);

      const body = {
        tg_id: Number(tgId),
        tg_name: normalizedTgName,        // <-- отправляем обязательно
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        vk_url: vkLink.trim() || null,
      };

      const res = await fetch(`/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Ошибка регистрации");
      }

      navigate("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <h2>Регистрация</h2>
        <p className="register-subtitle">
          Укажите ваше имя, фамилию и ссылку на профиль VK
        </p>

        {err && <div className="register-error">{err}</div>}

        <form onSubmit={onSubmit} className="register-form">
          <label htmlFor="firstName">Введите ваше имя:</label>
          <input
            id="firstName"
            type="text"
            placeholder="Ваше имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label htmlFor="lastName">Введите вашу фамилию:</label>
          <input
            id="lastName"
            type="text"
            placeholder="Ваша фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label htmlFor="vkLink">Ссылка на профиль VK:</label>
          <input
            id="vkLink"
            type="url"
            inputMode="url"
            placeholder="https://vk.com/..."
            value={vkLink}
            onChange={(e) => setVkLink(e.target.value)}
          />

          {tgName && (
            <p className="register-tgname">
              Telegram: <b>{tgName}</b>
            </p>
          )}

          <button
            type="submit"
            className="register-btn"
            disabled={loading || !tgId}
            aria-busy={loading}
          >
            {loading ? "Отправляем..." : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}
