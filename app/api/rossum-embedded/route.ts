import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, annotationId } = await req.json();

    // Log the received values for debugging
    console.log("Received token:", token);
    console.log("Received annotationId:", annotationId);

    // Check if either token or annotationId is missing
    if (!token || !annotationId) {
      console.error("Missing token or annotation ID");
      return NextResponse.json(
        { error: "Missing token or annotation ID" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://trust-saude.rossum.app/api/v1/annotations/${annotationId}/start_embedded`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: "https://service.com/return",
          cancel_url: "https://service.com/cancel",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Rossum API error:", response.statusText);
      return NextResponse.json(
        { error: `Rossum API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Return the embedded URL
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to fetch embedded URL" },
      { status: 500 }
    );
  }
}
