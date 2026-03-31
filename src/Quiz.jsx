import { useState, useEffect } from "react";

const LEVELS = ["N5", "N4", "N3", "N2", "N1"];
const XP_PER_LEVEL = 500;

export default function Quiz() {
  const [level, setLevel] = useState("N5");
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchQuestion(); }, [level]);

  async function fetchQuestion() {
    setLoading(true);
    setSelected(null);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`/api/quiz/question?level=${level}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setQuestion(null);
      } else {
        setQuestion(data);
      }
    } catch {
      setError("Failed to load question.");
    }
    setLoading(false);
  }

  async function submitAnswer(option) {
    if (selected) return;
    setSelected(option);
    const res = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: question.id, answer: option })
    });
    const data = await res.json();
    setResult(data);
    if (data.correct) {
      setXp(prev => prev + data.xpEarned);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }

  const progress = Math.min((xp % XP_PER_LEVEL) / XP_PER_LEVEL * 100, 100);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.kanji}>言</div>
          <span style={styles.logoText}>Kotodama</span>
        </div>
        <div style={styles.stats}>
          <span style={styles.statBadge}>🔥 {streak}</span>
          <span style={styles.statBadge}>⚡ {xp} XP</span>
        </div>
      </div>

      {/* Level selector */}
      <div style={styles.levelRow}>
        {LEVELS.map(l => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            style={{ ...styles.levelBtn, ...(level === l ? styles.levelBtnActive : {}) }}
          >
            {l}
          </button>
        ))}
      </div>

      {/* XP Progress bar */}
      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <span style={styles.progressLabel}>{xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP</span>
      </div>

      {/* Quiz card */}
      <div style={styles.card}>
        {loading && <p style={styles.loading}>Loading question...</p>}

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
            {error.includes("Pro") && (
              <button style={styles.upgradeBtn}>Upgrade to Pro →</button>
            )}
          </div>
        )}

        {question && !loading && (
          <>
            <div style={styles.levelTag}>{question.level} · {question.type}</div>
            <p style={styles.prompt}>{question.prompt}</p>

            <div style={styles.options}>
              {question.options.map(option => {
                let btnStyle = { ...styles.optionBtn };
                if (selected) {
                  if (option === result?.correctAnswer) {
                    btnStyle = { ...btnStyle, ...styles.optionCorrect };
                  } else if (option === selected && !result?.correct) {
                    btnStyle = { ...btnStyle, ...styles.optionWrong };
                  } else {
                    btnStyle = { ...btnStyle, ...styles.optionDim };
                  }
                }
                return (
                  <button
                    key={option}
                    onClick={() => submitAnswer(option)}
                    style={btnStyle}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {result && (
              <div style={result.correct ? styles.feedbackCorrect : styles.feedbackWrong}>
                <p style={styles.feedbackText}>{result.explanation}</p>
                <button onClick={fetchQuestion} style={styles.nextBtn}>
                  Next question →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#050F0A", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", fontFamily: "system-ui, sans-serif" },
  header: { width: "100%", maxWidth: 520, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  kanji: { width: 36, height: 36, background: "#0B3D2E", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#6EE7B7", fontWeight: 700 },
  logoText: { fontSize: 18, fontWeight: 700, color: "#E2FAF0", letterSpacing: "-0.3px" },
  stats: { display: "flex", gap: 8 },
  statBadge: { background: "#0B1F14", border: "1px solid #1A3D28", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#6EE7B7" },
  levelRow: { display: "flex", gap: 8, marginBottom: 16, width: "100%", maxWidth: 520 },
  levelBtn: { flex: 1, padding: "8px 0", border: "1px solid #1A3D28", borderRadius: 8, background: "#0B1F14", color: "#4B8C6A", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  levelBtnActive: { background: "#0B3D2E", color: "#6EE7B7", borderColor: "#10B981" },
  progressWrap: { width: "100%", maxWidth: 520, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 },
  progressBar: { flex: 1, height: 6, background: "#0B1F14", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", background: "#10B981", borderRadius: 3, transition: "width 0.4s ease" },
  progressLabel: { fontSize: 11, color: "#4B8C6A", whiteSpace: "nowrap", fontFamily: "monospace" },
  card: { width: "100%", maxWidth: 520, background: "#0B1F14", border: "1px solid #1A3D28", borderRadius: 16, padding: 28, minHeight: 320 },
  loading: { color: "#4B8C6A", textAlign: "center", marginTop: 40 },
  errorBox: { textAlign: "center", padding: "32px 0" },
  errorText: { color: "#F87171", marginBottom: 16, fontSize: 15 },
  upgradeBtn: { background: "#10B981", color: "#050F0A", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  levelTag: { fontSize: 11, color: "#4B8C6A", fontFamily: "monospace", marginBottom: 16, letterSpacing: 1 },
  prompt: { fontSize: 22, color: "#E2FAF0", fontWeight: 600, marginBottom: 28, lineHeight: 1.4 },
  options: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: { padding: "14px 18px", border: "1px solid #1A3D28", borderRadius: 10, background: "#0D2818", color: "#E2FAF0", fontSize: 15, textAlign: "left", cursor: "pointer", transition: "all 0.15s" },
  optionCorrect: { background: "#0B3D2E", borderColor: "#10B981", color: "#6EE7B7" },
  optionWrong: { background: "#3D0B0B", borderColor: "#EF4444", color: "#FCA5A5" },
  optionDim: { opacity: 0.4 },
  feedbackCorrect: { marginTop: 20, padding: 16, background: "#0B3D2E", borderRadius: 10, border: "1px solid #10B981" },
  feedbackWrong: { marginTop: 20, padding: 16, background: "#3D0B0B", borderRadius: 10, border: "1px solid #EF4444" },
  feedbackText: { color: "#E2FAF0", fontSize: 14, marginBottom: 12 },
  nextBtn: { background: "#10B981", color: "#050F0A", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
};