import { memo } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCarStateList } from "../../../store/monitors/type313s/type313sSlice";

import type { Type313sCarState } from "../../../store/monitors/type313s/type313sTypes";

type CarStateNullableNumberFieldProps = {
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarState) => number | null;
	readonly setValue: (
		carState: Type313sCarState,
		nextValue: number | null
	) => Type313sCarState;
	readonly step?: string;
	readonly className?: string;
};

function parseNullableNumber(inputValue: string): number | null {
	if (inputValue.trim() === "") {
		return null;
	}

	const parsed = Number(inputValue);
	return Number.isFinite(parsed) ? parsed : null;
}

export default memo<CarStateNullableNumberFieldProps>(
	function CarStateNullableNumberField({
		carIndex,
		fieldKey,
		label,
		getValue,
		setValue,
		step,
		className,
	}) {
		const dispatch = useAppDispatch();
		const carStateList = useAppSelector(
			(state) => state.monitors.type313s.carStateList
		);
		const value = useAppSelector((state) => {
			const targetCarState = state.monitors.type313s.carStateList[carIndex];
			return targetCarState ? getValue(targetCarState) : null;
		});

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const nextValue = parseNullableNumber(e.target.value);
			dispatch(
				setCarStateList(
					carStateList.map((carState, index) =>
						index === carIndex ? setValue(carState, nextValue) : carState
					)
				)
			);
		};

		return (
			<div className={className}>
				<label htmlFor={`car-${carIndex}-${fieldKey}`}>{label}</label>
				<input
					id={`car-${carIndex}-${fieldKey}`}
					type="number"
					step={step}
					value={value ?? ""}
					onChange={handleChange}
				/>
			</div>
		);
	}
);
