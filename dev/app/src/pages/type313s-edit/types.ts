import type { AppSelector } from "../../store/types";
import type { PayloadAction } from "@reduxjs/toolkit";

export type StringFormFieldConfig = {
  readonly id: string;
  readonly label: string;
  readonly valueType: "string";
  readonly placeholder?: string;
  readonly selector: AppSelector<string>;
  readonly actionCreator: (value: string) => PayloadAction<string>;
};

export type NumberFormFieldConfig = {
  readonly id: string;
  readonly label: string;
  readonly valueType: "number";
  readonly step?: string;
  readonly selector: AppSelector<number>;
  readonly actionCreator: (value: number) => PayloadAction<number>;
  readonly parser?: (value: string) => number;
};

export type FormFieldConfig = StringFormFieldConfig | NumberFormFieldConfig;
