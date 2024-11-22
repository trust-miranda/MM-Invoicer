import React, { useState } from "react";
import fornecedores from "@/app/files/fornecedores.json";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Sort fornecedores alphabetically by nome2
  const sortedFornecedores = fornecedores.sort((a, b) =>
    a.nome2.localeCompare(b.nome2)
  );

  // Filter fornecedores based on search term
  const filteredFornecedores = sortedFornecedores.filter((fornecedor) =>
    fornecedor.nome2.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (nome2: string) => {
    onChange(nome2);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative text-xs">
      <div
        className="border p-2 cursor-pointer bg-white w-[50%] text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value || "Prestador"}
      </div>
      {isOpen && (
        <div className="absolute border bg-white w-[50%] mt-1 z-10">
          <input
            type="text"
            placeholder="Procurar Prestador"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b"
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredFornecedores.map(
              (fornecedor: { flstamp: string; nome2: string }) => (
                <div
                  key={fornecedor.flstamp}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSelect(fornecedor.nome2)}
                >
                  {fornecedor.nome2}
                </div>
              )
            )}
          </div>
          <div
            className="border-t p-2 text-center cursor-pointer bg-gray-200 hover:bg-gray-300"
            onClick={handleClear}
          >
            Remover Prestador Selecionado
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
