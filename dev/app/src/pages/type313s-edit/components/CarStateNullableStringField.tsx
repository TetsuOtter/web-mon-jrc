import { memo } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setCarStateList } from "../../../store/monitors/type313s/type313sSlice";

import type { Type313sCarState } from "../../../store/monitors/type313s/type313sTypes";

type CarStateNullableStringFieldProps = {
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly getValue: (carState: Type313sCarState) => string | null;
	readonly setValue: (
		carState: Type313sCarState,
		nextValue: string | null,
	) => Type313sCarState;
	readonly placeholder?: string;
	readonly className?: string;
};

export default memo<CarStateNullableStringFieldProps>(
	function CarStateNullableStringField({
		carIndex,
		fieldKey,
		label,
		getValue,
		setValue,
		placeholder,
		className,
	}) {
		const dispatch = useAppDispatch();
		const carStateList = useAppSelector(
			(state) => state.monitors.type313s.carStateList,
		);
		const value = useAppSelector((state) => {
			const targetCarState = state.monitors.type313s.carStateList[carIndex];
			return targetCarState ? getValue(targetCarState) : null;
		});

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const nextValue = e.target.value === "" ? null : e.target.value;
			dispatch(
				setCarStateList(
					carStateList.map((carState, index) =>
						index === carIndex ? setValue(carState, nextValue) : carState,
					),
				),
			);
		};

		return (
			<div className={className}>
				<label htmlFor={`car-${carIndex}-${fieldKey}`}>{label}</label>
				<input
					id={`car-${carIndex}-${fieldKey}`}
					type="text"
					placeholder={placeholder}
					value={value ?? ""}
					onChange={handleChange}
				/>
			</div>
		);
	},
);
