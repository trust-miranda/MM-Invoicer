import { NextRequest, NextResponse } from "next/server";

async function fetchAuthToken(): Promise<string | null> {
  try {
    const authResponse = await fetch("http://localhost:3000/api/rossum-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!authResponse.ok) {
      console.error("Failed to fetch auth token:", authResponse.statusText);
      return null;
    }

    const authData = await authResponse.json();
    return authData.token;
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = await fetchAuthToken();

  if (!token) {
    return NextResponse.json(
      { error: "Failed to retrieve authorization token" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      "https://trust-saude.rossum.app/api/v1/queues/1177502/export?status=exported&format=json",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the response status and headers for debugging
    console.log("Response Status:", response.status);
    console.log("Response Headers:", response.headers);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Rossum API error:", errorBody); // Log error body for clarity
      throw new Error(`Rossum API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Log data for verification
    console.log("Received data:", data);

    // Extract the results array from the API response
    const documents = data.results;

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to retrieve documents" },
      { status: 500 }
    );
  }
}
