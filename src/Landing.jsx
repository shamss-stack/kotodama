import { useState, useEffect } from "react";

const KANJI = ["言","霊","道","学","語","心","水","山","花","空","光","風","夢","力","静"];
const TAGLINES = ["Master Japanese.", "One word at a time.", "言霊 — spirit of words."];

function FloatingKanji() {
  const items = KANJI.map((k, i) => ({
    kanji: k, left: `${5 + (i * 6.5) % 90}%`, top: `${10 + (i * 13) % 80}%`,
    size: 16 + (i * 7) % 32, delay: i * 0.4, duration: 6 + (i * 1.3) % 6, opacity: 0.04 + (i % 4) * 0.025,
  }));
  return (
    <div style={s.kanjiField}>
      {items.map((item, i) => (
        <div key={i} style={{
          position:"absolute", left:item.left, top:item.top, fontSize:item.size,
          color:"#6EE7B7", opacity:item.opacity, fontFamily:"'Noto Serif JP',serif", fontWeight:700,
          animation:`floatKanji ${item.duration}s ease-in-out ${item.delay}s infinite`,
          userSelect:"none", pointerEvents:"none",
        }}>{item.kanji}</div>
      ))}
    </div>
  );
}

export default function Landing({ onNavigate }) {
  const [taglineIdx, setTaglineIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setTaglineIdx(i => (i + 1) % TAGLINES.length); setVisible(true); }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@400;500&display=swap');
        @keyframes floatKanji { 0%,100%{transform:translateY(0px) rotate(0deg);} 33%{transform:translateY(-18px) rotate(3deg);} 66%{transform:translateY(10px) rotate(-2deg);} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:translateY(0);} }
        @keyframes breathe { 0%,100%{transform:scale(1);opacity:0.06;} 50%{transform:scale(1.08);opacity:0.14;} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.3);} 50%{box-shadow:0 0 0 12px rgba(16,185,129,0);} }
        .game-card:hover{transform:translateY(-4px);border-color:#10B981 !important;}
        .cta-btn:hover{background:#0d9e6e !important;}
        .nav-link:hover{color:#6EE7B7 !important;}
      `}</style>

      <FloatingKanji />
      <div style={{position:"fixed",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(110,231,183,0.04)",top:-200,left:-200,animation:"breathe 8s ease-in-out infinite",pointerEvents:"none"}} />
      <div style={{position:"fixed",width:400,height:400,borderRadius:"50%",border:"1px solid rgba(110,231,183,0.05)",top:"40%",left:"60%",animation:"breathe 8s ease-in-out 2s infinite",pointerEvents:"none"}} />

      <nav style={s.nav}>
        <div style={s.navLogo}>
          <div style={s.logoBadge}>言</div>
          <span style={s.logoWord}>Kotodama</span>
          <span style={s.logoSub}>言霊</span>
        </div>
        <div style={s.navLinks}>
          <a className="nav-link" onClick={() => onNavigate("quiz")} style={s.navLink}>Practice</a>
          <a className="nav-link" onClick={() => onNavigate("blitz")} style={s.navLink}>Blitz</a>
          <button onClick={() => onNavigate("login")} style={s.navBtn}>Sign in</button>
        </div>
      </nav>

      <div style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.badge}>JLPT N5 → N1 · Free</div>
          <div style={s.kanjiHero}>言霊</div>
          <h1 style={s.h1}>The spirit of<br /><em style={s.h1Em}>Japanese words</em><br />lives here.</h1>
          <div style={{...s.tagline,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(8px)",transition:"opacity 0.4s, transform 0.4s"}}>
            {TAGLINES[taglineIdx]}
          </div>
          <div style={s.inkLine} />
          <p style={s.sub}>Gamified JLPT prep — quiz your way from N5 to N1.<br />Spaced repetition. Verb conjugation drills. Real progress.</p>
          <div style={s.ctaRow}>
            <button className="cta-btn" onClick={() => onNavigate("quiz")} style={s.ctaBtn}>Begin your journey →</button>
            <button onClick={() => onNavigate("blitz")} style={s.ctaSecondary}>Try Verb Blitz ⚡</button>
          </div>
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>STUDY MODES</p>
          <h2 style={s.sectionTitle}>Two ways to learn</h2>
          <div style={s.gameGrid}>
            <div className="game-card" onClick={() => onNavigate("quiz")} style={s.gameCard}>
              <div style={s.gameIcon}><div style={s.gameKanji}>問</div></div>
              <h3 style={s.gameTitle}>JLPT Quiz</h3>
              <p style={s.gameDesc}>Progress through N5 → N1 vocabulary, kanji and grammar. Earn XP with every correct answer.</p>
              <div style={s.gameTag}>Vocabulary · Grammar · Kanji</div>
            </div>
            <div className="game-card" onClick={() => onNavigate("blitz")} style={{...s.gameCard,borderColor:"#0B3D2E"}}>
              <div style={{position:"absolute",top:16,right:16,background:"#10B981",color:"#050F0A",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:4,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>NEW</div>
              <div style={s.gameIcon}><div style={s.gameKanji}>動</div></div>
              <h3 style={s.gameTitle}>Verb Conjugation Blitz</h3>
              <p style={s.gameDesc}>Race against the clock. See a verb in dictionary form — pick the right conjugation before time runs out.</p>
              <div style={s.gameTag}>ます-form · て-form · Negative · Past</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.levelsSection}>
        <div style={s.sectionInner}>
          <p style={s.sectionLabel}>JLPT LEVELS</p>
          {["N5","N4","N3","N2","N1"].map((level,i) => {
            const descs=["Basic vocabulary & hiragana. The starting point.","Everyday expressions & simple kanji.","Intermediate — newspapers, conversation.","Advanced — complex texts, nuanced speech.","Mastery — native-level comprehension."];
            const widths=["20%","40%","60%","80%","100%"];
            return (
              <div key={level} style={s.levelRow}>
                <span style={s.levelLabel}>{level}</span>
                <div style={s.levelBarWrap}><div style={{...s.levelBar,width:widths[i]}} /></div>
                <span style={s.levelDesc}>{descs[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={s.logoBadge}>言</div>
            <span style={{color:"#4B8C6A",fontSize:13,fontFamily:"'DM Mono',monospace"}}>kotodama.cc · 言霊</span>
          </div>
          <p style={{fontSize:12,color:"#1A3D28",fontFamily:"'DM Mono',monospace"}}>Free forever for N5 & N4 · Built with 心</p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  page:{minHeight:"100vh",background:"#050F0A",position:"relative",overflow:"hidden"},
  kanjiField:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0},
  nav:{position:"relative",zIndex:10,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 48px",borderBottom:"1px solid rgba(110,231,183,0.06)"},
  navLogo:{display:"flex",alignItems:"center",gap:10},
  logoBadge:{width:36,height:36,background:"#0B3D2E",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif",fontWeight:700},
  logoWord:{fontSize:17,fontWeight:600,color:"#E2FAF0",fontFamily:"'Cormorant Garamond',serif",letterSpacing:"0.5px"},
  logoSub:{fontSize:12,color:"#2A6B4A",fontFamily:"'Noto Serif JP',serif",marginLeft:4},
  navLinks:{display:"flex",alignItems:"center",gap:24},
  navLink:{fontSize:13,color:"#4B8C6A",textDecoration:"none",cursor:"pointer",transition:"color 0.2s",fontFamily:"'DM Mono',monospace"},
  navBtn:{background:"transparent",border:"1px solid #1A3D28",borderRadius:6,color:"#6EE7B7",padding:"7px 16px",fontSize:13,cursor:"pointer",fontFamily:"'DM Mono',monospace"},
  hero:{position:"relative",zIndex:5,display:"flex",justifyContent:"center",padding:"80px 24px 60px"},
  heroInner:{maxWidth:640,textAlign:"center",animation:"fadeUp 1s ease 0.2s both"},
  badge:{display:"inline-block",background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:20,padding:"5px 16px",fontSize:11,color:"#4B8C6A",fontFamily:"'DM Mono',monospace",letterSpacing:2,marginBottom:32},
  kanjiHero:{fontSize:80,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif",fontWeight:300,opacity:0.15,lineHeight:1,marginBottom:8,letterSpacing:16},
  h1:{fontSize:52,fontWeight:300,color:"#E2FAF0",fontFamily:"'Cormorant Garamond',serif",lineHeight:1.15,margin:"0 0 20px",letterSpacing:"-0.5px"},
  h1Em:{fontStyle:"italic",color:"#6EE7B7",fontWeight:400},
  tagline:{fontSize:15,color:"#4B8C6A",fontFamily:"'DM Mono',monospace",marginBottom:24,minHeight:24},
  inkLine:{width:60,height:1,background:"linear-gradient(90deg,transparent,#10B981,transparent)",margin:"0 auto 24px",opacity:0.4},
  sub:{fontSize:16,color:"#4B8C6A",lineHeight:1.7,marginBottom:36,fontFamily:"'Cormorant Garamond',serif",fontWeight:300},
  ctaRow:{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"},
  ctaBtn:{background:"#10B981",color:"#050F0A",border:"none",borderRadius:10,padding:"14px 28px",fontSize:15,fontWeight:700,cursor:"pointer",transition:"background 0.2s",fontFamily:"'DM Mono',monospace",animation:"pulse 3s infinite"},
  ctaSecondary:{background:"transparent",border:"1px solid #1A3D28",borderRadius:10,color:"#6EE7B7",padding:"14px 24px",fontSize:15,cursor:"pointer",fontFamily:"'DM Mono',monospace"},
  section:{position:"relative",zIndex:5,padding:"60px 24px",borderTop:"1px solid rgba(110,231,183,0.06)"},
  sectionInner:{maxWidth:800,margin:"0 auto"},
  sectionLabel:{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#2A6B4A",letterSpacing:3,textTransform:"uppercase",marginBottom:8},
  sectionTitle:{fontSize:32,fontWeight:300,color:"#E2FAF0",fontFamily:"'Cormorant Garamond',serif",marginBottom:40},
  gameGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},
  gameCard:{background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:16,padding:28,cursor:"pointer",transition:"all 0.25s",position:"relative"},
  gameIcon:{width:52,height:52,background:"#0B3D2E",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16},
  gameKanji:{fontSize:26,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif",fontWeight:700},
  gameTitle:{fontSize:17,fontWeight:600,color:"#E2FAF0",marginBottom:10,fontFamily:"'Cormorant Garamond',serif"},
  gameDesc:{fontSize:13,color:"#4B8C6A",lineHeight:1.6,marginBottom:14},
  gameTag:{fontSize:10,color:"#2A6B4A",fontFamily:"'DM Mono',monospace",letterSpacing:1},
  levelsSection:{position:"relative",zIndex:5,padding:"60px 24px",borderTop:"1px solid rgba(110,231,183,0.06)"},
  levelRow:{display:"flex",alignItems:"center",gap:20,marginBottom:16},
  levelLabel:{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#6EE7B7",width:28,flexShrink:0},
  levelBarWrap:{flex:1,height:4,background:"#0B1F14",borderRadius:2,overflow:"hidden"},
  levelBar:{height:"100%",background:"linear-gradient(90deg,#0B3D2E,#10B981)",borderRadius:2},
  levelDesc:{fontSize:12,color:"#2A6B4A",fontFamily:"'Cormorant Garamond',serif",width:260},
  footer:{position:"relative",zIndex:5,borderTop:"1px solid rgba(110,231,183,0.06)",padding:"24px 48px"},
  footerInner:{maxWidth:800,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"},
};
