import { useState, useEffect, useCallback } from "react";

const VERBS = [
  { dict:"食べる",romaji:"taberu",meaning:"to eat",type:"ru",forms:{"ます-form":"食べます","て-form":"食べて","Negative":"食べない","Past (た)":"食べた"} },
  { dict:"飲む",romaji:"nomu",meaning:"to drink",type:"u",forms:{"ます-form":"飲みます","て-form":"飲んで","Negative":"飲まない","Past (た)":"飲んだ"} },
  { dict:"行く",romaji:"iku",meaning:"to go",type:"u",forms:{"ます-form":"行きます","て-form":"行って","Negative":"行かない","Past (た)":"行った"} },
  { dict:"見る",romaji:"miru",meaning:"to see",type:"ru",forms:{"ます-form":"見ます","て-form":"見て","Negative":"見ない","Past (た)":"見た"} },
  { dict:"書く",romaji:"kaku",meaning:"to write",type:"u",forms:{"ます-form":"書きます","て-form":"書いて","Negative":"書かない","Past (た)":"書いた"} },
  { dict:"読む",romaji:"yomu",meaning:"to read",type:"u",forms:{"ます-form":"読みます","て-form":"読んで","Negative":"読まない","Past (た)":"読んだ"} },
  { dict:"話す",romaji:"hanasu",meaning:"to speak",type:"u",forms:{"ます-form":"話します","て-form":"話して","Negative":"話さない","Past (た)":"話した"} },
  { dict:"聞く",romaji:"kiku",meaning:"to listen",type:"u",forms:{"ます-form":"聞きます","て-form":"聞いて","Negative":"聞かない","Past (た)":"聞いた"} },
  { dict:"買う",romaji:"kau",meaning:"to buy",type:"u",forms:{"ます-form":"買います","て-form":"買って","Negative":"買わない","Past (た)":"買った"} },
  { dict:"帰る",romaji:"kaeru",meaning:"to return home",type:"u",forms:{"ます-form":"帰ります","て-form":"帰って","Negative":"帰らない","Past (た)":"帰った"} },
  { dict:"起きる",romaji:"okiru",meaning:"to wake up",type:"ru",forms:{"ます-form":"起きます","て-form":"起きて","Negative":"起きない","Past (た)":"起きた"} },
  { dict:"寝る",romaji:"neru",meaning:"to sleep",type:"ru",forms:{"ます-form":"寝ます","て-form":"寝て","Negative":"寝ない","Past (た)":"寝た"} },
  { dict:"来る",romaji:"kuru",meaning:"to come",type:"irregular",forms:{"ます-form":"来ます","て-form":"来て","Negative":"来ない","Past (た)":"来た"} },
  { dict:"する",romaji:"suru",meaning:"to do",type:"irregular",forms:{"ます-form":"します","て-form":"して","Negative":"しない","Past (た)":"した"} },
  { dict:"分かる",romaji:"wakaru",meaning:"to understand",type:"u",forms:{"ます-form":"分かります","て-form":"分かって","Negative":"分からない","Past (た)":"分かった"} },
  { dict:"会う",romaji:"au",meaning:"to meet",type:"u",forms:{"ます-form":"会います","て-form":"会って","Negative":"会わない","Past (た)":"会った"} },
  { dict:"待つ",romaji:"matsu",meaning:"to wait",type:"u",forms:{"ます-form":"待ちます","て-form":"待って","Negative":"待たない","Past (た)":"待った"} },
  { dict:"乗る",romaji:"noru",meaning:"to ride",type:"u",forms:{"ます-form":"乗ります","て-form":"乗って","Negative":"乗らない","Past (た)":"乗った"} },
  { dict:"教える",romaji:"oshieru",meaning:"to teach",type:"ru",forms:{"ます-form":"教えます","て-form":"教えて","Negative":"教えない","Past (た)":"教えた"} },
  { dict:"使う",romaji:"tsukau",meaning:"to use",type:"u",forms:{"ます-form":"使います","て-form":"使って","Negative":"使わない","Past (た)":"使った"} },
];

const CONJ_TYPES = ["ます-form","て-form","Negative","Past (た)"];
const ROUND_TIME = 15;
const ROUNDS = 10;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function getWrongs(correct, verb, conjType) {
  const pool = VERBS.filter(v => v.dict !== verb.dict).map(v => v.forms[conjType]).filter(Boolean);
  const shuffled = shuffle(pool);
  const wrongs = [];
  for (const opt of shuffled) {
    if (opt !== correct && !wrongs.includes(opt)) { wrongs.push(opt); if (wrongs.length === 3) break; }
  }
  return wrongs;
}

