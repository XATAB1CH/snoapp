import React, { useState } from "react";

export default function EmbeddedGame() {
  const [ready, setReady] = useState(false);

  return (
    <div className="page">
      <div className="rating-title" style={{ marginBottom: 10 }}>Игра</div>

      <div className="game-frame-wrap" style={{ position: 'relative' }}>
        {!ready && (
          <div className="game-loader" style={{
            position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(0,0,0,.15)', color:'#fff', zIndex:1
          }}>
            Загрузка…
          </div>
        )}

        <iframe
          title="SNO Game"
          src="../public/game/index.html"
          className={`game-frame ${ready ? "is-ready" : ""}`}
          onLoad={() => setReady(true)}
          allow="autoplay; fullscreen"
          style={{
            width:'100%',
            maxWidth:420,
            height:'90vh',
            border:'0',
            borderRadius:12,
            overflow:'hidden',
            display:'block',
            margin:'0 auto'
          }}
        />
      </div>
    </div>
  );
}
