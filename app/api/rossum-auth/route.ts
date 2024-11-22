import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authResponse = await fetch(
      "https://trust-saude.rossum.app/api/v1/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: process.env.ROSSUM_EMAIL,
          password: process.env.ROSSUM_PASSWORD,
        }).toString(),
      }
    );

    const authData = await authResponse.json();

    if (authResponse.ok) {
      return NextResponse.json({ token: authData.key });
    } else {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate with Rossum" },
      { status: 500 }
    );
  }
}
