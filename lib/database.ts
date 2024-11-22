import sql, { ConnectionPool, Transaction } from "mssql";

interface RossumData {
  fornecedor: string;
  estabelecimento: string;
  adoc: string;
  vat: string;
  date: string;
  duedate: string;
  ResultLinhas: {
    ref: string;
    descricao: string;
    qtt: number;
    valorunit: number;
    desconto: number;
    refint: string;
    iva: number;
    idlinha: string;
  }[];
}
// SQL Server configuration (update with your actual settings)
const sqlConfig: sql.config = {
  user: "5033",
  password: "manel123456",
  database: "PHC",
  server: "192.168.1.240",
  options: {
    encrypt: false, // Use this if you're on Azure or require encrypted connection
    trustServerCertificate: true, // Use this if you're connecting to a local dev server
  },
};

export async function insertDataIntoDatabase(data: RossumData): Promise<void> {
  let pool: ConnectionPool | null = null;
  let transaction: Transaction | null = null;

  try {
    pool = await sql.connect(sqlConfig);
    transaction = pool.transaction();
    await transaction.begin();

    // Generate unique identifiers
    const u_rocstamp = generateUUID().substring(0, 25); // You'll need to implement a UUID generator function
    const date = new Date(); // Current date and time

    // Insert into `u_ROSSUMFT` (header table)
    const insertHeaderQuery = `
        INSERT INTO u_ROSSUMFT (
          no, estab, adoc, ncont, data, pdata, u_ROSSUMFTstamp, tratada, status,
          ousrinis, ousrdata, ousrhora, usrinis, usrdata, usrhora, marcada
        ) VALUES (
          @fornecedor, @estabelecimento, @adoc, @vat, @date, @duedate,
          @u_ROSSUMFTstamp, 0, 'recebido',
          'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 
          'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 0
        )
      `;

    await transaction
      .request()
      .input("fornecedor", sql.VarChar, data.fornecedor)
      .input("estabelecimento", sql.VarChar, data.estabelecimento)
      .input("adoc", sql.VarChar, data.adoc)
      .input("vat", sql.VarChar, data.vat)
      .input("date", sql.Date, new Date(data.date))
      .input("duedate", sql.Date, new Date(data.duedate))
      .input("u_ROSSUMFTstamp", sql.VarChar, u_rocstamp)
      .query(insertHeaderQuery);

    // Insert into `u_ROSSUMFTL` (line items table)
    for (const linha of data.ResultLinhas) {
      const u_rolstamp = generateUUID().substring(0, 25);

      const insertLineQuery = `
        INSERT INTO u_ROSSUMFTL (
          ref, design, qtt, epv, desconto, iva, refint, idlinha,
          u_ROSSUMFTstamp, u_ROSSUMFTLstamp, ousrinis, ousrdata, ousrhora, 
          usrinis, usrdata, usrhora, marcada, tratada
        ) VALUES (
          @ref, @descricao, @qtt, @valorunit, @desconto, @iva, @refint, @idlinha,
          @u_ROSSUMFTstamp, @u_ROSSUMFTLstamp, 'WS', GETDATE(), 
          CONVERT(VARCHAR(8), GETDATE(), 108), 'WS', GETDATE(), 
          CONVERT(VARCHAR(8), GETDATE(), 108), 0, 0
        )
      `;

      await transaction
        .request()
        .input("ref", sql.VarChar, linha.ref)
        .input("descricao", sql.VarChar, linha.descricao)
        .input("qtt", sql.Int, linha.qtt)
        .input("valorunit", sql.Float, linha.valorunit)
        .input("desconto", sql.Float, linha.desconto)
        .input("iva", sql.Float, linha.iva)
        .input("refint", sql.VarChar, linha.refint)
        .input("idlinha", sql.VarChar, linha.idlinha)
        .input("u_ROSSUMFTstamp", sql.VarChar, u_rocstamp)
        .input("u_ROSSUMFTLstamp", sql.VarChar, u_rolstamp)
        .query(insertLineQuery);
    }

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Database error:", error);
    throw error;
  } finally {
    if (pool) {
      pool.close(); // Ensure the connection is closed
    }
  }
}

function generateUUID(): string {
  // Simple UUID generator (use more robust libraries if needed)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
