import { Itinerary, itinerarySchema } from "@/lib/itinerary-schema";
import { useCallback, useState } from "react";

export function useItinerary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary>();

  const generateItinerary = useCallback(
    async ({
      destination,
      lengthOfStay,
    }: {
      destination: string;
      lengthOfStay: string;
    }) => {
      setItinerary(undefined);
      setIsGenerating(true);

      try {
        const response = await fetch("/api/stream-objects", {
          method: "POST",
          body: JSON.stringify({ destination, lengthOfStay }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let partialObject = {};

        while (true) {
          const { done, value } = await reader?.read()!;
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const parsedChunk = JSON.parse(chunk);

          // Validate and merge the partial object
          try {
            const result = itinerarySchema.safeParse(parsedChunk);
            if (result.success) {
              partialObject = { ...partialObject, ...result.data };
              setItinerary(partialObject as Itinerary);
            } else {
              console.error("Validation failed:", result.error);
            }
          } catch (error) {
            console.error("Validation failed:", error);
          }
        }
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    isGeneratingItinerary: isGenerating,
    generateItinerary,
    itinerary,
  };
}
