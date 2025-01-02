const sql = require("mssql");
const axios = require("axios");

const dbConfig = {
  server: "192.168.1.240",
  database: "TRUST_GESTAO_CLINICA_PROD",
  user: "5033",
  password: "manel123456",
  options: {
    encrypt: false,
    enableArithAbort: true,
    requestTimeout: 600000,
  },
};

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

const createSoapBody = (jsonData) => `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <RunCode xmlns="http://www.phc.pt/">
        <userName>${USERNAME}</userName>
        <password>${PASSWORD}</password>
        <code>MMInvoicerCriaNC</code>
        <parameter><![CDATA[${jsonData}]]></parameter>
      </RunCode>
    </soap:Body>
  </soap:Envelope>
`;

async function fetchAndProcessInvoices() {
  try {
    // Connect to the database
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
SELECT *
FROM notasCredito n
SELECT *
FROM notasCredito
WHERE id IN ('1D5984D3-A30E-448D-86C9-31F892D5EF96',
'53F0951E-FC42-454E-8DB7-C4072C16406B',
'1AF8BCB8-BB94-408B-A683-F3E3D564D765',
'BBE09595-B8A9-43CA-86EE-3904CEDA8053',
'38BD5A2A-812C-4CC8-A9EF-348535F73C6B',
'90A22FEE-6D45-462A-A4DC-3431D0AD4FF4',
'067AF65C-97AB-4292-A2F6-FD933847EE5F',
'141A7F50-6679-48F1-BD67-18C4BA932091',
'E3134EA3-65EE-4C6E-AD59-E6FE1241B74A',
'983E2F20-41B3-4C63-A3F3-58A013B50935',
'503F7AC2-E7A0-4C0C-AC7C-029567F53B99',
'AF5BD918-4D26-455F-956F-16CF4D98E2B3',
'75220D5E-4E99-4B6E-BA0C-F7F893C91771',
'CE95A29B-ED22-48E6-9938-7B1AE750939E',
'50AA878B-7F66-4DE9-8817-6C6D95C30849',
'3E23ACEC-BAB9-4A61-8811-5FAC5C4012E6',
'64C92928-34FD-4802-95D1-4ECDF9F61F46',
'AADE4EB6-1E4D-49F1-954B-6A8BB35FB90B',
'D9A5C43A-CB43-433E-8DAE-CAC032C61A62',
'D259E54A-29BF-4C79-B095-155D77C1D91C',
'E56C9601-F23C-4895-BDCE-3E16CDB55790',
'1CA2A6B7-CA85-493E-85FD-710643063318',
'7AE8099D-F6F3-4B04-818D-FD75402D1B59',
'01BDD0B2-BE63-45E2-BE11-A552DB27BDF0',
'D13B79DD-43E8-4D4D-8EF8-056E4B6AAD63',
'BED2A25C-F96A-4047-A4DA-76518401FBDC',
'8C65CF36-92EA-46DB-B688-24A6AA950B66',
'3565AAD9-DB38-4BCC-9D56-D73E0D05C4A1',
'FEB24608-5C14-4E70-B45A-F48FA45D7B02',
'7F8056F5-739A-4687-8549-944A35A82049',
'BE66A291-65A1-4A59-AB49-081E471A2941',
'74762F8D-8DD7-482F-A88A-BFA75A2A0339',
'9208A8A8-6131-4E3E-8AD7-9A625F3D8AC2',
'54F7F07C-ABE7-4A81-B94B-13D89F927F57',
'7B651354-3F47-458E-BD37-FCA6EEE6FF17',
'BE36F7B5-4740-4E6F-8A01-A1991C64C1C1',
'A339EE65-F36F-47C9-9E83-75625BDD33BC',
'F0F9B2F7-58E7-4C5B-8D6A-1C5F2FD26EBE',
'BD2C2439-E086-47F7-8516-F141F28ECB8C',
'A2ADA478-8F7A-419E-8E80-D852D9F38593',
'32AD283B-5330-4A53-9A11-F1F8AF76217E',
'DFD3436C-3FCE-4E4B-9FD9-890DF5825B57',
'FBFF75CB-C2B6-4199-8688-08489BB1EE7D',
'61D85389-3BF7-411B-92EF-7F117EFD04D0')
    `);

    // Process the result
    const groupedResult = result.recordset.reduce((acc, row) => {
      const id = row.id ? row.id : "";
      if (!acc[id]) {
        acc[id] = {
          id: row.id || "",
          identidade: row.identidade ? parseInt(row.identidade, 10) : null,
          nomesinistrado: row.nomesinistrado || "",
          idprocesso: row.idprocesso || "",
          numapolice: row.numapolice || "",
          numprocseguradora: row.numprocseguradora || "",
          ResultLinhas: [],
          idLinhaCounter: 1,
        };
      }

      acc[id].ResultLinhas.push({
        idlinha: acc[id].idLinhaCounter,
        ref: row.ref || "",
        descricao: row.descricao || "",
        qtt: row.qtt || 0,
        valorunit: parseFloat(row.valorunit) || 0,
        idrequisicao: row.idrequisicao || "",
        idrequisicaoactomedico: row.idrequisicaoactomedico || "",
        datafinal: row.datafinal || "1723849200",
        dataopen: row.dataopen || "1718665200",
        texto: row.texto || "nao",
        fistamp: row.fistamp || "",
      });

      acc[id].idLinhaCounter += 1;
      return acc;
    }, {});

    const formattedResult = Object.values(groupedResult).map(
      ({ idLinhaCounter, ...rest }) => rest
    );

    // Send the data to the ERP API
    const responses = [];
    for (const invoiceDetails of formattedResult) {
      const jsonData = JSON.stringify({
        ...invoiceDetails,
        ResultLinhas: invoiceDetails.ResultLinhas.map((line) => ({
          ...line,
        })),
      });

      const soapBody = createSoapBody(jsonData);
      const headers = {
        "Content-Type": "text/xml; charset=utf-8",
        "Content-Length": Buffer.byteLength(soapBody),
        SOAPAction: SOAP_ACTION,
      };

      try {
        const response = await axios.post(WEBSERVICE_URL, soapBody, {
          headers,
        });
        console.log(
          `SOAP request for invoice ${invoiceDetails.id} sent successfully. Response:`,
          response.data
        );
      } catch (err) {
        console.error(
          `Error sending SOAP request for invoice ${invoiceDetails.id}:`,
          err.message
        );
      }
    }
  } catch (error) {
    console.error("Database query error:", error);
  } finally {
    sql.close(); // Close the database connection
  }
}

// Execute the function
fetchAndProcessInvoices();
