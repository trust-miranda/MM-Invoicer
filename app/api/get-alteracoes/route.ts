import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = path.join(process.cwd(), "app/files/data.json");
  const data = await fs.readFile(filePath, "utf-8");
  const tasksObject = JSON.parse(data);

  return NextResponse.json(tasksObject);
}
