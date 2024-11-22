import { itinerarySchema } from "@/lib/itinerary-schema";
import {
  ObjectStreamResponse,
  jsonObjectPrompt,
  openai,
  streamObject,
} from "modelfusion";

export const runtime = "edge";

export async function POST(req: Request) {
  const { destination, lengthOfStay } = await req.json();

  const objectStream = await streamObject({
    model: openai
      .ChatTextGenerator({
        model: "gpt-4-1106-preview",
        maxGenerationTokens: 2500,
      })
      .asObjectGenerationModel(jsonObjectPrompt.instruction()),

    schema: itinerarySchema,

    prompt: {
      system:
        `You help planning travel itineraries. ` +
        `Respond to the users' request with a list ` +
        `of the best stops to make in their destination.` +
        `Your answers must always be given in European Portuguese language (PT-PT) and you cant use by any means brazilian portuguese expressions or sentences.`,
      instruction:
        `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
        `Please suggest the best tourist activities for me to do.`,
    },
  });

  return new ObjectStreamResponse(objectStream);
}
