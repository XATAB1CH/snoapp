import React, { useEffect, useState } from "react";

export default function Shop() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/products", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const mapped = Array.isArray(data)
          ? data.map((p) => ({
              id: p.product_id ?? p.ProductID ?? p.id,
              name: p.name ?? p.Name,
              price: p.price ?? p.Price,
              img_url: p.img_url ?? p.ImgURL ?? p.image,
            }))
          : [];

        if (alive) setItems(mapped);
      } catch (e) {
        if (alive) setErr(e.message || "Не удалось загрузить товары");
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
        <div className="shop-title">Магазин</div>
        <div className="card">Загрузка…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="page">
        <div className="shop-title">Магазин</div>
        <div className="auth-msg auth-msg--error" style={{ marginBottom: 12 }}>
          {err}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="shop-title">Магазин</div>

      <div className="shop-grid">
        {items.map((p) => (
          <div key={p.id} className="product-card">
            <div className="product-thumb">
              {p.img_url ? (
                <img src={p.img_url} alt={p.name || "Товар"} />
              ) : (
                <span className="muted" style={{ fontSize: 12 }}>
                  без изображения
                </span>
              )}
            </div>

            <div className="product-title">
              {p.name || "Без названия"}
            </div>

            <div className="product-row">
              <div className="price-wrap">
                <span className="dot-purple" />
                <span className="price">{p.price ?? 0}</span>
              </div>

              <button
                className="pill"
                type="button"
                onClick={() => alert(`Покупка: ${p.name} за ${p.price} СНОбелей`)}
              >
                Купить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
