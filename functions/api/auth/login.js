import { verify } from "oslo/password";
import { generateId } from "oslo";

export async function onRequestPost(context) {
  const { request, env } = context;

  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  // Look up user
  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Verify password
  const validPassword = await verify(user.hashed_password, password);

  if (!validPassword) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Create session
  const sessionId = generateId(40);
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days

  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
  ).bind(sessionId, user.id, expiresAt).run();

  // Store in KV for fast lookups
  await env.SESSIONS.put(sessionId, user.id, {
    expiration: Math.floor(expiresAt / 1000)
  });

  // Set session cookie
  return Response.json(
    { success: true, tier: user.tier },
    {
      status: 200,
      headers: {
        "Set-Cookie": `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000`
      }
    }
  );
}