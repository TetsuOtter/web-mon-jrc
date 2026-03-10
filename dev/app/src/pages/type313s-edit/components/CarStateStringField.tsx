import { memo, useMemo } from "react";

import { useAppSelector } from "../../../store/hooks";
import { setFormations } from "../../../store/monitors/type313s/type313sSlice";

import StringField from "./StringField";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";
import type { StringFormFieldConfig } from "../types";
import type { PayloadAction } from "@reduxjs/toolkit";

type CarStateStringFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarInfoState) => string;
	readonly setValue: (
		carState: Type313sCarInfoState,
		nextValue: string,
	) => Type313sCarInfoState;
	readonly placeholder?: string;
	readonly className?: string;
};

export default memo<CarStateStringFieldProps>(function CarStateStringField({
	formationIndex,
	carIndex,
	fieldKey,
	label,
	getValue,
	setValue,
	placeholder,
	className,
}) {
	const formations = useAppSelector(
		(state) => state.monitors.type313s.formations,
	);

	const config = useMemo<StringFormFieldConfig>(
		() => ({
			id: `car-${formationIndex}-${carIndex}-${fieldKey}`,
			label,
			valueType: "string",
			placeholder,
			selector: (state) => {
				const targetCarState =
					state.monitors.type313s.formations[formationIndex]?.carInfoList[
						carIndex
					];
				return targetCarState ? getValue(targetCarState) : "";
			},
			actionCreator: (nextValue: string) =>
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
				) as unknown as PayloadAction<string>,
		}),
		[
			carIndex,
			formationIndex,
			formations,
			fieldKey,
			getValue,
			label,
			placeholder,
			setValue,
		],
	);

	return (
		<StringField
			config={config}
			className={className}
		/>
	);
});
