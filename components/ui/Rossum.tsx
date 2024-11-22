"use client";
import { useEffect, useState } from "react";
import axios from "axios";

// Define a type for the Queue object
type Queue = {
  id: string;
  name: string;
};

// This component lists all queues and allows the user to select one
function RossumData({
  onSelectQueue,
}: {
  onSelectQueue: (queueId: string | null) => void;
}) {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const response = await axios.get(
          `https://trust-saude.rossum.app/api/v1/queues/`,
          {
            headers: {
              Authorization: `token 4e2dcd27eeeb9d91445ccfcaea0ed1b14268d8d9`,
              "Content-Type": "application/json",
            },
          }
        );
        setQueues(response.data.results);
      } catch (error) {
        console.error("Error fetching Rossum queues:", error);
        setError("Failed to load queues");
      }
    };

    fetchQueues();
  }, []);

  return (
    <div>
      <h1>Rossum Queues</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {queues.map((queue) => (
          <li key={queue.id} onClick={() => onSelectQueue(queue.id)}>
            <h3>{queue.name}</h3>
            <p>Queue ID: {queue.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// This component displays the details of a selected queue
function RossumQueue({ queueId }: { queueId: string | null }) {
  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!queueId) return;

    const fetchSpecificQueue = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_ROSSUM_API_DOMAIN}/api/v1/queues/${queueId}/`, // Fetch the specific queue by ID
          {
            headers: {
              Authorization: `token ${process.env.NEXT_PUBLIC_ROSSUM_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        setQueue(response.data);
      } catch (error) {
        console.error("Error fetching specific Rossum queue:", error);
        setError("Failed to load queue details");
      }
    };

    fetchSpecificQueue();
  }, [queueId]);

  return (
    <div>
      <h1>Selected Rossum Queue</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {queue ? (
        <div>
          <h3>Queue Name: {queue.name}</h3>
          <p>Queue ID: {queue.id}</p>
        </div>
      ) : (
        <p>Select a queue from the list.</p>
      )}
    </div>
  );
}

// Main component that holds both RossumData and RossumQueue
export default function RossumAPI() {
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);

  return (
    <div>
      <RossumData onSelectQueue={setSelectedQueueId} />
      <RossumQueue queueId={selectedQueueId} />
    </div>
  );
}
