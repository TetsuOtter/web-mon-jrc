import { memo } from "react";
import { Link } from "react-router-dom";

import {
	setCurrentLocation,
	setDestination,
	setTrainNumber,
	setTrainType,
} from "../../store/monitors/type313s/type313sSlice";

import styles from "./Type313sEditPage.module.css";
import FormField from "./components/FormField";

import type { FormFieldConfig } from "./types";

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

export default memo(function Type313sEditPage() {
	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>313系 モニター設定</h1>
				<Link
					to="/"
					className={styles.homeLink}>
					← トップへ戻る
				</Link>
			</header>

			<main className={styles.main}>
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

				<section className={styles.section}>
					<h2>備考</h2>
					<p className={styles.note}>
						この画面で変更した内容は、LocalStorage に自動保存されます。
						<br />
						別のタブを開いている場合は、そちらにも即座に反映されます。
					</p>
				</section>
			</main>
		</div>
	);
});
