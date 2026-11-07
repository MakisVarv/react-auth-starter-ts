import type { ChangeEvent } from "react";

export interface FieldComponentProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}
