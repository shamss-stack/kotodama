import { Lucia } from "lucia";
import { D1Adapter } from "@lucia-auth/adapter-d1";
import { hash } from "oslo/password";
import { generateId } from "oslo";

export async function onRequestPost(context) {
  const { request, env } = context;

  const { email, password } = await request.json();

  // Basic validation
  if (!email || !password || password.length < 8) {
    return Response.json(
      { error: "Valid email and password (8+ chars) required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existing = await env.DB.prepare(
    "SELECT id FROM users WHERE email = ?"
  ).bind(email).first();

  if (existing) {
    return Response.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  // Hash password and create user
  const hashedPassword = await hash(password);
  const userId = generateId(15);
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO users (id, email, hashed_password, tier, created_at) VALUES (?, ?, ?, 'free', ?)"
  ).bind(userId, email, hashedPassword, now).run();

  return Response.json({ success: true, userId }, { status: 201 });
}