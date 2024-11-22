import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

// Define type for invoice details
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
    idrequisicaoactomedico: string; // Mandatory
    datafinal: number;
    dataopen: number;
    texto: string;
    idavenca?: string | null;
  }>;
}

// Helper function to format the SOAP body with XML string interpolation
const createSoapBody = (jsonData: string) => `
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

    // Prepare JSON structure as string for SOAP parameter, ensuring `idrequisicaoactomedico` is always included
    const jsonData = JSON.stringify({
      ...invoiceDetails,
      ResultLinhas: invoiceDetails.ResultLinhas.map((line) => ({
        ...line,
        idrequisicaoactomedico: line.idrequisicaoactomedico || "", // Ensure non-null
      })),
    });
    console.log("Preparing to send JSON data in SOAP format:", jsonData);

    // Generate SOAP Body with XML template
    const soapBody = createSoapBody(jsonData);
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: SOAP_ACTION,
    };

    // Send the SOAP request
    const response = await axios.post(WEBSERVICE_URL, soapBody, { headers });

    return NextResponse.json({
      message: "SOAP request sent successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.error("Error sending SOAP request:", error.message);
    return NextResponse.json(
      { error: "Failed to send SOAP request", details: error.message },
      { status: 500 }
    );
  }
}