export default function VerbBlitz({ onNavigate }) {
  const [screen, setScreen] = useState("intro");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [timedOut, setTimedOut] = useState(false);

  const generateQ = useCallback(() => {
    const verb = VERBS[Math.floor(Math.random() * VERBS.length)];
    const conjType = CONJ_TYPES[Math.floor(Math.random() * CONJ_TYPES.length)];
    const correct = verb.forms[conjType];
    return { verb, conjType, correct, options: shuffle([correct, ...getWrongs(correct, verb, conjType)]) };
  }, []);

  useEffect(() => {
    if (screen === "game") { setCurrentQ(generateQ()); setSelected(null); setTimedOut(false); setTimeLeft(ROUND_TIME); }
  }, [screen, round]);

  useEffect(() => {
    if (screen !== "game" || selected || timedOut) return;
    if (timeLeft <= 0) {
      setTimedOut(true); setStreak(0);
      setResults(prev => [...prev, { verb:currentQ.verb.dict, meaning:currentQ.verb.meaning, conjType:currentQ.conjType, correct:currentQ.correct, given:null, wasCorrect:false }]);
      setTimeout(() => { if (round + 1 >= ROUNDS) setScreen("results"); else setRound(r => r + 1); }, 1800);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, screen, selected, timedOut]);

  function handleAnswer(opt) {
    if (selected || timedOut) return;
    setSelected(opt);
    const isCorrect = opt === currentQ.correct;
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak); setBestStreak(bs => Math.max(bs, newStreak));
    if (isCorrect) setScore(s => s + Math.ceil(10 + timeLeft));
    setResults(prev => [...prev, { verb:currentQ.verb.dict, meaning:currentQ.verb.meaning, conjType:currentQ.conjType, correct:currentQ.correct, given:opt, wasCorrect:isCorrect }]);
    setTimeout(() => { if (round + 1 >= ROUNDS) setScreen("results"); else setRound(r => r + 1); }, 1600);
  }

  function restart() { setRound(0); setScore(0); setStreak(0); setBestStreak(0); setResults([]); setSelected(null); setTimedOut(false); setScreen("game"); }

  const timerPct = (timeLeft / ROUND_TIME) * 100;
  const timerColor = timeLeft > 8 ? "#10B981" : timeLeft > 4 ? "#F59E0B" : "#EF4444";

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes timerPulse{0%,100%{opacity:1}50%{opacity:0.5}}
        .opt:hover:not(:disabled){border-color:#10B981 !important;color:#6EE7B7 !important;transform:translateX(4px);}
      `}</style>

      <button onClick={() => onNavigate("landing")} style={s.back}>← Back</button>

      {screen === "intro" && (
        <div style={s.center}>
          <div style={{animation:"fadeUp 0.5s ease both",textAlign:"center"}}>
            <div style={s.bigKanji}>動</div>
            <h1 style={s.introTitle}>Verb Conjugation Blitz</h1>
            <p style={s.introSub}>You have {ROUND_TIME} seconds per verb.<br />Pick the correct conjugation before time runs out.</p>
            <div style={s.tagRow}>{CONJ_TYPES.map(t => <span key={t} style={s.tag}>{t}</span>)}</div>
            <div style={s.statsRow}>
              <div style={s.stat}><span style={s.statN}>{ROUNDS}</span><span style={s.statL}>rounds</span></div>
              <div style={s.stat}><span style={s.statN}>{ROUND_TIME}s</span><span style={s.statL}>per verb</span></div>
              <div style={s.stat}><span style={s.statN}>+10</span><span style={s.statL}>base XP</span></div>
            </div>
            <button onClick={() => setScreen("game")} style={s.startBtn}>Start Blitz ⚡</button>
          </div>
        </div>
      )}

      {screen === "game" && currentQ && (
        <div style={s.gameWrap}>
          <div style={s.topBar}>
            <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
              <span style={s.roundLbl}>{round+1}/{ROUNDS}</span>
              <span style={s.scoreBadge}>⚡ {score}</span>
              {streak >= 2 && <span style={s.streakBadge}>🔥 {streak}x</span>}
            </div>
            <div style={s.timerTrack}><div style={{...s.timerFill,width:`${timerPct}%`,background:timerColor,transition:"width 1s linear,background 0.5s"}} /></div>
            <span style={{...s.timerNum,color:timerColor,animation:timeLeft<=4?"timerPulse 0.6s infinite":"none"}}>{timeLeft}s</span>
          </div>
          <div style={{...s.card,animation:"fadeUp 0.3s ease both"}}>
            <div style={s.conjTag}>{currentQ.conjType}</div>
            <p style={s.cardPrompt}>What is the <em style={{color:"#6EE7B7"}}>{currentQ.conjType}</em> of</p>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:4}}>
              <span style={s.verbK}>{currentQ.verb.dict}</span>
              <span style={s.verbR}>({currentQ.verb.romaji})</span>
            </div>
            <p style={s.verbM}>"{currentQ.verb.meaning}"</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8}}>
              {currentQ.options.map(opt => {
                let st = {...s.opt};
                if (selected || timedOut) {
                  if (opt === currentQ.correct) st = {...st,...s.optOk};
                  else if (opt === selected) st = {...st,...s.optBad,animation:"shake 0.3s ease"};
                  else st = {...st,opacity:0.3};
                }
                return <button key={opt} className="opt" onClick={() => handleAnswer(opt)} style={st} disabled={!!selected||timedOut}>{opt}</button>;
              })}
            </div>
            {timedOut && !selected && <div style={s.timeoutMsg}>⏱ Time's up! The answer was <strong style={{color:"#6EE7B7"}}>{currentQ.correct}</strong></div>}
            {selected && <div style={selected===currentQ.correct?s.fbGood:s.fbBad}>{selected===currentQ.correct?`✓ Correct! +${Math.ceil(10+timeLeft)} XP`:`✗ The correct answer is ${currentQ.correct}`}</div>}
          </div>
        </div>
      )}

      {screen === "results" && (
        <div style={s.resultsWrap}>
          <div style={{animation:"fadeUp 0.5s ease both"}}>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={s.bigKanji}>完</div>
              <h2 style={s.introTitle}>Blitz Complete</h2>
              <div style={{fontSize:52,fontWeight:700,color:"#6EE7B7",fontFamily:"'Cormorant Garamond',serif",lineHeight:1}}>{score} <span style={{fontSize:16,color:"#4B8C6A"}}>points</span></div>
              <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:12}}>
                <span style={s.tag}>✓ {results.filter(r=>r.wasCorrect).length}/{ROUNDS} correct</span>
                <span style={s.tag}>🔥 Best streak: {bestStreak}</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:28}}>
              {results.map((r,i) => (
                <div key={i} style={{...s.resultRow,borderLeft:`3px solid ${r.wasCorrect?"#10B981":"#EF4444"}`}}>
                  <div style={{flex:1}}><div style={{fontSize:16,color:"#E2FAF0",fontFamily:"'Noto Serif JP',serif"}}>{r.verb}</div><div style={{fontSize:11,color:"#2A6B4A",fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>{r.meaning}</div></div>
                  <div style={{width:90,fontSize:10,color:"#2A6B4A",fontFamily:"'DM Mono',monospace"}}>{r.conjType}</div>
                  <div style={{textAlign:"right"}}>
                    {!r.wasCorrect&&<div style={{fontSize:13,color:"#FCA5A5",textDecoration:"line-through",fontFamily:"'Noto Serif JP',serif"}}>{r.given||"⏱"}</div>}
                    <div style={{fontSize:13,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif"}}>{r.correct}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <button onClick={restart} style={s.startBtn}>Play again ⚡</button>
              <button onClick={() => onNavigate("quiz")} style={s.secBtn}>JLPT Quiz →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:{minHeight:"100vh",background:"#050F0A",fontFamily:"system-ui,sans-serif",position:"relative"},
  back:{position:"fixed",top:20,left:20,background:"transparent",border:"none",color:"#2A6B4A",fontSize:13,cursor:"pointer",fontFamily:"'DM Mono',monospace",zIndex:20},
  center:{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:24},
  bigKanji:{fontSize:64,color:"#6EE7B7",fontFamily:"'Noto Serif JP',serif",opacity:0.3,marginBottom:8},
  introTitle:{fontSize:32,fontWeight:300,color:"#E2FAF0",fontFamily:"'Cormorant Garamond',serif",marginBottom:12},
  introSub:{fontSize:14,color:"#4B8C6A",lineHeight:1.7,marginBottom:24,fontFamily:"'Cormorant Garamond',serif"},
  tagRow:{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28},
  tag:{background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:6,padding:"4px 12px",fontSize:11,color:"#4B8C6A",fontFamily:"'DM Mono',monospace"},
  statsRow:{display:"flex",gap:20,justifyContent:"center",marginBottom:32},
  stat:{textAlign:"center"},
  statN:{display:"block",fontSize:28,fontWeight:700,color:"#6EE7B7",fontFamily:"'Cormorant Garamond',serif"},
  statL:{fontSize:10,color:"#2A6B4A",fontFamily:"'DM Mono',monospace"},
  startBtn:{display:"block",margin:"0 auto",background:"#10B981",color:"#050F0A",border:"none",borderRadius:10,padding:"13px 32px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace"},
  gameWrap:{maxWidth:520,margin:"0 auto",padding:"24px 16px"},
  topBar:{display:"flex",alignItems:"center",gap:12,marginBottom:20,paddingTop:52},
  roundLbl:{fontSize:11,color:"#2A6B4A",fontFamily:"'DM Mono',monospace"},
  scoreBadge:{background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:12,padding:"2px 10px",fontSize:12,color:"#6EE7B7",fontFamily:"'DM Mono',monospace"},
  streakBadge:{background:"#3D1A00",border:"1px solid #F59E0B",borderRadius:12,padding:"2px 10px",fontSize:12,color:"#FCD34D",fontFamily:"'DM Mono',monospace"},
  timerTrack:{flex:1,height:4,background:"#0B1F14",borderRadius:2,overflow:"hidden"},
  timerFill:{height:"100%",borderRadius:2},
  timerNum:{fontSize:13,fontFamily:"'DM Mono',monospace",flexShrink:0,width:28,textAlign:"right"},
  card:{background:"#0B1F14",border:"1px solid #1A3D28",borderRadius:16,padding:28},
  conjTag:{display:"inline-block",background:"#0B3D2E",border:"1px solid #10B981",borderRadius:6,padding:"3px 10px",fontSize:10,color:"#6EE7B7",fontFamily:"'DM Mono',monospace",letterSpacing:1,marginBottom:16},
  cardPrompt:{fontSize:14,color:"#4B8C6A",marginBottom:12,fontFamily:"'Cormorant Garamond',serif"},
  verbK:{fontSize:44,color:"#E2FAF0",fontFamily:"'Noto Serif JP',serif",fontWeight:700},
  verbR:{fontSize:16,color:"#2A6B4A",fontFamily:"'DM Mono',monospace"},
  verbM:{fontSize:13,color:"#2A6B4A",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",marginBottom:16},
  opt:{padding:"13px 16px",background:"#0D2818",border:"1px solid #1A3D28",borderRadius:10,color:"#E2FAF0",fontSize:16,fontFamily:"'Noto Serif JP',serif",textAlign:"left",cursor:"pointer",transition:"all 0.15s"},
  optOk:{background:"#0B3D2E",borderColor:"#10B981",color:"#6EE7B7"},
  optBad:{background:"#3D0B0B",borderColor:"#EF4444",color:"#FCA5A5"},
  timeoutMsg:{marginTop:16,padding:"12px 14px",background:"#1A1A0B",border:"1px solid #F59E0B",borderRadius:8,fontSize:13,color:"#FCD34D",fontFamily:"'DM Mono',monospace"},
  fbGood:{marginTop:16,padding:"10px 14px",background:"#0B3D2E",border:"1px solid #10B981",borderRadius:8,fontSize:13,color:"#6EE7B7",fontFamily:"'DM Mono',monospace"},
  fbBad:{marginTop:16,padding:"10px 14px",background:"#3D0B0B",border:"1px solid #EF4444",borderRadius:8,fontSize:13,color:"#FCA5A5",fontFamily:"'DM Mono',monospace"},
  resultsWrap:{maxWidth:560,margin:"0 auto",padding:"80px 16px 40px"},
  resultRow:{background:"#0B1F14",borderRadius:8,padding:"10px 14px",display:"flex",alignItems:"center",gap:12},
  secBtn:{background:"transparent",border:"1px solid #1A3D28",borderRadius:10,color:"#6EE7B7",padding:"13px 24px",fontSize:14,cursor:"pointer",fontFamily:"'DM Mono',monospace"},
};
