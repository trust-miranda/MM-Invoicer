import { NextApiRequest, NextApiResponse } from "next";
import sql from "mssql";
import fs from "fs";
import path from "path";

const config = {
  server: "192.168.1.240",
  database: "TRUST_GESTAO_CLINICA_PROD",
  user: "5033",
  password: "manel123456",
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("API route hit");
  if (req.method === "GET") {
    try {
      console.log("Handling GET request");
      // Connect to the database
      const pool = await sql.connect(config);

      // Change the database context
      await pool.request().query("USE PHC");

      // Query the database
      const result = await pool
        .request()
        .query(
          "SELECT ft.fno, cast(ft.fdata as date) as Fdata, ft.nome2, ft.u_sinistro as idProcesso, ft.etotal from ft, fi where fi.ftstamp=ft.ftstamp and ft.no IN (9,12,325,111,252,1413,3792) and ft.tipodoc in (1,3) and ft.ndoc <> 76 and ft.anulado=0 and fi.ref>'' and ft.fdata between GETDATE()-3 and GETDATE() order by ft.fdata desc"
        );

      // Save the result to a JSON file
      const filePath = path.join(process.cwd(), "data.json");
      fs.writeFileSync(filePath, JSON.stringify(result.recordset, null, 2));

      // Send the result as JSON
      res.status(200).json(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error connecting to database");
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
