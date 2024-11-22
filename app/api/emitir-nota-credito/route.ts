import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleValidationAndInsertInvoice } from "./dbService"; // Import the database utility function
import { parseStringPromise } from "xml2js"; // Use xml2js library to parse XML responses

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

interface InvoiceDetails {
  id: string;
  identidade: number;
  nomesinistrado: string;
  idprocesso: string;
  numapolice: string;
  numprocseguradora: string;
  ResultLinhas: Array<{
    idlinha: number;
    ref: string;
    descricao: string;
    qtt: number;
    valorunit: number;
    idrequisicao: string;
    bistamp: string;
    u_facturatmpstamp: string;
    datafinal: number;
    dataopen: number;
    idavenca?: string | null;
  }>;
}

const createSoapBody = (jsonData: string) => `
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

export async function POST(req: NextRequest) {
  try {
    const { invoiceDetails } = (await req.json()) as {
      invoiceDetails: InvoiceDetails;
    };

    if (!invoiceDetails) {
      return NextResponse.json(
        { error: "Missing JSON data for SOAP request." },
        { status: 400 }
      );
    }

    // Prepare JSON structure for SOAP parameter
    const jsonData = JSON.stringify({
      ...invoiceDetails,
      ResultLinhas: invoiceDetails.ResultLinhas.map((line) => ({
        ...line,
      })),
    });
    console.log("Preparing to send JSON data for SOAP request:", jsonData);

    // Generate SOAP Body
    const soapBody = createSoapBody(jsonData);
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: SOAP_ACTION,
    };

    // Send the SOAP request
    const response = await axios.post(WEBSERVICE_URL, soapBody, { headers });

    // Parse the SOAP response XML
    const parsedResponse = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract the result data
    const runCodeResult =
      parsedResponse["soap:Envelope"]["soap:Body"]["RunCodeResponse"][
        "RunCodeResult"
      ];

    // Attempt to parse runCodeResult as JSON if expected
    let responseObjectArray;
    try {
      responseObjectArray = JSON.parse(runCodeResult);
    } catch (e) {
      console.error("Failed to parse RunCodeResult as JSON:", runCodeResult);
      throw new Error("Unexpected response format, failed to parse JSON.");
    }

    // Ensure responseObjectArray is an array
    if (!Array.isArray(responseObjectArray)) {
      throw new Error("Unexpected response format. Expected an array.");
    }

    // Process each ResultLinhas item with the corresponding responseObject data
    const rowsInserted = await Promise.all(
      invoiceDetails.ResultLinhas.map(async (line, index) => {
        // Ensure there's a corresponding object in the response array
        const responseObject = responseObjectArray[index] || {};

        // Extract values for insertion
        const dbInvoiceDetails = {
          chave: invoiceDetails.id,
          ftstamp: responseObject.ftstamp || "",
          fistamp: responseObject.fistamp || "",
          dataFatura: new Date().toISOString(),
          nrFatura: responseObject.fno || 0,
          idProcesso: invoiceDetails.idprocesso,
          nrCliente: invoiceDetails.identidade,
          cliente: invoiceDetails.nomesinistrado,
          ref: line.ref,
          descricao: line.descricao,
          qtt: line.qtt,
          valorUnit: line.valorunit,
          idRequisicao: line.idrequisicao,
          bistamp: line.bistamp || "",
          u_facturatmpstamp: line.u_facturatmpstamp || "",
          estado: "Aprovada",
        };

        return handleValidationAndInsertInvoice(dbInvoiceDetails);
      })
    );

    const totalRowsInserted = rowsInserted.reduce((sum, rows) => sum + rows, 0);
    console.log(
      `Successfully inserted ${totalRowsInserted} row(s) into the database.`
    );

    return NextResponse.json({
      message: "SOAP request sent successfully",
      data: response.data,
    });
    console.log("Response:", response.data);
  } catch (error: any) {
    console.error(
      "Error sending SOAP request or updating the database:",
      error.message
    );
    return NextResponse.json(
      {
        error: "Failed to send SOAP request or update the database",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
