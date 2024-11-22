// /pages/api/run-automatic-invoices.js
import { exec } from "child_process";

export default function handler(req, res) {
  if (req.method === "POST") {
    exec(
      "node ./faturacao-automatica/automaticInvoices.js",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing script: ${error.message}`);
          return res.status(500).json({ error: "Error executing script" });
        }
        if (stderr) {
          console.error(`Script error output: ${stderr}`);
          return res.status(500).json({ error: "Script execution error" });
        }
        console.log(`Script output: ${stdout}`);
        res
          .status(200)
          .json({ message: "Script executed successfully", output: stdout });
      }
    );
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
