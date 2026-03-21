import { memo } from "react";

import CarStateNullableNumberField from "./CarStateNullableNumberField";
import CarStateNullableStringField from "./CarStateNullableStringField";
import CarStateNumberField from "./CarStateNumberField";
import CarStateSelectField from "./CarStateSelectField";
import CarStateStringField from "./CarStateStringField";

import type { Type313sCarInfoState } from "../../../store/monitors/type313s/type313sTypes";
import type { CarStateBasicField } from "../types";

type CarStateFormFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly field: CarStateBasicField;
	readonly carState: Type313sCarInfoState;
	readonly updateCarState: (
		index: number,
		updater: (car: Type313sCarInfoState) => Type313sCarInfoState,
	) => void;
	readonly className?: string;
};

export default memo<CarStateFormFieldProps>(function CarStateFormField({
	formationIndex,
	carIndex,
	field,
	carState,
	updateCarState,
	className,
}) {
	switch (field.type) {
		case "string":
			return (
				<CarStateStringField
					key={field.fieldKey}
					formationIndex={formationIndex}
					carIndex={carIndex}
					fieldKey={field.fieldKey}
					label={field.label}
					getValue={field.getValue}
					setValue={field.setValue}
					className={className}
				/>
			);

		case "number":
			return (
				<CarStateNumberField
					key={field.fieldKey}
					formationIndex={formationIndex}
					carIndex={carIndex}
					fieldKey={field.fieldKey}
					label={field.label}
					getValue={field.getValue}
					setValue={field.setValue}
					className={className}
				/>
			);

		case "nullable-number":
			return (
				<CarStateNullableNumberField
					key={field.fieldKey}
					formationIndex={formationIndex}
					carIndex={carIndex}
					fieldKey={field.fieldKey}
					label={field.label}
					getValue={field.getValue}
					setValue={field.setValue}
					step={field.step}
					className={className}
				/>
			);

		case "nullable-string":
			return (
				<CarStateNullableStringField
					key={field.fieldKey}
					formationIndex={formationIndex}
					carIndex={carIndex}
					fieldKey={field.fieldKey}
					label={field.label}
					getValue={field.getValue}
					setValue={field.setValue}
					className={className}
				/>
			);

		case "select":
			return (
				<CarStateSelectField
					key={field.fieldKey}
					formationIndex={formationIndex}
					carIndex={carIndex}
					fieldKey={field.fieldKey}
					label={field.label}
					value={field.toSelectValue(carState)}
					onChange={(carIndex, value) =>
						updateCarState(carIndex, (current) =>
							field.fromSelectValue(current, value),
						)
					}
					options={field.options}
					className={className}
				/>
			);

		default: {
			const _exhaustiveCheck: never = field;
			return _exhaustiveCheck;
		}
	}
});
