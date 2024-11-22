import React, { useState, useEffect, useMemo } from "react";
import referencias from "@/app/files/referencias.json"; // Adjust the path as necessary

// Ensure the data matches the Referencia interface
const formattedReferencias = referencias.map((referencia: any) => ({
  ststamp: referencia.ststamp,
  codigo: referencia.codigo,
  codigoProdutoComposto: referencia.codigoProdutoComposto,
  descricao: referencia.Descricao, // Fix property name
}));
import { FixedSizeList as List } from "react-window";
import debounce from "lodash.debounce";

interface DropdownReferenciasProps {
  codigoValue: string;
  descricaoValue: string;
  onCodigoChange: (value: string) => void;
  onDescricaoChange: (value: string) => void;
  onChange: (codigo: string, descricao: string) => void;
}

interface Referencia {
  ststamp: string;
  codigo: string | null;
  codigoProdutoComposto: string | null;
  descricao: string | null;
}

const DropdownReferencias: React.FC<DropdownReferenciasProps> = ({
  codigoValue,
  descricaoValue,
  onCodigoChange,
  onDescricaoChange,
  onChange,
}) => {
  const [uniqueReferencias, setUniqueReferencias] = useState<Referencia[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unique = Array.from(
      new Set(
        formattedReferencias.map((referencia: Referencia) => referencia.codigo)
      )
    )
      .map((codigo) => {
        return formattedReferencias.find(
          (referencia: Referencia) => referencia.codigo === codigo
        );
      })
      .filter(Boolean) as Referencia[]; // Remove any undefined values and cast to Referencia[]

    const sorted = unique.sort((a, b) => {
      const codigoA = a.codigo || "";
      const codigoB = b.codigo || "";
      return codigoA.localeCompare(codigoB);
    });

    setUniqueReferencias(sorted);
  }, []);

  // Debounced search term update
  const debouncedSetSearchTerm = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  // Filter referencias based on search term
  const filteredReferencias = useMemo(() => {
    return uniqueReferencias.filter(
      (referencia: Referencia) =>
        (referencia.codigo || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (referencia.descricao || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, uniqueReferencias]);

  const handleSelect = (referencia: Referencia) => {
    onCodigoChange(referencia.codigo || "");
    onDescricaoChange(referencia.descricao || "");
    onChange(referencia.codigo || "", referencia.descricao || "");
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onCodigoChange("");
    onDescricaoChange("");
    onChange("", "");
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative text-xs">
      <div
        className="border p-2 cursor-pointer bg-white w-[50%] text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {codigoValue && descricaoValue
          ? `${codigoValue} - ${descricaoValue}`
          : "Código Ato Médico / Descrição"}
      </div>
      {isOpen && (
        <div className="absolute border bg-white w-[50%] mt-1 z-10">
          <input
            type="text"
            placeholder="Procurar referência"
            onChange={handleSearchChange}
            className="w-full p-2 border-b"
          />
          <div className="max-h-60 overflow-y-auto">
            <List
              height={240}
              itemCount={filteredReferencias.length}
              itemSize={35}
              width={"100%"}
            >
              {({ index, style }) => (
                <div
                  style={style}
                  key={filteredReferencias[index].ststamp}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelect(filteredReferencias[index])}
                >
                  {filteredReferencias[index].codigo} -{" "}
                  {filteredReferencias[index].descricao}
                </div>
              )}
            </List>
          </div>
          <div
            className="border-t p-2 text-center cursor-pointer bg-gray-200 hover:bg-gray-300"
            onClick={handleClear}
          >
            Remover Referência Selecionada
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownReferencias;
