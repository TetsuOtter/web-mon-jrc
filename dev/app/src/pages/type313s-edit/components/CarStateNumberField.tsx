import { memo, useMemo } from "react";

import { useAppSelector } from "../../../store/hooks";
import { setCarStateList } from "../../../store/monitors/type313s/type313sSlice";

import NumberField from "./NumberField";

import type { Type313sCarState } from "../../../store/monitors/type313s/type313sTypes";
import type { NumberFormFieldConfig } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";

type CarStateNumberFieldProps = {
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarState) => number;
	readonly setValue: (
		carState: Type313sCarState,
		nextValue: number
	) => Type313sCarState;
	readonly step?: string;
	readonly parser?: (value: string) => number;
	readonly className?: string;
};

export default memo<CarStateNumberFieldProps>(function CarStateNumberField({
	carIndex,
	fieldKey,
	label,
	getValue,
	setValue,
	step,
	parser,
	className,
}) {
	const carStateList = useAppSelector(
		(state) => state.monitors.type313s.carStateList
	);

	const config = useMemo<NumberFormFieldConfig>(
		() => ({
			id: `car-${carIndex}-${fieldKey}`,
			label,
			valueType: "number",
			step,
			parser,
			selector: (state) => {
				const targetCarState = state.monitors.type313s.carStateList[carIndex];
				return targetCarState ? getValue(targetCarState) : 0;
			},
			actionCreator: (nextValue: number) =>
				setCarStateList(
					carStateList.map((carState, index) =>
						index === carIndex ? setValue(carState, nextValue) : carState
					)
				) as unknown as PayloadAction<number>,
		}),
		[carIndex, carStateList, fieldKey, getValue, label, parser, setValue, step]
	);

	return (
		<NumberField
			config={config}
			className={className}
		/>
	);
});
