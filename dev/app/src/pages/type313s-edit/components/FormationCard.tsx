import { memo } from "react";

import styles from "../Type313sEditPage.module.css";
import {
	CAR_BASIC_FIELDS,
	CAR_STATES_FIELDS,
	SIV_LINE_STATE_FIELDS,
	CAB_STATE_FIELDS,
	BOGIE_COMMON_FIELDS,
	BOGIE_LEFT_FIELDS,
	BOGIE_RIGHT_FIELDS,
	ENABLED_OPTIONS,
	createDefaultCabState,
	createDefaultBogieState,
	createDefaultBogieCommonState,
} from "../fieldDefinitions";

import CarStateFormField from "./CarStateFormField";
import CarStateSelectField from "./CarStateSelectField";

import type {
	Type313sFormation,
	Type313sCarInfoState,
} from "../../../store/monitors/type313s/type313sTypes";

type FormationCardProps = {
	readonly formationIndex: number;
	readonly formation: Type313sFormation;
	readonly formations: Type313sFormation[];
	readonly onAddCar: (formationIndex: number) => void;
	readonly onRemoveFormation: (formationIndex: number) => void;
	readonly onRemoveCar: (formationIndex: number, carIndex: number) => void;
	readonly onUpdateCarState: (
		formationIndex: number,
		carIndex: number,
		updater: (car: Type313sCarInfoState) => Type313sCarInfoState,
	) => void;
	readonly carDetailsRefs: React.MutableRefObject<
		(HTMLDetailsElement | null)[]
	>;
	readonly carListContainerRefs: React.MutableRefObject<
		(HTMLDivElement | null)[]
	>;
};

