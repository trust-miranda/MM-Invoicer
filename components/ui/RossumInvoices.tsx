import React from "react";
import { Card, CardContent } from "./card";

const RossumInvoices = () => {
  return (
    <Card className="bg-white p-4">
      <div className="airtable-content p-2 text-start">
        <CardContent className="flex flex-col">
          <header className="pedidos-header  p-2 ">
            <h1 className="airtable-pedidos-title variant-title text-24 font-semibold mt-2">
              ROSSUM
            </h1>
            <h2 className="text-14 font-semibold text-gray-600 mb-6">
              Faturas processadas pelo Rossum
            </h2>
          </header>
          <iframe
            className="airtable-embed"
            src="https://airtable.com/embed/appCXYj5VfpC6p9N5/shrdk6nVC5RfB8IZx?layout=card&viewControls=on"
            frameBorder="0"
            width="100%"
            height="533"
            style={{
              background: "#transparent",
              border: "0px solid #d0d5dd",
              fontFamily: "sans-serif",
              overflow: "hidden",
              flexGrow: 1,
            }}
          ></iframe>
        </CardContent>
      </div>
    </Card>
  );
};

export default RossumInvoices;
