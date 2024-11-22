import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

// Helper function to simulate session token generation
function generateSessionToken(): string {
  return "your_session_token"; // Replace with actual session token logic
}

export async function POST(req: NextRequest) {
  // Generate a session token (replace with your authentication logic)
  const sessionToken = generateSessionToken();

  // Set the session cookie with SameSite=None and Secure attributes
  const cookie = serialize("session_id", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    sameSite: "None", // Allows cookie in an iframe
    path: "/",
  });

  // Set the cookie in the response headers
  const response = NextResponse.json({ message: "Session created" });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
