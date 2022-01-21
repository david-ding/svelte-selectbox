export type ClassNames = string | Array<string> | Record<string, boolean>;
export type DropdownDirection = "up" | "down" | "auto";

export interface Position {
  top?: number;
  bottom?: number;
  left?: number;
}

export interface SelectOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}