export default memo<FormationCardProps>(function FormationCard({
	formationIndex,
	formation,
	formations,
	onAddCar,
	onRemoveFormation,
	onRemoveCar,
	onUpdateCarState,
	carDetailsRefs,
	carListContainerRefs,
}) {
	const totalCars = formations.reduce(
		(sum, f) => sum + f.carInfoList.length,
		0,
	);

	return (
		<div
			key={`formation-${formationIndex}`}
			className={styles.formationCard}
		>
			<div className={styles.formationHeader}>
				<h3 className={styles.formationTitle}>編成 {formationIndex + 1}</h3>
				<div style={{ display: "flex", gap: "8px" }}>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onAddCar(formationIndex);
						}}
						disabled={totalCars >= 12}
						className={styles.actionButton}
					>
						+ 車両追加
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onRemoveFormation(formationIndex);
						}}
						disabled={formations.length <= 1}
						className={styles.deleteButton}
					>
						編成削除
					</button>
				</div>
			</div>

			<div
				className={styles.carListContainer}
				ref={(el) => {
					if (el) {
						carListContainerRefs.current[formationIndex] = el;
					}
				}}
			>
				{formation.carInfoList.map((carState, carIndex) => {
					// Calculate global car index across all formations
					const globalCarIndex =
						formations
							.slice(0, formationIndex)
							.reduce((sum, f) => sum + f.carInfoList.length, 0) + carIndex;

					return (
						<details
							open
							// eslint-disable-next-line react/no-array-index-key
							key={`car-${formationIndex}-${carIndex}`}
							ref={(el) => {
								if (el) {
									carDetailsRefs.current[globalCarIndex] = el;
								}
							}}
							className={styles.subSection}
						>
							<summary className={styles.subTitleRow}>
								<span className={styles.subTitle}>
									{carIndex + 1}号車 ({carState.carType})
								</span>
								<button
									type="button"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onRemoveCar(formationIndex, carIndex);
									}}
									disabled={formation.carInfoList.length <= 1}
									className={styles.deleteButton}
								>
									削除
								</button>
							</summary>

							<div className={styles.fieldGrid}>
								{CAR_BASIC_FIELDS.map((field) => (
									<CarStateFormField
										key={field.fieldKey}
										formationIndex={formationIndex}
										carIndex={carIndex}
										field={field}
										carState={carState}
										updateCarState={(ci, updater) =>
											onUpdateCarState(formationIndex, ci, updater)
										}
										className={styles.formGroup}
									/>
								))}

								{CAR_STATES_FIELDS.map((field) => (
									<CarStateFormField
										key={field.fieldKey}
										formationIndex={formationIndex}
										carIndex={carIndex}
										field={field}
										carState={carState}
										updateCarState={(ci, updater) =>
											onUpdateCarState(formationIndex, ci, updater)
										}
										className={styles.formGroup}
									/>
								))}
							</div>

							<article className={styles.nestedSection}>
								<h4 className={styles.nestedTitle}>SIV系</h4>
								<div className={styles.fieldGrid}>
									<CarStateSelectField
										formationIndex={formationIndex}
										carIndex={carIndex}
										fieldKey="sivLineStateEnabled"
										label="sivLineState"
										value={
											carState.carState.sivLineState ? "present" : "undefined"
										}
										onChange={(_carIndex, value) =>
											onUpdateCarState(
												formationIndex,
												_carIndex,
												(current) => ({
													...current,
													carState: {
														...current.carState,
														sivLineState:
															value === "present"
																? (current.carState.sivLineState ?? {
																		isCgKForSIVOn: null,
																		isIvMSOn: false,
																		isIvHBOn: false,
																		isIvLOn: false,
																		isSIVOn: null,
																		is3phMKOn: null,
																		isIvCNOn: null,
																		isIVSMDSOn: null,
																		sivVoltage: null,
																		sivFrequency: null,
																	})
																: undefined,
													},
												}),
											)
										}
										options={ENABLED_OPTIONS}
										className={styles.formGroup}
									/>
								</div>

								{carState.carState.sivLineState ? (
									<div className={styles.fieldGrid}>
										{SIV_LINE_STATE_FIELDS.map((field) => (
											<CarStateFormField
												key={field.fieldKey}
												formationIndex={formationIndex}
												carIndex={carIndex}
												field={field}
												carState={carState}
												updateCarState={(ci, updater) =>
													onUpdateCarState(formationIndex, ci, updater)
												}
												className={styles.formGroup}
											/>
										))}
									</div>
								) : null}
							</article>

							<article className={styles.nestedSection}>
								<h4 className={styles.nestedTitle}>運転台系 (cabState)</h4>
								<div className={styles.fieldGrid}>
									<CarStateSelectField
										formationIndex={formationIndex}
										carIndex={carIndex}
										fieldKey="cabStateEnabled"
										label="cabState"
										value={carState.cabState ? "present" : "undefined"}
										onChange={(_carIndex, value) =>
											onUpdateCarState(
												formationIndex,
												_carIndex,
												(current) => ({
													...current,
													cabState:
														value === "present"
															? (current.cabState ?? createDefaultCabState())
															: undefined,
												}),
											)
										}
										options={ENABLED_OPTIONS}
										className={styles.formGroup}
									/>
								</div>

								{carState.cabState ? (
									<div className={styles.fieldGrid}>
										{CAB_STATE_FIELDS.map((field) => (
											<CarStateFormField
												key={field.fieldKey}
												formationIndex={formationIndex}
												carIndex={carIndex}
												field={field}
												carState={carState}
												updateCarState={(ci, updater) =>
													onUpdateCarState(formationIndex, ci, updater)
												}
												className={styles.formGroup}
											/>
										))}
									</div>
								) : null}
							</article>

							<article className={styles.nestedSection}>
								<h4 className={styles.nestedTitle}>台車系 (bogieState)</h4>
								<div className={styles.fieldGrid}>
									<CarStateSelectField
										formationIndex={formationIndex}
										carIndex={carIndex}
										fieldKey="bogieStateEnabled"
										label="bogieState"
										value={carState.bogieState ? "present" : "undefined"}
										onChange={(_carIndex, value) =>
											onUpdateCarState(
												formationIndex,
												_carIndex,
												(current) => ({
													...current,
													bogieState:
														value === "present"
															? (current.bogieState ??
																createDefaultBogieCommonState())
															: undefined,
												}),
											)
										}
										options={ENABLED_OPTIONS}
										className={styles.formGroup}
									/>
								</div>

								{carState.bogieState ? (
									<>
										<div className={styles.fieldGrid}>
											{BOGIE_COMMON_FIELDS.map((field) => (
												<CarStateFormField
													key={field.fieldKey}
													formationIndex={formationIndex}
													carIndex={carIndex}
													field={field}
													carState={carState}
													updateCarState={(ci, updater) =>
														onUpdateCarState(formationIndex, ci, updater)
													}
													className={styles.formGroup}
												/>
											))}
										</div>

										<article className={styles.nestedSectionInner}>
											<h5 className={styles.nestedTitle}>左台車</h5>
											<div className={styles.fieldGrid}>
												<CarStateSelectField
													formationIndex={formationIndex}
													carIndex={carIndex}
													fieldKey="leftBogieEnabled"
													label="left"
													value={
														carState.bogieState.left ? "present" : "undefined"
													}
													onChange={(_carIndex, value) =>
														onUpdateCarState(
															formationIndex,
															_carIndex,
															(current) => {
																if (!current.bogieState) {
																	return current;
																}
																return {
																	...current,
																	bogieState: {
																		...current.bogieState,
																		left:
																			value === "present"
																				? (current.bogieState.left ??
																					createDefaultBogieState())
																				: undefined,
																	},
																};
															},
														)
													}
													options={ENABLED_OPTIONS}
													className={styles.formGroup}
												/>

												{carState.bogieState.left
													? BOGIE_LEFT_FIELDS.map((field) => (
															<CarStateFormField
																key={field.fieldKey}
																formationIndex={formationIndex}
																carIndex={carIndex}
																field={field}
																carState={carState}
																updateCarState={(ci, updater) =>
																	onUpdateCarState(formationIndex, ci, updater)
																}
																className={styles.formGroup}
															/>
														))
													: null}
											</div>
										</article>

										<article className={styles.nestedSectionInner}>
											<h5 className={styles.nestedTitle}>右台車</h5>
											<div className={styles.fieldGrid}>
												<CarStateSelectField
													formationIndex={formationIndex}
													carIndex={carIndex}
													fieldKey="rightBogieEnabled"
													label="right"
													value={
														carState.bogieState.right ? "present" : "undefined"
													}
													onChange={(_carIndex, value) =>
														onUpdateCarState(
															formationIndex,
															_carIndex,
															(current) => {
																if (!current.bogieState) {
																	return current;
																}
																return {
																	...current,
																	bogieState: {
																		...current.bogieState,
																		right:
																			value === "present"
																				? (current.bogieState.right ??
																					createDefaultBogieState())
																				: undefined,
																	},
																};
															},
														)
													}
													options={ENABLED_OPTIONS}
													className={styles.formGroup}
												/>

												{carState.bogieState.right
													? BOGIE_RIGHT_FIELDS.map((field) => (
															<CarStateFormField
																key={field.fieldKey}
																formationIndex={formationIndex}
																carIndex={carIndex}
																field={field}
																carState={carState}
																updateCarState={(ci, updater) =>
																	onUpdateCarState(formationIndex, ci, updater)
																}
																className={styles.formGroup}
															/>
														))
													: null}
											</div>
										</article>
									</>
								) : null}
							</article>
						</details>
					);
				})}
			</div>
		</div>
	);
});
