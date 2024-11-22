import { Input } from "./input";
import React from "react";
import { FormField, FormLabel, FormControl, FormMessage } from "./form";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { pedidosFormSchema } from "@/lib/utils";

const formSchema = pedidosFormSchema("type");

interface CustomInputProps {
  control: Control<z.infer<typeof formSchema>>;
  name: FieldPath<z.infer<typeof formSchema>>;
  label: string;
  placeholder: string;
  id: string;
}

const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  id,
}: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel htmlFor={id} className="form-label">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                id={id}
                placeholder={placeholder}
                className="input-class"
                {...field}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
