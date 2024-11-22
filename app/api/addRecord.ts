import axios from "axios";
import fs from "fs";
import path from "path";

import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextResponse) {
  try {
    const formData = req.body;

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos",
      headers: {
        Authorization:
          "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ fields: formData }),
    };

    const response = await axios.request(config);
    const data = response.data;

    const dataPath = path.join(process.cwd(), "app/files/pedidos.json");
    const fileData = await fs.promises.readFile(dataPath);
    const tasksObject = JSON.parse(fileData.toString());
    tasksObject.records.push(data);
    await fs.promises.writeFile(dataPath, JSON.stringify(tasksObject, null, 2));

    return NextResponse.json({ message: "Record added successfully", data });
  } catch (error) {
    console.error("Error adding record:", error);
    return NextResponse.json(
      { error: "Failed to add record" },
      { status: 500 }
    );
  }
}
