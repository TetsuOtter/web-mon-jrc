import { memo, useMemo } from "react";

import { useAppSelector } from "../../../store/hooks";
import { setFormations } from "../../../store/monitors/type313s/type313sSlice";

import NumberField from "./NumberField";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";
import type { NumberFormFieldConfig } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";

type CarStateNumberFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarInfoState) => number;
	readonly setValue: (
		carState: Type313sCarInfoState,
		nextValue: number,
	) => Type313sCarInfoState;
	readonly step?: string;
	readonly parser?: (value: string) => number;
	readonly className?: string;
};

export default memo<CarStateNumberFieldProps>(function CarStateNumberField({
	formationIndex,
	carIndex,
	fieldKey,
	label,
	getValue,
	setValue,
	step,
	parser,
	className,
}) {
	const formations = useAppSelector(
		(state) => state.monitors.type313s.formations,
	);

	const config = useMemo<NumberFormFieldConfig>(
		() => ({
			id: `car-${formationIndex}-${carIndex}-${fieldKey}`,
			label,
			valueType: "number",
			step,
			parser,
			selector: (state) => {
				const targetCarState =
					state.monitors.type313s.formations[formationIndex]?.carInfoList[
						carIndex
					];
				return targetCarState ? getValue(targetCarState) : 0;
			},
			actionCreator: (nextValue: number) =>
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: f.carInfoList.map((carState, ci) =>
										ci === carIndex ? setValue(carState, nextValue) : carState,
									),
								}
							: f,
					),
				) as unknown as PayloadAction<number>,
		}),
		[
			carIndex,
			formationIndex,
			formations,
			fieldKey,
			getValue,
			label,
			parser,
			setValue,
			step,
		],
	);

	return (
		<NumberField
			config={config}
			className={className}
		/>
	);
});
