// src/state/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const UserCtx = createContext(null);

async function fetchJson(url, options = {}) {
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

export function UserProvider({ children, prefetchedAuth = null }) {
  const [authInfo, setAuthInfo] = useState(prefetchedAuth);
  const [user, setUser] = useState(null);   // профиль из БД
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      // если /api/auth уже сделан AuthGate — используем его
      let auth = authInfo;
      if (!auth) {
        auth = await fetchJson(`/api/auth`);
        setAuthInfo(auth);
      }
      const tgId = auth?.tg_id || auth?.TGID || auth?.id;
      if (!tgId) throw new Error("Не получили tg_id");

      // тянем профиль
      const profile = await fetchJson(`/api/students/${tgId}`);
      setUser(profile);
    } catch (e) {
      setError(e.message || "Profile load error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const value = { user, authInfo, loading, error, refresh: load };
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  return useContext(UserCtx);
}
