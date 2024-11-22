import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import sql from "mssql";
import axios from "axios";

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
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    requestTimeout: 9000000,
  },
};

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

const createSoapBody = (jsonData: RossumData) => `
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <RunCode xmlns="http://www.phc.pt/">
        <userName>${USERNAME}</userName>
        <password>${PASSWORD}</password>
          <code>CriaCIR</code>
        <parameter><![CDATA[${jsonData}]]></parameter>
        </RunCode>
      </soap:Body>
    </soap:Envelope>`;

export async function POST(req: Request) {
  let transaction;
  try {
    // Parse and validate incoming data
    const jsonData: RossumData = await req.json();

    if (
      !jsonData.fornecedor ||
      !jsonData.estabelecimento ||
      !jsonData.adoc ||
      !jsonData.vat ||
      !jsonData.date ||
      !jsonData.duedate ||
      !Array.isArray(jsonData.ResultLinhas)
    ) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Connect to the SQL Server database
    const pool = await sql.connect(sqlConfig);
    transaction = pool.transaction();
    await transaction.begin();

    // Insert header record
    const u_rocstamp = uuidv4().substring(0, 25);
    const insertHeaderQuery = `INSERT INTO u_ROSSUMFT (no, estab, adoc, ncont, data, pdata, u_ROSSUMFTstamp, tratada, status,
      ousrinis, ousrdata, ousrhora, usrinis, usrdata, usrhora, marcada)
      VALUES (@fornecedor, @estabelecimento, @adoc, @vat, @date, @duedate, @u_rocstamp, 0, 'recebido',
      'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 0)`;
    await transaction
      .request()
      .input("fornecedor", sql.VarChar, jsonData.fornecedor)
      .input("estabelecimento", sql.VarChar, jsonData.estabelecimento)
      .input("adoc", sql.VarChar, jsonData.adoc)
      .input("vat", sql.VarChar, jsonData.vat)
      .input("date", sql.Date, new Date(jsonData.date))
      .input("duedate", sql.Date, new Date(jsonData.duedate))
      .input("u_rocstamp", sql.VarChar, u_rocstamp)
      .query(insertHeaderQuery);

    // Insert line records
    for (const linha of jsonData.ResultLinhas) {
      const u_rolstamp = uuidv4().substring(0, 25);
      const insertLineQuery = `INSERT INTO u_ROSSUMFTL (ref, design, qtt, epv, desconto, refint, iva, idlinha,
        u_ROSSUMFTstamp, u_ROSSUMFTLstamp, ousrinis, ousrdata, ousrhora, usrinis, usrdata, usrhora, marcada, tratada)
        VALUES (@ref, @descricao, @qtt, @valorunit, @desconto, @refint, @iva, @idlinha,
        @u_rocstamp, @u_rolstamp, 'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 
        'WS', GETDATE(), CONVERT(VARCHAR(8), GETDATE(), 108), 0, 0)`;
      await transaction
        .request()
        .input("ref", sql.VarChar, linha.ref)
        .input("descricao", sql.VarChar, linha.descricao)
        .input("qtt", sql.Int, linha.qtt)
        .input("valorunit", sql.Float, linha.valorunit)
        .input("desconto", sql.Float, linha.desconto || 0)
        .input("refint", sql.VarChar, linha.refint)
        .input("iva", sql.Float, linha.iva || 0)
        .input("idlinha", sql.VarChar, linha.idlinha)
        .input("u_rocstamp", sql.VarChar, u_rocstamp)
        .input("u_rolstamp", sql.VarChar, u_rolstamp)
        .query(insertLineQuery);
    }

    // Commit the transaction
    await transaction.commit();

    // Generate SOAP request body using createSoapBody
    const soapBody = createSoapBody(jsonData);

    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      "Content-Length": soapBody.length.toString(),
      SOAPAction: SOAP_ACTION,
    };

    // Log generated SOAP body for debugging
    console.log("Generated SOAP Request Body:", soapBody);

    // Send the SOAP request using axios
    const response = await axios.post(WEBSERVICE_URL, soapBody, {
      headers,
    });
    console.log(`SOAP request sent successfully. Response:`, response.data);
  } catch (error) {
    // Rollback transaction on error
    if (transaction && transaction.isActive) {
      await transaction.rollback();
    }
    console.error("Database error: ", error);
    return NextResponse.json(
      { status: "erro", message: "Database error: " + error.message },
      { status: 500 }
    );
  }
}
