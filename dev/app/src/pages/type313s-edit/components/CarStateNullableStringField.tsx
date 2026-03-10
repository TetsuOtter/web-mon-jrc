import { memo } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setFormations } from "../../../store/monitors/type313s/type313sSlice";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";

type CarStateNullableStringFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarInfoState) => string | null;
	readonly setValue: (
		carState: Type313sCarInfoState,
		nextValue: string | null,
	) => Type313sCarInfoState;
	readonly placeholder?: string;
	readonly className?: string;
};

export default memo<CarStateNullableStringFieldProps>(
	function CarStateNullableStringField({
		formationIndex,
		carIndex,
		fieldKey,
		label,
		getValue,
		setValue,
		placeholder,
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
			const nextValue = e.target.value === "" ? null : e.target.value;
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
					type="text"
					placeholder={placeholder}
					value={value ?? ""}
					onChange={handleChange}
				/>
			</div>
		);
	},
);
