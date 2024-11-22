"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RossumQueueEmbed() {
  const [token, setToken] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Authenticate and get token
  const authenticate = async () => {
    try {
      const response = await fetch("/api/rossum-auth", { method: "POST" });
      const data = await response.json();
      if (response.ok) setToken(data.token);
      else setError(data.error || "Failed to authenticate");
    } catch (err) {
      setError("Error during authentication");
    }
  };

  // Step 2: Fetch documents in the queue (using updated handling for 'results')
  const fetchDocuments = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/rossum-documents", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      // Check if the data structure matches what we expect
      if (response.ok && Array.isArray(data)) {
        setDocuments(data); // Directly set the documents if data is an array
      } else if (data.results && Array.isArray(data.results)) {
        setDocuments(data.results); // Set documents if they are in the 'results' key
      } else {
        setError("Unexpected data structure from server");
      }
    } catch (err) {
      setError("Error fetching documents");
    }
  }, [token]);

  // Step 3: Fetch embedded URL for a specific document
  const fetchEmbeddedUrl = async (annotationId: string) => {
    if (!token) return;

    try {
      const response = await fetch("/api/rossum-embedded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, annotationId }),
      });

      const data = await response.json();
      if (response.ok && data.url) setEmbeddedUrl(data.url);
      else setError(data.error || "Failed to fetch embedded URL");
    } catch (err) {
      setError("Error fetching embedded URL");
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  useEffect(() => {
    if (token) fetchDocuments();
  }, [token, fetchDocuments]);

  return (
    <div>
      <Card className=" h-screen bg-white ">
        <CardHeader>
          <h1>Faturas Por Validar no Rossum</h1>
        </CardHeader>
        <CardContent className="flex h-full flex-col space-y-4">
          {error && <p>Error: {error}</p>}
          <ul>
            {Array.isArray(documents) && documents.length > 0 ? (
              documents.map((doc) => (
                <li key={doc.url}>
                  {doc.document && doc.document.name
                    ? doc.document.name
                    : "Document"}{" "}
                  <button
                    onClick={() => fetchEmbeddedUrl(doc.url.split("/").pop())}
                  >
                    Embed
                  </button>
                </li>
              ))
            ) : (
              <p>No documents available</p>
            )}
          </ul>

          {embeddedUrl && (
            <iframe
              src={embeddedUrl}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Rossum Embedded Document"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
