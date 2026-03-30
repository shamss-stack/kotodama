export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { email, password } = await request.json();

    if (!email || !password || password.length < 8) {
      return Response.json(
        { error: "Valid email and password (8+ chars) required" },
        { status: 400 }
      );
    }

    const existing = await env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).bind(email).first();

    if (existing) {
      return Response.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password using native Web Crypto
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      "raw", encoder.encode(password),
      "PBKDF2", false, ["deriveBits"]
    );
    const hashBuffer = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial, 256
    );
    const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2,'0')).join('');
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
    const hashedPassword = `${saltHex}:${hashHex}`;

    // Generate user ID
    const userId = crypto.randomUUID();
    const now = Date.now();

    await env.DB.prepare(
      "INSERT INTO users (id, email, hashed_password, tier, created_at) VALUES (?, ?, ?, 'free', ?)"
    ).bind(userId, email, hashedPassword, now).run();

    return Response.json({ success: true, userId }, { status: 201 });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}