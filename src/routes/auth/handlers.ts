import { Context } from "hono";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { generateState, generateCodeVerifier } from "arctic";
import {
  createGoogle,
  createSession,
  generateSessionToken,
} from "@/service/auth";
import { OAuth2RequestError } from "arctic";
import { getDbClient } from "@/db";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCookie, setCookie } from "hono/cookie";

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

export async function handleGoogleLogin(c: Context) {
  const { env } = getRequestContext();
  const google = createGoogle(env);
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "profile",
    "email",
  ]);

  const authKV = env.HABITKU_AUTH_KV;
  await authKV.put(
    `oauth_state:${state}`,
    JSON.stringify({
      codeVerifier,
    }),
    { expirationTtl: 600 },
  );

  return c.json({
    status: "success",
    url: url.toString(),
  });
}

export async function handleGoogleCallback(c: Context) {
  const { env } = getRequestContext();
  const google = createGoogle(env);
  const code = c.req.query("code");
  const state = c.req.query("state");

  console.log("Received callback with:", { code, state });

  if (!code || !state) {
    console.error("Missing code or state", { code, state });
    return c.text("Invalid request: Missing code or state", 400);
  }

  const authKV = env.HABITKU_AUTH_KV;

  const storedData = await authKV.get(`oauth_state:${state}`);
  if (!storedData) {
    console.error("No stored data found for state", state);
    return c.text("Invalid or expired state", 400);
  }

  console.log("Retrieved stored data:", storedData);

  let codeVerifier;
  try {
    const parsed = JSON.parse(storedData);
    codeVerifier = parsed.codeVerifier;
    if (!codeVerifier) {
      throw new Error("codeVerifier is undefined");
    }
  } catch (error) {
    console.error("Failed to parse stored data or missing codeVerifier", error);
    return c.text("Invalid stored data", 500);
  }

  await authKV.delete(`oauth_state:${state}`);

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    console.log("Received tokens:", tokens);

    const accessToken = tokens.accessToken();
    console.log("Access Token:", accessToken);

    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    let googleUser: GoogleUserInfo;
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      googleUser = await response.json();
      console.log("Fetched Google user info:", googleUser);
    } catch (fetchError) {
      console.error("Error fetching Google user info:", fetchError);
      return c.json(
        { status: "error", message: "Failed to fetch user info from Google" },
        500,
      );
    }

    console.log("Fetched Google user info:", googleUser);

    const db = getDbClient();

    const existingUser = await db.query.userTable.findFirst({
      where: eq(userTable.googleId, googleUser.id),
    });

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      userId = crypto.randomUUID();
      await db.insert(userTable).values({
        id: userId,
        googleId: googleUser.id,
        email: googleUser.email,
        emailVerified: googleUser.verified_email,
        name: googleUser.name,
        profileImageUrl: googleUser.picture,
      });
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(c, sessionToken, userId);

    // Store session in KV
    await authKV.put(
      `session:${session.id}`,
      JSON.stringify({
        userId,
        expiresAt: session.expiresAt,
        fresh: true,
      }),
      {
        expirationTtl: Math.floor(
          (session.expiresAt.getTime() - Date.now()) / 1000,
        ),
      },
    );

    setCookie(c, "session", session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      expires: session.expiresAt,
      domain: new URL(env.CLIENT_REDIRECT_URL).hostname,
    });

    // Redirect to client
    return c.redirect(env.CLIENT_REDIRECT_URL);
  } catch (e) {
    console.error("Error in Google callback:", e);
    if (e instanceof OAuth2RequestError) {
      return c.json({ status: "error", message: "Invalid code" }, 400);
    }
    return c.json(
      { status: "error", message: "An unknown error occurred" },
      500,
    );
  }
}

export async function handleLogout(c: Context) {
  const { env } = getRequestContext();
  const sessionId = getCookie(c, "session");

  if (sessionId) {
    // Delete session from KV
    await env.HABITKU_AUTH_KV.delete(`session:${sessionId}`);

    // Clear cookie
    setCookie(c, "session", "", {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      path: "/",
      expires: new Date(0),
      domain: new URL(env.CLIENT_REDIRECT_URL).hostname,
    });
  }

  return c.json({ status: "success" });
}
