import { memo } from "react";

import NumberField from "./NumberField";
import StringField from "./StringField";

import type { FormFieldConfig } from "../types";

type FormFieldProps = {
	readonly config: FormFieldConfig;
	readonly className?: string;
};

export default memo<FormFieldProps>(function FormField({ config, className }) {
	switch (config.valueType) {
		case "string":
			return (
				<StringField
					config={config}
					className={className}
				/>
			);
		case "number":
			return (
				<NumberField
					config={config}
					className={className}
				/>
			);
		default:
			return null;
	}
});
