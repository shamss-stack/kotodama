export async function onRequestGet(context) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const level = url.searchParams.get("level") || "N5";

    // Validate level
    const validLevels = ["N5", "N4", "N3", "N2", "N1"];
    if (!validLevels.includes(level)) {
      return Response.json(
        { error: "Invalid level. Must be N5, N4, N3, N2 or N1" },
        { status: 400 }
      );
    }

    // Get session from cookie
    const cookie = request.headers.get("cookie") || "";
    const sessionMatch = cookie.match(/session=([^;]+)/);
    const sessionId = sessionMatch ? sessionMatch[1] : null;

    // Check if user is allowed to access this level
    if (["N3", "N2", "N1"].includes(level)) {
      if (!sessionId) {
        return Response.json(
          { error: "Login required for N3 and above" },
          { status: 401 }
        );
      }
      const userId = await env.SESSIONS.get(sessionId);
      if (!userId) {
        return Response.json(
          { error: "Session expired. Please login again." },
          { status: 401 }
        );
      }
      const user = await env.DB.prepare(
        "SELECT tier FROM users WHERE id = ?"
      ).bind(userId).first();

      if (!user || user.tier === "free") {
        return Response.json(
          { error: "Pro subscription required for N3 and above", upgrade: true },
          { status: 403 }
        );
      }
    }

    // Fetch a random question for the level
    const question = await env.DB.prepare(
      "SELECT * FROM questions WHERE level = ? ORDER BY RANDOM() LIMIT 1"
    ).bind(level).first();

    if (!question) {
      return Response.json(
        { error: "No questions found for this level" },
        { status: 404 }
      );
    }

    // Shuffle answer options
    const distractors = question.distractors.split(",");
    const options = [question.answer, ...distractors];
    const shuffled = options.sort(() => Math.random() - 0.5);

    return Response.json({
      id: question.id,
      level: question.level,
      type: question.type,
      prompt: question.prompt,
      options: shuffled
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}