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
  database: process.env.DB_DATABASE,
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
        CAST(pc.idprocesso as varchar) as processId, 
        CAST(pc.numprocseguradora as varchar) AS insuProcessId
    FROM processoclinico pc WITH (NOLOCK)
    WHERE pc.idProcessoEstadoSinistro NOT IN (5, 7)
    AND pc.idProcessoEstadoClinico IN (2, 3)
    AND ((pc.dataAdmissao >= '2022-01-01' AND (pc.ePensionista='0' OR pc.ePensionista IS NULL OR pc.ePensionista LIKE '')) OR pc.ePensionista='1')
    AND pc.identidadeseguradora IN ('91','248','32015','32048','32202','32203','32204','32355','32381','32412','32493')
    AND pc.processoadministrativo = 0 OR pc.processoadministrativo IS NULL OR pc.processoadministrativo LIKE ''
    `);

    // Step 3: Save the result as a JSON file
    const filePath = path.resolve(
      "C:/Users/5033/Desktop/TRUST/Projetos/trust-mminvoicer/app/api/rossum-replacedataset/",
      "processes_PROD.json"
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

    const uploadResponse = await axios.patch(
      "https://trust-saude.rossum.app/svc/master-data-hub/api/v1/dataset/PROD - processes",
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
