const axios = require("axios");
const fs = require("fs");
const path = require("path");

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

// Helper function to format the SOAP body with XML string interpolation
const createSoapBody = (jsonData) => `
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <RunCode xmlns="http://www.phc.pt/">
        <userName>${USERNAME}</userName>
        <password>${PASSWORD}</password>
        <code>MMInvoicerCriaFT</code>
        <parameter><![CDATA[${jsonData}]]></parameter>
      </RunCode>
    </soap:Body>
  </soap:Envelope>
`;

async function sendInvoiceToERP(invoice) {
  try {
    // Prepare JSON data and SOAP request
    const jsonData = JSON.stringify(invoice);
    const soapBody = createSoapBody(jsonData);

    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: SOAP_ACTION,
    };

    // Send the SOAP request
    const response = await axios.post(WEBSERVICE_URL, soapBody, { headers });
    console.log(
      `Invoice ID ${invoice.id} sent successfully. Response:`,
      response.data
    );
  } catch (error) {
    console.error(`Error sending invoice ID ${invoice.id}:`, error.message);
  }
}

async function main() {
  try {
    const filePath = path.join(__dirname, "motor-ageas.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const invoices = JSON.parse(fileData);

    for (const invoice of invoices) {
      await sendInvoiceToERP(invoice);
    }

    console.log("All invoices have been processed.");
  } catch (error) {
    console.error("Failed to process invoices:", error.message);
  }
}

main();
