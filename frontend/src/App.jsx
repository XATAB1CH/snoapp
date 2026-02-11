import { useEffect, useState } from "react";
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserProvider } from "./state/UserContext.jsx";

import Header from "./components/Header.jsx";
import TabBar from "./components/TabBar.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

import Profile from "./pages/Profile.jsx";
import Game from "./pages/Game.jsx";
import Rating from "./pages/Rating.jsx";
import Shop from "./pages/Shop.jsx";
import Register from "./pages/Register.jsx";
import News from "./pages/News.jsx";

// ===== helpers =====
function getInitDataRaw() {
  const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;
  const raw = tg?.initData || "";
  if (!raw) {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("initData");
    return q || "";
  }
  return raw;
}

function NotInTelegram() {
  return (
    <div className="page" style={{ padding: 16 }}>
      <h2>Доступ только из Telegram</h2>
      <p>Откройте мини-приложение через Telegram, чтобы продолжить.</p>
    </div>
  );
}

// ===== AuthGate — проверка подписи и регистрации =====
function AuthGate({ children }) {
  const [state, setState] = useState({
    loading: true,
    error: null,
    tgUser: null,
    isRegistered: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const raw = getInitDataRaw();
        if (!raw) {
          setState({ loading: false, error: "NOT_IN_TG" });
          return;
        }

        // 1) Верификация initData
        const authRes = await fetch(`/api/auth?initData=${encodeURIComponent(raw)}`, {
          method: "GET",
          credentials: "include",
        });

        const contentType = authRes.headers.get("Content-Type");
        const responseText = await authRes.text();

        if (!authRes.ok) {
          throw new Error(responseText || "Auth failed");
        }

        if (contentType && contentType.includes("application/json")) {
          const tgUser = JSON.parse(responseText);
          const tgId = tgUser?.tg_id || tgUser?.TGID || tgUser?.id;
          if (!tgId) throw new Error("Не удалось получить tg_id из ответа /auth");

          // 2) Проверка регистрации
          const regRes = await fetch(`/api/students/${encodeURIComponent(tgId)}`, {
            method: "GET",
            credentials: "include",
          });

          if (regRes.status === 404 || regRes.status === 500) {
            setState({ loading: false, tgUser, isRegistered: false });
            navigate("/register", { replace: true, state: { tgUser } });
            return;
          }

          if (!regRes.ok) {
            const msg = await regRes.text();
            throw new Error(msg || "Registration check failed");
          }

          setState({ loading: false, tgUser, isRegistered: true });
        } else {
          throw new Error(`Expected JSON, but got: ${responseText}`);
        }
      } catch (e) {
        setState({ loading: false, error: e.message || "Auth error", tgUser: null, isRegistered: false });
      }
    };

    fetchAuthData();
  }, [navigate]);

  if (state.loading) return <LoadingSpinner />;
  if (state.error === "NOT_IN_TG") return <NotInTelegram />;
  if (state.error) {
    return (
      <div className="page" style={{ padding: 16 }}>
        <h3>Ошибка авторизации</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{state.error}</pre>
      </div>
    );
  }

  // Успешно авторизован
  return <UserProvider prefetchedAuth={state.tgUser}>{children}</UserProvider>;
}

// ===== Layout — скрываем Header/TabBar для /register =====
function Layout() {
  const loc = useLocation();
  const hideHeader = loc.pathname === "/game" || loc.pathname === "/register";
  const hideTabBar = loc.pathname === "/register";

  return (
    <div className="app">
      {!hideHeader && <Header />}
      <div className={`container ${hideHeader ? "container--noheader" : ""}`}>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/game" element={<Game />} />
          <Route path="/rating" element={<Rating />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/news" element={<News />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  );
}

// ===== App root =====
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <AuthGate>
              <Layout />
            </AuthGate>
          }
        />
      </Routes>
    </HashRouter>
  );
}
