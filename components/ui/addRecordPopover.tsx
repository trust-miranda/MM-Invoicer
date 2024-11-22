import React, { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

// Define or import the ColumnMapping type
interface ColumnMapping {
  [key: string]: string;
}

interface AddRecordPopoverProps {
  isOpen: boolean;

  onRequestClose: () => void;

  onSubmit: (formData: { [key: string]: any }) => Promise<void>;

  columnMapping: Omit<ColumnMapping, "Data de Conclusão" | "Data de Criação">;

  newRecordData: { [key: string]: any };

  handleNewRecordInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddRecordPopover: React.FC<AddRecordPopoverProps> = ({
  onSubmit,
  columnMapping,
}) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "trust_process_number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({});
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>+</button>
      </PopoverTrigger>
      <PopoverContent>
        <h2>Add New Record</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(columnMapping).map((title) => (
            <input
              key={title}
              type={title === "Nº Processo TRUST" ? "number" : "text"}
              name={columnMapping[title]}
              placeholder={title}
              value={formData[columnMapping[title]] || ""}
              onChange={handleInputChange}
            />
          ))}
          <button type="submit">Adicionar Pedido</button>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default AddRecordPopover;
