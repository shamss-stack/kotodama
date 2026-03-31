export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { questionId, answer } = await request.json();

    if (!questionId || !answer) {
      return Response.json(
        { error: "questionId and answer required" },
        { status: 400 }
      );
    }

    // Get the correct answer
    const question = await env.DB.prepare(
      "SELECT * FROM questions WHERE id = ?"
    ).bind(questionId).first();

    if (!question) {
      return Response.json({ error: "Question not found" }, { status: 404 });
    }

    const correct = answer === question.answer;
    const xpEarned = correct ? 10 : 0;

    // Update progress if user is logged in
    const cookie = request.headers.get("cookie") || "";
    const sessionMatch = cookie.match(/session=([^;]+)/);
    const sessionId = sessionMatch ? sessionMatch[1] : null;

    if (sessionId) {
      const userId = await env.SESSIONS.get(sessionId);
      if (userId) {
        // Upsert progress record
        await env.DB.prepare(`
          INSERT INTO progress (id, user_id, level, xp, questions_seen, correct, last_seen)
          VALUES (?, ?, ?, ?, 1, ?, ?)
          ON CONFLICT(user_id, level) DO UPDATE SET
            xp = xp + ?,
            questions_seen = questions_seen + 1,
            correct = correct + ?,
            last_seen = ?
        `).bind(
          crypto.randomUUID(), userId, question.level,
          xpEarned, correct ? 1 : 0, Date.now(),
          xpEarned, correct ? 1 : 0, Date.now()
        ).run();
      }
    }

    return Response.json({
      correct,
      xpEarned,
      correctAnswer: question.answer,
      explanation: correct
        ? "Correct! +10 XP"
        : `Not quite. The correct answer is: ${question.answer}`
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}