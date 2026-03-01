import { memo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import type { NumberFormFieldConfig } from "../types";

type NumberFormFieldProps = {
	readonly config: NumberFormFieldConfig;
	readonly className?: string;
};

export default memo<NumberFormFieldProps>(function NumberField({
	config,
	className,
}) {
	const dispatch = useAppDispatch();
	const value = useAppSelector(config.selector);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const inputValue = e.target.value;
			const parsedValue = config.parser
				? config.parser(inputValue)
				: parseFloat(inputValue) || 0;
			dispatch(config.actionCreator(parsedValue));
		},
		[config, dispatch]
	);

	return (
		<div className={className}>
			<label htmlFor={config.id}>{config.label}</label>
			<input
				id={config.id}
				type="number"
				step={config.step}
				value={value}
				onChange={handleChange}
			/>
		</div>
	);
});
