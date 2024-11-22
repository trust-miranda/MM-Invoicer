"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./card";

const AirtableForm = () => {
  const [formData, setFormData] = useState({
    idprocesso: "",
    prestador: "",
    // Add other fields as needed
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/airtable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      alert("Form submitted successfully!");
      setFormData({
        idprocesso: "",
        prestador: "",
        // Reset other fields as needed
      });
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <Card className="bg-white p-4">
      <div className="airtable-content p-2 text-start">
        <CardContent className="flex flex-col">
          <header className="pedidos-header p-2">
            <h1 className="airtable-pedidos-title variant-title text-24 font-semibold mt-2">
              FORMULÁRIO
            </h1>
            <h2 className="text-14 font-semibold text-gray-600 mb-6">
              Pedidos de Atos Médicos & Médicos/Especialidades
            </h2>
          </header>
          <iframe
            className="airtable-embed"
            src="https://airtable.com/embed/appmwRIcj4SwGz9qb/paghhwQ4hFavin88D/form"
            frameBorder="0"
            width="100%"
            height="533"
            style={{ background: "transparent", border: "1px solid #ccc" }}
          ></iframe>
          {/* <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              name="idprocesso"
              value={formData.idprocesso}
              onChange={handleChange}
              placeholder="ID Processo"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              name="prestador"
              value={formData.prestador}
              onChange={handleChange}
              placeholder="Prestador"
              className="p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form> */}
        </CardContent>
      </div>
    </Card>
  );
};

export default AirtableForm;
