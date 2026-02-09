import React, { useEffect, useState } from "react";

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`/api/news`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.map((n) => ({
              id: n.news_id ?? n.NewsID ?? n.newsID ?? n.id,
              title: n.title ?? n.Title,
              link: n.link ?? n.Link,
              image_url: n.image_url ?? n.ImageURL ?? n.image,
            }))
          : [];

        if (alive) setItems(mapped);
      } catch (e) {
        if (alive) setErr(e.message || "Не удалось загрузить новости");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="news-title">Новости</div>
        <div className="card">Загрузка…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="page">
        <div className="news-title">Новости</div>
        <div className="auth-msg auth-msg--error" style={{ marginBottom: 12 }}>
          {err}
        </div>
        <button
          className="btn"
          onClick={() => window.location.reload()}
        >
          Повторить загрузку
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="news-title">Новости</div>

      <div className="news-list">
        {items.map((n) => (
          <article key={n.id} className="news-card">
            {n.image_url ? (
              <div className="news-media">
                <img src={n.image_url} alt={n.title || "Новость"} />
              </div>
            ) : null}

            <div className="news-text">
              {n.title || "Без заголовка"}
            </div>

            {n.link ? (
              <div className="news-actions">
                <a
                  className="news-btn"
                  href={n.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Читать
                </a>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
