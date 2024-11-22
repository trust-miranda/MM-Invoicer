import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as XLS from "xlsjs"; // Use xlsjs instead of xlsx

export async function GET(req: NextRequest) {
  try {
    // Path to the shared folder with .xls files
    const filePath =
      "//192.168.1.1/Geral/11.PHC/Vários/PropostasMotores/AGEAS/modelogeral22_111_20241022.xls";

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Parse the file using xlsjs
    const workbook = XLS.read(fileBuffer, { type: "buffer" });

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to JSON
    const jsonData = XLS.utils.sheet_to_json(worksheet);

    // Send the JSON data to the frontend
    return NextResponse.json({ data: jsonData });
  } catch (error) {
    console.error("Error reading the .xls file:", error);
    return NextResponse.json(
      { error: "Failed to read the .xls file" },
      { status: 500 }
    );
  }
}
