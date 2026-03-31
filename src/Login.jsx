import { useState } from "react";

export default function Login({ onNavigate }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit() {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true); setError(null);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); }
      else {
        setSuccess(mode === "login" ? "Welcome back! Redirecting..." : "Account created! Redirecting...");
        setTimeout(() => onNavigate("quiz"), 1200);
      }
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  }

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .inp:focus{border-color:#10B981 !important;outline:none;}
        .submit-btn:hover{background:#0d9e6e !important;}
      `}</style>
      {["言","霊","道","語","心"].map((k,i) => (
        <div key={i} style={{position:"fixed",fontSize:120+i*40,color:"#6EE7B7",opacity:0.02,fontFamily:"'Noto Serif JP',serif",fontWeight:700,top:`${10+i*18}%`,left:`${5+i*20}%`,animation:`floatSlow ${7+i}s ease-in-out ${i*0.8}s infinite`,userSelect:"none",pointerEvents:"none"}}>{k}</div>
      ))}
      <button onClick={() => onNavigate("landing")} style={s.back}>← Back</button>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoBadge}>言</div>
          <div><div style={s.logoText}>Kotodama</div><div style={s.logoSub}>言霊 · spirit of words</div></div>
        </div>
        <div style={s.inkDivider} />
        <div style={s.modeRow}>
          <button onClick={() => { setMode("login"); setError(null); }} style={{...s.modeBtn,...(mode==="login"?s.modeBtnActive:{})}}>Sign in</button>
          <button onClick={() => { setMode("register"); setError(null); }} style={{...s.modeBtn,...(mode==="register"?s.modeBtnActive:{})}}>Create account</button>
        </div>
        <p style={s.subtitle}>{mode==="login"?"Welcome back. Continue your journey.":"Begin your journey into Japanese."}</p>
        <div style={s.fieldGroup}>
          <label style={s.label}>Email</label>
          <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" style={s.input} />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Password</label>
          <input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="8+ characters" style={s.input} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} />
        </div>
        {error && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}
        <button className="submit-btn" onClick={handleSubmit} disabled={loading} style={s.submitBtn}>
          {loading ? "..." : mode==="login" ? "Sign in →" : "Create account →"}
        </button>
        <p style={s.switchText}>
          {mode==="login"?"No account yet? ":"Already have an account? "}
          <span onClick={() => { setMode(mode==="login"?"register":"login"); setError(null); }} style={s.switchLink}>
            {mode==="login"?"Create one":"Sign in"}
          </span>
        </p>
        <div style={s.freeNote}>N5 & N4 content is completely free — no account required to practice.</div>
      </div>
    </div>
  );
}

const s = {
  page:{minHeight:"100vh",background:"#050F0A",display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"},
  back:{position:"fixed",top:24,left:24,background:"transparent",border:"none",color:"#2A6B4A",fontSize:13,cursor:"pointer",fontFamily:"'DM Mono',monospace",zIndex:20},
  card:{position:"relative",zIndex:10,background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:20,padding:"40px",width:"100%",maxWidth:400,animation:"fadeUp 0.6s ease both"},
  logoWrap:{display:"flex",alignItems:"center",gap:12,marginBottom:24},
  logoBadge:{width:44,height:44,background:"#0B3D2E",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif",fontWeight:700},
  logoText:{fontSize:18,fontWeight:600,color:"#E2FAF0",fontFamily:"'Cormorant Garamond',serif"},
  logoSub:{fontSize:11,color:"#2A6B4A",fontFamily:"'DM Mono',monospace",marginTop:2},
  inkDivider:{height:1,background:"linear-gradient(90deg,transparent,#1A3D28,transparent)",marginBottom:24},
  modeRow:{display:"flex",marginBottom:16,background:"#050F0A",borderRadius:8,padding:3},
  modeBtn:{flex:1,padding:"8px 0",background:"transparent",border:"none",color:"#2A6B4A",fontSize:13,cursor:"pointer",borderRadius:6,fontFamily:"'DM Mono',monospace"},
  modeBtnActive:{background:"#0B3D2E",color:"#6EE7B7"},
  subtitle:{fontSize:13,color:"#2A6B4A",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",marginBottom:24},
  fieldGroup:{marginBottom:16},
  label:{display:"block",fontSize:11,color:"#2A6B4A",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:6},
  input:{width:"100%",background:"#050F0A",border:"1px solid #1A3D28",borderRadius:8,padding:"11px 14px",color:"#E2FAF0",fontSize:14,fontFamily:"'DM Mono',monospace",boxSizing:"border-box"},
  errorBox:{background:"#3D0B0B",border:"1px solid #7F1D1D",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#FCA5A5",marginBottom:16},
  successBox:{background:"#0B3D2E",border:"1px solid #10B981",borderRadius:8,padding:"10px 14px",fontSize:13,color:"#6EE7B7",marginBottom:16},
  submitBtn:{width:"100%",background:"#10B981",color:"#050F0A",border:"none",borderRadius:10,padding:"13px 0",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",marginBottom:16},
  switchText:{textAlign:"center",fontSize:12,color:"#2A6B4A",fontFamily:"'DM Mono',monospace"},
  switchLink:{color:"#6EE7B7",cursor:"pointer",textDecoration:"underline"},
  freeNote:{marginTop:20,padding:"12px 14px",background:"#050F0A",borderRadius:8,fontSize:11,color:"#1A3D28",fontFamily:"'DM Mono',monospace",textAlign:"center",lineHeight:1.5},
};
