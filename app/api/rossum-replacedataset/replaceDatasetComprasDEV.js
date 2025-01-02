import sql from "mssql";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE_PHC,
  options: {
    encrypt: false,
    enableArithAbort: true,
    requestTimeout: 600000,
  },
};

const fetchDataAndUpload = async () => {
  try {
    // Step 1: Authenticate and get Bearer Token
    const authResponse = await axios.post(
      "https://trust-saude.rossum.app/api/v1/auth/login",
      new URLSearchParams({
        username: process.env.ROSSUM_EMAIL,
        password: process.env.ROSSUM_PASSWORD,
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (!authResponse.data.key) {
      throw new Error("Failed to authenticate and get token.");
    }

    const bearerToken = authResponse.data.key;

    // Step 2: Query SQL Server
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request().query(`
    SELECT 
        CAST(fo.no as INT) as supplierId, 
        CAST(fo.estab as INT) as establishmentId, 
        LTRIM(RTRIM(fo.adoc)) as documentId
    FROM fo WITH (NOLOCK)
    WHERE YEAR(fo.data)>= '2022'
    `);

    // Step 3: Save the result as a JSON file
    const filePath = path.resolve(
      "C:/Users/5033/Desktop/TRUST/Projetos/trust-mminvoicer/app/api/rossum-replacedataset/",
      "compras_DEV.json"
    );

    fs.writeFileSync(
      filePath,
      JSON.stringify(result.recordset, null, 2),
      "utf-8"
    );

    console.log("Data fetched and saved to JSON file.");

    // Step 4: Upload the JSON file
    const data = new FormData();
    data.append("file", fs.createReadStream(filePath));
    data.append("encoding", "utf-8");

    const uploadResponse = await axios.put(
      "https://trust-saude.rossum.app/svc/master-data-hub/api/v1/dataset/TEST - compras",
      data,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          ...data.getHeaders(),
        },
      }
    );

    console.log("Dataset replaced successfully:", uploadResponse.data);
  } catch (error) {
    console.error("Error in process:", error.message);
  } finally {
    sql.close();
  }
};

fetchDataAndUpload();
