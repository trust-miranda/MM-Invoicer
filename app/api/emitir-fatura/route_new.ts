import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { handleValidationAndInsertInvoice } from "./dbService";
import { parseStringPromise } from "xml2js";
import pLimit from "p-limit"; // Limit concurrency if needed

const WEBSERVICE_URL = "http://192.168.1.12/intranet/ws/wscript.asmx";
const SOAP_ACTION = "http://www.phc.pt/RunCode";
const USERNAME = "Intranet";
const PASSWORD = "Trust#2024!";

const limit = pLimit(10);

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
    idrequisicaoactomedico: string;
    datafinal: number;
    dataopen: number;
    texto: string;
    idavenca?: string | null;
  }>;
}

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

    const jsonData = JSON.stringify({
      ...invoiceDetails,
      ResultLinhas: invoiceDetails.ResultLinhas.map((line) => ({
        ...line,
        idrequisicaoactomedico: line.idrequisicaoactomedico || "",
      })),
    });
    console.log("Preparing to send JSON data for SOAP request:", jsonData);

    const soapBody = createSoapBody(jsonData);
    const headers = {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: SOAP_ACTION,
    };

    const response = await axios.post(WEBSERVICE_URL, soapBody, { headers });
    const parsedResponse = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const resultData =
      parsedResponse["soap:Envelope"]["soap:Body"]["RunCodeResponse"][
        "RunCodeResult"
      ];
    const responseObjectArray = JSON.parse(resultData);

    if (!Array.isArray(responseObjectArray)) {
      throw new Error("Unexpected response format. Expected an array.");
    }

    const rowsInserted = await Promise.all(
      invoiceDetails.ResultLinhas.map(async (line, index) =>
        limit(async () => {
          const responseObject = responseObjectArray[index] || {};
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
            estado: "Aprovada",
          };
          return handleValidationAndInsertInvoice(dbInvoiceDetails);
        })
      )
    );

    const totalRowsInserted = rowsInserted.reduce((sum, rows) => sum + rows, 0);
    console.log(
      `Successfully inserted ${totalRowsInserted} row(s) into the database.`
    );
  } catch (error: any) {
    console.error("Error occurred in route handler:", error.message);
    return NextResponse.json(
      {
        error: "Something went wrong",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
