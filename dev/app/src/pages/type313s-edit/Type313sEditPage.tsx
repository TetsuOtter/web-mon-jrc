import { memo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	setFormations,
	setConductorState,
	setCurrentLocation,
	setDestination,
	setTrainNumber,
	setTrainType,
	resetState,
} from "../../store/monitors/type313s/type313sSlice";

import styles from "./Type313sEditPage.module.css";
import CarCompositionDiagram from "./components/CarCompositionDiagram";
import CarStateFormField from "./components/CarStateFormField";
import CarStateSelectField from "./components/CarStateSelectField";
import FormField from "./components/FormField";
import SelectField from "./components/SelectField";
import {
	CAR_BASIC_FIELDS,
	CAR_STATES_FIELDS,
	SIV_LINE_STATE_FIELDS,
	CAB_STATE_FIELDS,
	BOGIE_COMMON_FIELDS,
	BOGIE_LEFT_FIELDS,
	BOGIE_RIGHT_FIELDS,
	ENABLED_OPTIONS,
	NULLABLE_BOOLEAN_OPTIONS,
	createDefaultCabState,
	createDefaultBogieState,
	createDefaultBogieCommonState,
	createDefaultCarState,
	nullableBooleanToSelectValue,
	selectValueToNullableBoolean,
} from "./fieldDefinitions";

