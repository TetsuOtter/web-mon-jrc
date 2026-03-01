import { memo, useMemo } from "react";

import { useAppSelector } from "../../../store/hooks";
import { setCarStateList } from "../../../store/monitors/type313s/type313sSlice";

import StringField from "./StringField";

import type { Type313sCarState } from "../../../store/monitors/type313s/type313sTypes";
import type { StringFormFieldConfig } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";

type CarStateStringFieldProps = {
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarState) => string;
	readonly setValue: (
		carState: Type313sCarState,
		nextValue: string
	) => Type313sCarState;
	readonly placeholder?: string;
	readonly className?: string;
};

export default memo<CarStateStringFieldProps>(function CarStateStringField({
	carIndex,
	fieldKey,
	label,
	getValue,
	setValue,
	placeholder,
	className,
}) {
	const carStateList = useAppSelector(
		(state) => state.monitors.type313s.carStateList
	);

	const config = useMemo<StringFormFieldConfig>(
		() => ({
			id: `car-${carIndex}-${fieldKey}`,
			label,
			valueType: "string",
			placeholder,
			selector: (state) => {
				const targetCarState = state.monitors.type313s.carStateList[carIndex];
				return targetCarState ? getValue(targetCarState) : "";
			},
			actionCreator: (nextValue: string) =>
				setCarStateList(
					carStateList.map((carState, index) =>
						index === carIndex ? setValue(carState, nextValue) : carState
					)
				) as unknown as PayloadAction<string>,
		}),
		[carIndex, carStateList, fieldKey, getValue, label, placeholder, setValue]
	);

	return (
		<StringField
			config={config}
			className={className}
		/>
	);
});
