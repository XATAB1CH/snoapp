import React, { useEffect, useState } from "react";
import { safeExternalHref, safeImg } from "../lib/url.js";
import { useUser } from "../state/UserContext.jsx";

export default function Profile() {
  const { user, authInfo, loading, error, refresh } = useUser();

  const [me] = useState({
    avatar: "https://i.pravatar.cc/128?img=3",
  });

  const vk = safeExternalHref(me.username);

  // Данные студента
  const firstName = user?.first_name || authInfo?.first_name;
  const lastName  = user?.last_name  || authInfo?.last_name;
  const vkUrl     = user?.vk_url;
  const balance = user?.balance;
  const totalBalance = user?.total_balance;

  return (
    <div className="page">
      <div className="card">
        {/* аватар + имя + VK */}
        <div className="profile-top">
          <img
            className="avatar"
            src={safeImg(me.avatar)}
            alt="avatar"
            style={{ borderRadius: 12 }}
          />
          <div style={{ flex: 1 }}>
            <div className="profile-name">{firstName} {lastName}</div>
            {vk ? (
              <a className="profile-vk" href={vk} target="_blank" rel="noopener noreferrer">VK</a>
            ) : (
              <span className="vk-link">{vkUrl}</span>
            )}
          </div>
        </div>

        {/* белая карточка с балансом и показателями */}
        <div className="balance-card">
          <div className="balance-value">
            {balance} <span className="badge-dot" />
          </div>

          <div className="balance-row"  >
            <div className="balance-col">
              <span className="muted">Заглушка</span>
              <div style={{ fontWeight: 700 }}>число</div>
            </div>
            <div className="balance-col">
              <span className="muted">Накоплено</span>
              <div style={{ fontWeight: 700 }}>{totalBalance}</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button className="btn">Обменять снобели</button>
          </div>
        </div>
      </div>
    </div>
  );
}
