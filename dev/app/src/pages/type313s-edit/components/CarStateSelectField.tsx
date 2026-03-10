import { memo } from "react";

import SelectField from "./SelectField";

type SelectOption = {
	readonly value: string;
	readonly label: string;
};

type CarStateSelectFieldProps = {
	readonly formationIndex: number;
	readonly carIndex: number;
	readonly fieldKey: string;
	readonly label: string;
	readonly value: string;
	readonly options: readonly SelectOption[];
	readonly onChange: (carIndex: number, value: string) => void;
	readonly className?: string;
};

export default memo<CarStateSelectFieldProps>(function CarStateSelectField({
	formationIndex,
	carIndex,
	fieldKey,
	label,
	value,
	options,
	onChange,
	className,
}) {
	return (
		<SelectField
			id={`car-${formationIndex}-${carIndex}-${fieldKey}`}
			label={label}
			value={value}
			options={options}
			onChange={(nextValue) => onChange(carIndex, nextValue)}
			className={className}
		/>
	);
});
