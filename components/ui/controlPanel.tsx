import React, { useState, useRef } from "react";

interface ControlPanelProps {
  onFiltersChange: (
    newFilters: Record<string, { value: string; operator: string }>
  ) => void;

  selectedFields: string[];
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onFiltersChange }) => {
  const allFields = [
    "idProcesso",
    "nomeEstabelecimento",
    "idRamo",
    "idProcessoEstadoClinico",
    "idEntidadeSeguradora",
    "idProcessoEstadoSinistro",
    "dataAcidente",
    "dataAdmissao",
    "dataAlta",
    "dataPensionista",
    "dataPrimeiraConsulta",
    "dataUltimaConsulta",
    "ePensionista",
    "idEntidadePrestador",
    "idEstabelecimento",
    "nrConsultas",
    "nrConsultasDano",
    "nrConsultasEspecialidadesForaAvenca",
    "nrConsultasPorExecutar",
    "nrParceirosConsultas",
    "nrRequisicoes",
    "nrRequisicoesAnalises",
    "nrRequisicoesCirurgia",
    "nrRequisicoesDentaria",
    "nrRequisicoesECO",
    "nrRequisicoesEnfermagem",
    "nrRequisicoesFisioterapia",
    "nrRequisicoesImagiologia",
    "nrRequisicoesImagiologiaAExcluir",
    "nrRequisicoesInternamentoNaoCirurgico",
    "nrRequisicoesOutrosMCDTs",
    "nrRequisicoesPorExecutar",
    "nrRequisicoesRMN",
    "nrRequisicoesRX",
    "nrRequisicoesTAC",
    "numApolice",
    "temRecaida",
    "temTransferencia",
    "tipoProcesso",
  ];

  const [filters, setFilters] = useState<
    Record<string, { value: string; operator: string }>
  >(
    allFields.reduce(
      (acc, field) => {
        acc[field] = { value: "", operator: "=" };
        return acc;
      },
      {} as Record<string, { value: string; operator: string }>
    )
  );

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFieldSelection = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields((prev) => prev.filter((f) => f !== field));
    } else {
      setSelectedFields((prev) => [...prev, field]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const [filterName, filterType] = name.split("_");
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: {
        ...prevFilters[filterName],
        [filterType]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ width: "300px" }}>
      {/* Dropdown button */}
      <div style={{ marginBottom: "20px", position: "relative" }}>
        <button
          type="button"
          onClick={toggleDropdown}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          {selectedFields.length > 0
            ? `Selected Fields (${selectedFields.length})`
            : "Select Fields"}
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              padding: "10px",
              zIndex: 1,
              maxHeight: "200px",
              overflowY: "scroll",
            }}
          >
            {allFields.map((field) => (
              <div key={field}>
                <input
                  type="checkbox"
                  id={field}
                  checked={selectedFields.includes(field)}
                  onChange={() => handleFieldSelection(field)}
                />
                <label htmlFor={field}>{field}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Form based on selected fields */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          padding: "2px",
          border: "1px solid #ccc",
          borderRadius: "3px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {selectedFields.map((key) => (
          <div
            key={key}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <label style={{ fontWeight: "bold" }}>{key}</label>
            <select
              name={`${key}_operator`}
              value={filters[key].operator}
              onChange={handleChange}
              style={{
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
              }}
            >
              <option value="=">=</option>
              <option value=">">&gt;</option>
              <option value=">=">&gt;=</option>
              <option value="<">&lt;</option>
              <option value="<=">&lt;=</option>
              <option value="!=">Diferente</option>
              <option value="contains">Contém</option>
              <option value="not_contains">Não Contém</option>
            </select>
            <input
              name={`${key}_value`}
              value={filters[key].value}
              onChange={handleChange}
              style={{
                padding: "5px",
                borderRadius: "3px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}

        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Aplicar
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;
