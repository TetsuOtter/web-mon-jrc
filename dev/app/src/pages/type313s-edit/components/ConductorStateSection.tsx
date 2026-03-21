import { memo, useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setConductorState } from "../../../store/monitors/type313s/type313sSlice";
import styles from "../Type313sEditPage.module.css";
import {
	NULLABLE_BOOLEAN_OPTIONS,
	nullableBooleanToSelectValue,
	selectValueToNullableBoolean,
} from "../fieldDefinitions";

import SelectField from "./SelectField";

import type { Type313sConductorState } from "../../../store/monitors/type313s/type313sTypes";

export default memo(function ConductorStateSection() {
	const dispatch = useAppDispatch();
	const conductorState = useAppSelector(
		(state) => state.monitors.type313s.conductorState,
	);

	const updateConductorState = useCallback(
		(key: keyof Type313sConductorState, value: boolean | null) => {
			dispatch(setConductorState({ ...conductorState, [key]: value }));
		},
		[conductorState, dispatch],
	);

	return (
		<section className={styles.section}>
			<details
				open
				className={styles.collapseSection}
			>
				<summary className={styles.sectionSummary}>車掌状態</summary>
				<div className={styles.fieldGrid}>
					<SelectField
						id="conductor-isRoomLightOn"
						label="室内灯"
						value={nullableBooleanToSelectValue(conductorState.isRoomLightOn)}
						onChange={(value) =>
							updateConductorState(
								"isRoomLightOn",
								selectValueToNullableBoolean(value),
							)
						}
						options={NULLABLE_BOOLEAN_OPTIONS}
						className={styles.formGroup}
					/>

					<SelectField
						id="conductor-isGuidanceOn"
						label="案内放送"
						value={nullableBooleanToSelectValue(conductorState.isGuidanceOn)}
						onChange={(value) =>
							updateConductorState(
								"isGuidanceOn",
								selectValueToNullableBoolean(value),
							)
						}
						options={NULLABLE_BOOLEAN_OPTIONS}
						className={styles.formGroup}
					/>
				</div>
			</details>
		</section>
	);
});
