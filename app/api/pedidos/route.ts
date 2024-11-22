import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

const AIRTABLE_API_URL =
  "https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos";
const AIRTABLE_API_KEY =
  "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76";

async function fetchAllRecords() {
  let allRecords: any[] = [];
  let offset: string | undefined = undefined;

  do {
    const response: { data: { records: any[]; offset?: string } } =
      await axios.get(AIRTABLE_API_URL, {
        headers: {
          Authorization: AIRTABLE_API_KEY,
        },
        params: {
          offset: offset,
          maxRecords: 999999,
        },
      });

    const data = response.data;
    allRecords = allRecords.concat(data.records);

    offset = data.offset;
  } while (offset);

  return allRecords;
}

export async function GET(req: NextApiRequest, res: NextResponse) {
  try {
    const records = await fetchAllRecords();

    // Write data to pedidos.json
    const filePath = path.join(process.cwd(), "app", "files", "pedidos.json");
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2));

    return NextResponse.json(
      { message: "Data successfully written to pedidos.json" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
