import { memo } from "react";

import {
	setCurrentLocation,
	setDestination,
	setTrainNumber,
	setTrainType,
} from "../../../store/monitors/type313s/type313sSlice";
import styles from "../Type313sEditPage.module.css";

import FormField from "./FormField";

import type { FormFieldConfig } from "../types";

const FORM_FIELDS = [
	{
		id: "trainNumber",
		label: "列車番号",
		valueType: "string",
		placeholder: "例: 123M",
		selector: (state) => state.monitors.type313s.trainNumber ?? "",
		actionCreator: setTrainNumber,
	},
	{
		id: "trainType",
		label: "種別",
		valueType: "string",
		placeholder: "例: 普通",
		selector: (state) => state.monitors.type313s.trainType ?? "",
		actionCreator: setTrainType,
	},
	{
		id: "destination",
		label: "行先",
		valueType: "string",
		placeholder: "例: 豊橋",
		selector: (state) => state.monitors.type313s.destination ?? "",
		actionCreator: setDestination,
	},
	{
		id: "currentLocation",
		label: "現在位置 (km)",
		valueType: "number",
		step: "0.1",
		selector: (state) => state.monitors.type313s.currentLocation,
		actionCreator: setCurrentLocation,
		parser: (value: string) => parseFloat(value) || 0,
	},
] as const satisfies readonly FormFieldConfig[];

export default memo(function TrainInfoSection() {
	return (
		<section className={styles.section}>
			<h2>列車情報</h2>
			{FORM_FIELDS.map((field) => (
				<FormField
					key={field.id}
					config={field}
					className={styles.formGroup}
				/>
			))}
		</section>
	);
});
