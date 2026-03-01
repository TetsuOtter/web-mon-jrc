import { memo } from "react";

type SelectFieldOption = {
	readonly value: string;
	readonly label: string;
};

type SelectFieldProps = {
	readonly id: string;
	readonly label: string;
	readonly value: string;
	readonly options: readonly SelectFieldOption[];
	readonly onChange: (value: string) => void;
	readonly className?: string;
};

export default memo<SelectFieldProps>(function SelectField({
	id,
	label,
	value,
	options,
	onChange,
	className,
}) {
	return (
		<div className={className}>
			<label htmlFor={id}>{label}</label>
			<select
				id={id}
				value={value}
				onChange={(e) => onChange(e.target.value)}>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
});
