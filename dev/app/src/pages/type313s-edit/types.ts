import type { Type313sCarInfoState } from "../../store/monitors/type313s/type313sTypes";
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

// CarState field type definitions
export type CarStateBasicField =
	| {
			type: "string";
			fieldKey: string;
			label: string;
			getValue: (car: Type313sCarInfoState) => string;
			setValue: (
				car: Type313sCarInfoState,
				value: string,
			) => Type313sCarInfoState;
	  }
	| {
			type: "number";
			fieldKey: string;
			label: string;
			getValue: (car: Type313sCarInfoState) => number;
			setValue: (
				car: Type313sCarInfoState,
				value: number,
			) => Type313sCarInfoState;
	  }
	| {
			type: "nullable-number";
			fieldKey: string;
			label: string;
			step?: string;
			getValue: (car: Type313sCarInfoState) => number | null;
			setValue: (
				car: Type313sCarInfoState,
				value: number | null,
			) => Type313sCarInfoState;
	  }
	| {
			type: "nullable-string";
			fieldKey: string;
			label: string;
			getValue: (car: Type313sCarInfoState) => string | null;
			setValue: (
				car: Type313sCarInfoState,
				value: string | null,
			) => Type313sCarInfoState;
	  }
	| {
			type: "select";
			fieldKey: string;
			label: string;
			options: readonly { value: string; label: string }[];
			toSelectValue: (car: Type313sCarInfoState) => string;
			fromSelectValue: (
				car: Type313sCarInfoState,
				value: string,
			) => Type313sCarInfoState;
	  };

export type SivLineStateField = Exclude<
	CarStateBasicField,
	{ type: "string" } | { type: "number" }
>;

export type CabStateField = Exclude<CarStateBasicField, { type: "number" }>;

export type BogieCommonField = Exclude<
	CarStateBasicField,
	{ type: "string" | "number" }
>;

export type BogieSideField = Exclude<
	CarStateBasicField,
	{ type: "string" | "number" }
>;
