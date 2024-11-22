"use client";
import { TextGenerateEffect } from "../ui/text-generate-effect";

const words = `Gestão Integrada de Saúde
`;

export function AnimatedText() {
  return <TextGenerateEffect duration={2} filter={false} words={words} />;
}
