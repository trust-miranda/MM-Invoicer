import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { annotationId } = req.query;

  try {
    const response = await fetch(
      `https://trust-saude.rossum.app/api/v1/annotations/${annotationId}/create_embedded_url`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ROSSUM_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: "https://trust-saude.rossum.app.com/return",
          cancel_url: "https://trust-saude.rossum.app.com/cancel",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate embedded URL");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