import type { FormFieldConfig } from "./types";
import type {
	Type313sConductorState,
	Type313sCarInfoState,
} from "../../store/monitors/type313s/type313sTypes";

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
	const dispatch = useAppDispatch();
	const carDetailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);
	const conductorState = useAppSelector(
		(state) => state.monitors.type313s.conductorState,
	);
	const formations = useAppSelector(
		(state) => state.monitors.type313s.formations,
	);

	const updateConductorState = useCallback(
		(key: keyof Type313sConductorState, value: boolean | null) => {
			dispatch(setConductorState({ ...conductorState, [key]: value }));
		},
		[conductorState, dispatch],
	);

	const updateCarState = useCallback(
		(
			formationIndex: number,
			carIndex: number,
			updater: (car: Type313sCarInfoState) => Type313sCarInfoState,
		) => {
			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: f.carInfoList.map((carState, ci) =>
										ci === carIndex ? updater(carState) : carState,
									),
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleAddFormation = useCallback(() => {
		dispatch(
			setFormations([
				...formations,
				{ carInfoList: [createDefaultCarState(1)] },
			]),
		);
	}, [formations, dispatch]);

	const handleRemoveFormation = useCallback(
		(formationIndex: number) => {
			if (formations.length <= 1) {
				return;
			}
			dispatch(
				setFormations(formations.filter((_, fi) => fi !== formationIndex)),
			);
		},
		[formations, dispatch],
	);

	const handleAddCar = useCallback(
		(formationIndex: number) => {
			const formation = formations[formationIndex];
			if (!formation || formation.carInfoList.length >= 12) {
				return;
			}
			const maxCarNumber = formation.carInfoList.reduce(
				(maxValue, carState) => Math.max(maxValue, carState.carNumber),
				0,
			);
			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: [
										...f.carInfoList,
										createDefaultCarState(maxCarNumber + 1),
									],
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleRemoveCar = useCallback(
		(formationIndex: number, carIndex: number) => {
			const formation = formations[formationIndex];
			if (!formation || formation.carInfoList.length <= 1) {
				return;
			}
			dispatch(
				setFormations(
					formations.map((f, fi) =>
						fi === formationIndex
							? {
									...f,
									carInfoList: f.carInfoList.filter((_, ci) => ci !== carIndex),
								}
							: f,
					),
				),
			);
		},
		[formations, dispatch],
	);

	const handleResetState = useCallback(() => {
		if (window.confirm("本当にデータをリセットしてもよろしいですか?")) {
			dispatch(resetState());
		}
	}, [dispatch]);

	const handleCompositionItemClick = useCallback((index: number) => {
		const element = carDetailsRefs.current[index];
		if (!element) return;

		// carListContainerをスクロール対象にする
		const scrollContainer = element.parentElement;
		if (!scrollContainer) return;

		// 要素がスクロールコンテナのどの位置にあるかを計算
		const elementRect = element.getBoundingClientRect();
		const containerRect = scrollContainer.getBoundingClientRect();

		// 要素の左端がコンテナの左端からどれだけ離れているか
		const relativeLeft =
			elementRect.left - containerRect.left + scrollContainer.scrollLeft;

		// 要素をコンテナの左端から少しオフセットした位置に配置
		const offsetLeft = Math.max(0, relativeLeft - 20);
		scrollContainer.scrollLeft = offsetLeft;
	}, []);

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1>313系 モニター設定</h1>
				<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
					<button
						type="button"
						onClick={handleResetState}
						className={styles.deleteButton}
						style={{ marginRight: "auto" }}
					>
						↻ リセット
					</button>
					<Link
						to="/"
						className={styles.homeLink}
					>
						← トップへ戻る
					</Link>
				</div>
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
					<details
						open
						className={styles.collapseSection}
					>
						<summary className={styles.sectionSummary}>車掌状態</summary>
						<div className={styles.fieldGrid}>
							<SelectField
								id="conductor-isRoomLightOn"
								label="室内灯"
								value={nullableBooleanToSelectValue(
									conductorState.isRoomLightOn,
								)}
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
								value={nullableBooleanToSelectValue(
									conductorState.isGuidanceOn,
								)}
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

				<section className={styles.section}>
					<details
						open
						className={styles.collapseSection}
					>
						<summary className={styles.sectionSummaryWithAction}>
							<span>編成・車両状態</span>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleAddFormation();
								}}
								className={styles.actionButton}
							>
								+ 編成追加
							</button>
						</summary>

						{formations.map((formation, formationIndex) => (
							<details
								open
								// eslint-disable-next-line react/no-array-index-key
								key={`formation-${formationIndex}`}
								className={styles.collapseSection}
							>
								<summary className={styles.sectionSummaryWithAction}>
									<span>編成 {formationIndex + 1}</span>
									<div style={{ display: "flex", gap: "8px" }}>
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleAddCar(formationIndex);
											}}
											disabled={formation.carInfoList.length >= 12}
											className={styles.actionButton}
										>
											+ 車両追加
										</button>
										<button
											type="button"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleRemoveFormation(formationIndex);
											}}
											disabled={formations.length <= 1}
											className={styles.deleteButton}
										>
											編成削除
										</button>
									</div>
								</summary>
								<div className={styles.carCompositionSection}>
									<h3 className={styles.carCompositionTitle}>編成構成</h3>
									<div className={styles.carCompositionList}>
										{formation.carInfoList.map((carState, carIndex) => (
											<div
												// eslint-disable-next-line react/no-array-index-key
												key={`composition-${formationIndex}-${carIndex}`}
												className={styles.carCompositionItem}
												onClick={() => handleCompositionItemClick(carIndex)}
												role="button"
												tabIndex={0}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														handleCompositionItemClick(carIndex);
													}
												}}
												style={{ cursor: "pointer" }}
											>
												<CarCompositionDiagram carState={carState} />
												<div className={styles.carInfo}>
													<div className={styles.carId}>
														{carState.carNumber}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								<div className={styles.carListContainer}>
									{formation.carInfoList.map((carState, carIndex) => (
										<details
											open
											// eslint-disable-next-line react/no-array-index-key
											key={`car-${formationIndex}-${carIndex}-${carState.carNumber}`}
											ref={(el) => {
												if (el) {
													carDetailsRefs.current[carIndex] = el;
												}
											}}
											className={styles.subSection}
										>
											<summary className={styles.subTitleRow}>
												<span className={styles.subTitle}>
													{carState.carNumber}号車 ({carState.carType})
												</span>
												<button
													type="button"
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														handleRemoveCar(formationIndex, carIndex);
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
															updateCarState(formationIndex, ci, updater)
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
															updateCarState(formationIndex, ci, updater)
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
															carState.carState.sivLineState
																? "present"
																: "undefined"
														}
														onChange={(_carIndex, value) =>
															updateCarState(
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
																	updateCarState(formationIndex, ci, updater)
																}
																className={styles.formGroup}
															/>
														))}
													</div>
												) : null}
											</article>

											<article className={styles.nestedSection}>
												<h4 className={styles.nestedTitle}>
													運転台系 (cabState)
												</h4>
												<div className={styles.fieldGrid}>
													<CarStateSelectField
														formationIndex={formationIndex}
														carIndex={carIndex}
														fieldKey="cabStateEnabled"
														label="cabState"
														value={carState.cabState ? "present" : "undefined"}
														onChange={(_carIndex, value) =>
															updateCarState(
																formationIndex,
																_carIndex,
																(current) => ({
																	...current,
																	cabState:
																		value === "present"
																			? (current.cabState ??
																				createDefaultCabState())
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
																	updateCarState(formationIndex, ci, updater)
																}
																className={styles.formGroup}
															/>
														))}
													</div>
												) : null}
											</article>

											<article className={styles.nestedSection}>
												<h4 className={styles.nestedTitle}>
													台車系 (bogieState)
												</h4>
												<div className={styles.fieldGrid}>
													<CarStateSelectField
														formationIndex={formationIndex}
														carIndex={carIndex}
														fieldKey="bogieStateEnabled"
														label="bogieState"
														value={
															carState.bogieState ? "present" : "undefined"
														}
														onChange={(_carIndex, value) =>
															updateCarState(
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
																		updateCarState(formationIndex, ci, updater)
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
																		carState.bogieState.left
																			? "present"
																			: "undefined"
																	}
																	onChange={(_carIndex, value) =>
																		updateCarState(
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
																					updateCarState(
																						formationIndex,
																						ci,
																						updater,
																					)
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
																		carState.bogieState.right
																			? "present"
																			: "undefined"
																	}
																	onChange={(_carIndex, value) =>
																		updateCarState(
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
																					updateCarState(
																						formationIndex,
																						ci,
																						updater,
																					)
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
									))}
								</div>
							</details>
						))}
					</details>
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
