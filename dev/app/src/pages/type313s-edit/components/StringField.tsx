import { memo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";

import type { StringFormFieldConfig } from "../types";

type StringFormFieldProps = {
	readonly config: StringFormFieldConfig;
	readonly className?: string;
};

export default memo<StringFormFieldProps>(function StringField({
	config,
	className,
}) {
	const dispatch = useAppDispatch();
	const value = useAppSelector(config.selector);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(config.actionCreator(e.target.value));
		},
		[config, dispatch],
	);

	return (
		<div className={className}>
			<label htmlFor={config.id}>{config.label}</label>
			<input
				id={config.id}
				type="text"
				value={value}
				onChange={handleChange}
				placeholder={config.placeholder}
			/>
		</div>
	);
});
