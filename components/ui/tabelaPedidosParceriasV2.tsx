"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddRecordPopover from "./addRecordPopover";
import fs from "fs/promises";
import path from "path";

interface Record {
  id: string;
  fields: {
    [key: string]: any;
  };
}

const TabelaPedidosParceriasV2 = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [newRecordData, setNewRecordData] = useState<{ [key: string]: any }>(
    {}
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "ascending" | "descending";
  }>({ key: null, direction: "ascending" });
  const [filterCriteria, setFilterCriteria] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const recordsPerPage = 10;

  type ColumnMapping = {
    [key in
      | "Nº Processo TRUST"
      | "Código Ato Médico"
      | "Nível de Urgência"
      | "Anexos"
      | "Observações"
      | "Tipo de Pedido"
      | "Seguradora"
      | "Descrição"
      | "Estado do Pedido"
      | "Prestador"
      | "Data Prevista para Realização"]: string;
  } & {
    [key in "Data de Conclusão" | "Data de Criação"]: Date;
  };

  const columnMapping: Omit<
    ColumnMapping,
    "Data de Conclusão" | "Data de Criação"
  > = {
    "Nº Processo TRUST": "Nº Processo TRUST",
    "Data Prevista para Realização": "Data Prevista para Realização",
    "Código Ato Médico": "Código Ato Médico",
    "Nível de Urgência": "Nível de Urgência",
    Anexos: "Anexos",
    Observações: "Observações",
    "Tipo de Pedido": "Tipo de Pedido",
    Seguradora: "Seguradora",
    Descrição: "Descrição",
    "Estado do Pedido": "Estado do Pedido",
    Prestador: "Prestador",
  };

  const dateColumnMapping = {
    "Data de Conclusão": new Date(),
    "Data Prevista para Realização": new Date(),
    "Data de Criação": new Date(),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/fetchPedidos");
        console.log(response.data.message);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      }
    };

    fetchData();
  }, [sortConfig]);

  // Sorting function
  const sortedRecords = React.useMemo(() => {
    let sortableRecords = [...records];
    if (sortConfig.key !== null) {
      sortableRecords.sort((a, b) => {
        if (
          sortConfig.key &&
          a.fields[sortConfig.key as string] <
            b.fields[sortConfig.key as string]
        ) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (
          sortConfig.key !== null &&
          a.fields[sortConfig.key] > b.fields[sortConfig.key]
        ) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [records, sortConfig]);

  const filteredRecords = sortedRecords.filter((record) =>
    Object.values(record.fields).some((value) =>
      value.toString().toLowerCase().includes(filterCriteria.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction: direction as "ascending" | "descending" });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCriteria(event.target.value);
    setCurrentPage(1);
  };

  const handleEditClick = (record: Record) => {
    setEditingRecord(record);
    setFormData(record.fields);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveClick = async () => {
    if (!editingRecord) return;

    const updatedFields = Object.keys(formData).reduce(
      (acc, key) => {
        if (formData[key] !== editingRecord.fields[key]) {
          acc[key] = formData[key];
        }
        return acc;
      },
      {} as { [key: string]: any }
    );

    let data = JSON.stringify({ fields: updatedFields });

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos/${editingRecord.id}`,
      headers: {
        Authorization:
          "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76",
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      console.log("Sending data:", data);
      const response = await axios.request(config);
      console.log("Response data:", JSON.stringify(response.data));
      setRecords((prevRecords) =>
        prevRecords.map((rec) =>
          rec.id === editingRecord.id
            ? { ...rec, fields: { ...rec.fields, ...updatedFields } }
            : rec
        )
      );
      setEditingRecord(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error updating record:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  // Handle new record input change
  const handleNewRecordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewRecordData({
      ...newRecordData,
      [name]: name === "Nº Processo TRUST" ? value : value,
    });
  };

  // Handle new record form submission
  const handleNewRecordSubmit = async (formData: { [key: string]: any }) => {
    let data = JSON.stringify({ fields: formData });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.airtable.com/v0/appmwRIcj4SwGz9qb/Pedidos",
      headers: {
        Authorization:
          "Bearer patzzfeQfHqi8uLLM.9090980443a7741692bbc8993ad9b83c7a63cd978ffd725580eeeeda1c5c5c76",
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      console.log("Sending new record data:", data); // Log the data being sent
      const response = await axios.request(config);
      console.log("Response data:", JSON.stringify(response.data));
      setRecords((prevRecords) => [...prevRecords, response.data]);
      setNewRecordData({});
      setIsPopoverOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error adding new record:",
          error.response?.data || error.message
        );
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <div>
      <h1>Records</h1>
      <input
        type="text"
        placeholder="Filter records"
        value={filterCriteria}
        onChange={handleFilterChange}
      />
      <table>
        <thead>
          <tr>
            {Object.keys({ ...columnMapping, ...dateColumnMapping }).map(
              (title) => (
                <th key={title} onClick={() => handleSort(title)}>
                  {title}
                </th>
              )
            )}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record) => (
            <tr key={record.id}>
              {Object.keys({ ...columnMapping, ...dateColumnMapping }).map(
                (title) => (
                  <td key={title}>
                    {editingRecord?.id === record.id ? (
                      <input
                        type="text"
                        name={title}
                        value={formData[title] || ""}
                        onChange={handleInputChange}
                      />
                    ) : (
                      record.fields[title]?.toString() || ""
                    )}
                  </td>
                )
              )}
              <td>
                {editingRecord?.id === record.id ? (
                  <button onClick={handleSaveClick}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(record)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button onClick={() => setIsPopoverOpen(true)}>+</button>{" "}
      {/* Add button to open popover */}
      <AddRecordPopover
        isOpen={isPopoverOpen}
        onRequestClose={() => setIsPopoverOpen(false)}
        onSubmit={handleNewRecordSubmit}
        columnMapping={columnMapping}
        newRecordData={newRecordData}
        handleNewRecordInputChange={handleNewRecordInputChange}
      />
      {/* <h2>Add New Record</h2>
      <form onSubmit={handleNewRecordSubmit}>
        {Object.keys(columnMapping).map((title) => (
          <input
            key={title}
            type="text"
            name={String(columnMapping[title as keyof typeof columnMapping])}
            placeholder={title}
            value={
              newRecordData[
                columnMapping[title as keyof typeof columnMapping]
              ] || ""
            }
            onChange={handleNewRecordInputChange}
          />
        ))}
        <button type="submit">Add Record</button>
      </form> */}
    </div>
  );
};

export default TabelaPedidosParceriasV2;
