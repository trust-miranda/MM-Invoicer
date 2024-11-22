import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const rossumResponse = await fetch(
      "https://trust-saude.rossum.app/api/v1/annotations/3469501/start_embedded",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer cc30f9e6338f6388ebff2ff6fde1c7600a3421ba",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: "https://service.com/return",
          cancel_url: "https://service.com/cancel",
        }),
      }
    );

    // Parse the response from Rossum
    const data = await rossumResponse.json();

    // Send back the data in a JSON response to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching embedded URL:", error);
    return NextResponse.json(
      { error: "Error fetching embedded URL" },
      { status: 500 }
    );
  }
}
