import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "date" | "time" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  defaultValue?: string;
  options?: { value: string; label: string }[];
  min?: string | number;
  children?: ReactNode;
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  helpText,
  defaultValue,
  options,
  min,
  children,
}: FormFieldProps) {
  const id = name;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
        />
      ) : type === "select" ? (
        <Select name={name} required={required} defaultValue={defaultValue}>
          <SelectTrigger id={id}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          min={min}
        />
      )}
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      {children}
    </div>
  );
}
