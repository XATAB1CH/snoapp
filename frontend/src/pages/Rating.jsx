import React, { useEffect, useState } from "react";
import { safeImg } from "../lib/url.js";

export default function Rating() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/leaderboard", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const data = await res.json();
        // Маппим на формат UI: score = balance
        const mapped = Array.isArray(data)
          ? data.map((u, idx) => {
              const id = u.tg_id ?? u.TGID ?? u.id ?? idx + 1;
              const first = u.first_name ?? u.FirstName ?? "";
              const last  = u.last_name  ?? u.LastName  ?? "";
              const name  = `${first} ${last}`.trim() || "Пользователь";
              return {
                id,
                name,
                score: u.balance ?? u.Balance ?? 0,
                avatar: u.profile_img ?? u.ProfileImg ?? "",
                vk: u.vk_url ?? u.VkURL ?? "",
              };
            })
          : [];

        if (alive) setItems(mapped);
      } catch (e) {
        if (alive) setErr(e.message || "Не удалось загрузить рейтинг");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="rating-title">Рейтинг</div>
        <div className="card">Загрузка…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="page">
        <div className="rating-title">Рейтинг</div>
        <div className="auth-msg auth-msg--error" style={{ marginBottom: 12 }}>
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="rating-title">Рейтинг</div>

      <div className="leader-list">
        {items.map((u, i) => (
          <div
            key={u.id + "-" + i}
            className={`leader-item ${i === 0 ? "leader-top" : ""}`}
          >
            {/* rank (#1, #2, ...) */}
            <div className="leader-rank">#{i + 1}</div>

            {/* avatar */}
            <img
              className="leader-avatar"
              src={safeImg(u.avatar)}
              alt={u.name}
            />

            {/* name + vk (с обрезкой по стилю .profile-vk, если захочешь) */}
            <div>
              <div className="leader-name">{u.name}</div>
              <div className="leader-meta">{u.vk || "vk.com/"}</div>
            </div>

            {/* score == balance */}
            <div className="leader-score">{u.score}</div>

            {/* purple dot */}
            <div className="dot-purple" />
          </div>
        ))}
      </div>
    </div>
  );
}
