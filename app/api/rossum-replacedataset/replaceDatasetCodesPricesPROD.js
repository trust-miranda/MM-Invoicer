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
WITH
    FirstQuery
    AS
    (
        SELECT
            bo.u_nentdest AS insuranceCompanyId,
            bo.no AS supplierId,
            bo.estab AS establishmentId,
            bi.ref AS code,
            bi.design AS description,
            bi.edebito AS unitPrice
        FROM bo WITH (NOLOCK)
            LEFT JOIN bi WITH (NOLOCK) ON bo.bostamp = bi.bostamp
            LEFT JOIN fl WITH (NOLOCK) ON bo.no = fl.no AND bo.estab = fl.estab
        WHERE bo.ndos = '19'
            AND bo.datafinal >= GETDATE()
            AND fl.tipo = 'Prestador de Rede'
    ),
    SecondQuery
    AS
    (
        SELECT
            sc.refb,
            st.ref AS code,
            st.design AS description
        FROM st
            LEFT JOIN sc WITH (NOLOCK) ON st.ref = sc.ref
        WHERE st.ref IN (
        -- Add all the target codes for replacement
    ('60.03.00.80'),
    ('60.03.00.40'),
    ('60.03.00.31'),
    ('60.03.00.42'),
    ('60.03.00.58'),
    ('60.03.00.33'),
    ('60.03.00.17'),
    ('60.03.00.72'),
    ('60.03.00.49'),
    ('60.03.00.23'),
    ('60.03.00.41'),
    ('60.03.00.06'),
    ('60.01.00.02'),
    ('60.03.00.71'),
    ('60.03.00.12'),
    ('60.03.00.16'),
    ('60.03.00.22'),
    ('60.03.00.02'),
    ('60.03.00.03'),
    ('60.01.00.01'),
    ('62.00.00.25'),
    ('62.00.00.29'),
    ('62.00.00.56'),
    ('62.00.00.54'),
    ('62.00.00.67'),
    ('62.00.00.65'),
    ('62.00.00.52'),
    ('62.00.00.63'),
    ('62.00.00.50'),
    ('62.00.00.10'),
    ('62.00.00.11'),
    ('62.00.00.40'),
    ('62.00.00.61'),
    ('62.00.00.45'),
    ('62.00.00.01'),
    ('62.00.00.18'),
    ('62.00.00.38'),
    ('62.00.00.14'),
    ('62.00.00.16'),
    ('64.00.00.56'),
    ('64.00.00.47'),
    ('64.00.00.37'),
    ('64.00.00.35'),
    ('64.00.00.33'),
    ('64.00.00.62'),
    ('64.00.00.46'),
    ('64.00.00.18'),
    ('64.00.00.28'),
    ('64.00.00.25'),
    ('64.00.00.19'),
    ('64.00.00.01'),
    ('64.00.00.29'),
    ('64.00.00.21'),
    ('64.00.00.13'),
    ('64.00.00.58'),
    ('64.00.00.02'),
    ('64.00.00.23'),
    ('64.00.00.08'),
    ('64.00.00.34'),
    ('65.00.00.46'),
    ('65.00.00.49'),
    ('65.00.00.56'),
    ('65.00.00.38'),
    ('65.00.00.06'),
    ('65.00.00.54'),
    ('65.00.00.48'),
    ('65.00.00.04'),
    ('65.00.00.52'),
    ('65.00.00.40'),
    ('65.00.00.05'),
    ('65.00.00.20'),
    ('65.00.00.28'),
    ('65.00.00.53'),
    ('65.00.00.41'),
    ('65.00.00.33'),
    ('65.00.00.01'),
    ('65.00.00.19'),
    ('65.00.00.29'),
    ('65.00.00.34'),
    ('70.10.00.09'),
('72.02.00.32'),
('72.02.00.54'),
('75.05.00.17'),
('72.01.00.13'),
('70.22.00.06'),
('70.22.00.01'),
('75.04.00.34'),
('75.02.00.34'),
('75.04.00.72'),
('75.04.00.13'),
('72.04.00.49'),
('72.04.00.50'),
('75.04.00.07'),
('72.04.00.59'),
('74.01.00.13'),
('75.04.00.04'),
('72.10.00.19'),
('70.13.00.02'),
('72.04.00.25'),
('70.10.00.10'),
('74.01.00.21'),
('72.04.00.17'),
('72.09.00.05'),
('74.01.00.47'),
('75.04.00.01'),
('75.04.01.03'),
('72.04.00.51'),
('72.05.00.13'),
('72.02.00.11'),
('72.05.00.12'),
('76.00.00.21'),
('74.01.00.44'),
('75.04.00.06'),
('73.01.01.10'),
('75.04.00.05'),
('74.01.00.02'),
('75.04.00.71'),
('72.05.00.03'),
('70.10.00.12'),
('75.04.00.87')        
    )
    ),
    ThirdQuery
    AS
    (
        SELECT
            bo.u_nentdest AS insuranceCompanyId,
            bo.no AS supplierId,
            bo.estab AS establishmentId,
            CASE
            WHEN bi.ref='29.00.01.00.' THEN '29.00.01.12'
            END AS code,
            bi.design AS description,
            bi.edebito AS unitPrice
        FROM bo WITH (NOLOCK)
            LEFT JOIN bi WITH (NOLOCK) ON bo.bostamp = bi.bostamp
            LEFT JOIN fl WITH (NOLOCK) ON bo.no = fl.no AND bo.estab = fl.estab
        WHERE bo.ndos = '19'
            AND bo.datafinal >= GETDATE()
            AND fl.tipo = 'Prestador de Rede'
            AND bi.ref='29.00.01.00.'
    ),
    ReplacementRows
    AS
    (
        SELECT
            f.insuranceCompanyId,
            f.supplierId,
            f.establishmentId,
            s.code, -- New code from SecondQuery
            s.description, -- New description from SecondQuery
            f.unitPrice
        -- Keep original unitPrice
        FROM FirstQuery f
            INNER JOIN SecondQuery s ON f.code = s.refb
    )

    SELECT
        insuranceCompanyId,
        supplierId,
        establishmentId,
        LTRIM(RTRIM(code)) as code,
        LTRIM(RTRIM(description)) as description,
        CAST(unitPrice as varchar) as unitPrice
    FROM FirstQuery

UNION ALL

    SELECT
        insuranceCompanyId,
        supplierId,
        establishmentId,
        LTRIM(RTRIM(code)) as code,
        LTRIM(RTRIM(description)) as description,
        CAST(unitPrice as varchar) as unitPrice
    FROM ReplacementRows

UNION ALL

    SELECT
        insuranceCompanyId,
        supplierId,
        establishmentId,
        LTRIM(RTRIM(code)) as code,
        LTRIM(RTRIM(description)) as description,
        CAST(unitPrice as varchar) as unitPrice
    FROM ThirdQuery

ORDER BY supplierId, establishmentId, insuranceCompanyId, code;


    `);

    // Step 3: Save the result as a JSON file
    const filePath = path.resolve(
      "C:/Users/5033/Desktop/TRUST/Projetos/trust-mminvoicer/app/api/rossum-replacedataset/",
      "codes_prices_PROD.json"
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
      "https://trust-saude.rossum.app/svc/master-data-hub/api/v1/dataset/PROD - codes_prices",
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
