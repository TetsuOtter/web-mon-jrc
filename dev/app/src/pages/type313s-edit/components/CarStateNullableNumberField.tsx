import { memo } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setFormations } from "../../../store/monitors/type313s/type313sSlice";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";

type CarStateNullableNumberFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarInfoState) => number | null;
	readonly setValue: (
		carState: Type313sCarInfoState,
		nextValue: number | null,
	) => Type313sCarInfoState;
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
		formationIndex,
		carIndex,
		fieldKey,
		label,
		getValue,
		setValue,
		step,
		className,
	}) {
		const dispatch = useAppDispatch();
		const formations = useAppSelector(
			(state) => state.monitors.type313s.formations,
		);
		const value = useAppSelector((state) => {
			const targetCarState =
				state.monitors.type313s.formations[formationIndex]?.carInfoList[
					carIndex
				];
			return targetCarState ? getValue(targetCarState) : null;
		});

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const nextValue = parseNullableNumber(e.target.value);
			dispatch(
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
				),
			);
		};

		return (
			<div className={className}>
				<label htmlFor={`car-${formationIndex}-${carIndex}-${fieldKey}`}>
					{label}
				</label>
				<input
					id={`car-${formationIndex}-${carIndex}-${fieldKey}`}
					type="number"
					step={step}
					value={value ?? ""}
					onChange={handleChange}
				/>
			</div>
		);
	},
);
